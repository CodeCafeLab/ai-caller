// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const { JWT_SECRET } = require("../middleware/auth");

/**
 * Notes:
 * - Cookie name: auth_token (used for both admin and client)
 * - Token is also returned in response body (so frontend can store it in localStorage)
 * - Cookie settings are conservative: no experimental flags, secure used only when request is HTTPS or NODE_ENV=production
 * - Domain for production: aicaller.codecafelab.in (explicit host avoids some browser issues)
 */

// Helper to set cookies consistently
function setAuthCookies(res, token, req) {
  const isProduction = process.env.NODE_ENV === "production";
  // Determine if incoming request is secure (works behind proxy if app.set('trust proxy', 1) is set)
  const reqIsSecure =
    req.secure || (req.headers && req.headers["x-forwarded-proto"] === "https");
  const secureFlag = isProduction || reqIsSecure;

  // Don't set domain in production - let it default to current domain
  const cookieDomain = undefined; // Removed explicit domain setting

  console.log(`[AUTH] Setting cookies - Production: ${isProduction}, Secure: ${secureFlag}, Host: ${req.get('host')}`);

  // Main httpOnly cookie for server-side auth (so browser won't expose it to JS)
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: secureFlag,
    sameSite: isProduction ? "lax" : "lax", // Changed from "none" to "lax" for better compatibility
    domain: cookieDomain,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  // Also set token cookie for backward compatibility
  res.cookie("token", token, {
    httpOnly: true,
    secure: secureFlag,
    sameSite: isProduction ? "lax" : "lax",
    domain: cookieDomain,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  // Optional non-httpOnly flag that front-end can read (boolean marker)
  res.cookie("isAuthenticated", "true", {
    httpOnly: false,
    secure: secureFlag,
    sameSite: isProduction ? "lax" : "lax",
    domain: cookieDomain,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });
}

// Combined Login endpoint for both admins and clients
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(`[AUTH] Login attempt for: ${email}`);

  // Try admin first
  db.query(
    "SELECT * FROM admin_users WHERE email = ?",
    [email],
    async (err, adminResults) => {
      if (err) {
        console.error("[AUTH] Admin lookup error:", err);
        return res
          .status(500)
          .json({ success: false, message: "DB error", error: err.message });
      }

      // If found in admin_users
      if (adminResults.length > 0) {
        const user = adminResults[0];
        try {
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            console.log("[AUTH] Admin password invalid for:", email);
            return res
              .status(401)
              .json({ success: false, message: "Invalid credentials" });
          }

          // Update lastLogin
          db.query(
            "UPDATE admin_users SET lastLogin = NOW() WHERE id = ?",
            [user.id],
            (uErr) => {
              if (uErr)
                console.warn(
                  "[AUTH] Failed to update lastLogin:",
                  uErr.message
                );
            }
          );

          const token = jwt.sign(
            {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.roleName,
              type: "admin",
            },
            JWT_SECRET,
            { expiresIn: "1d" }
          );

          // Set cookies
          setAuthCookies(res, token, req);

          const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.roleName,
            type: "admin",
          };

          console.log("[AUTH] Admin login successful:", {
            id: user.id,
            email: user.email,
          });
          return res.status(200).json({
            success: true,
            message: "Login successful",
            user: userData,
            token,
            expiresIn: 24 * 60 * 60 * 1000,
          });
        } catch (err) {
          console.error("[AUTH] Error in admin authentication:", err);
          return res
            .status(500)
            .json({ success: false, message: "Authentication error" });
        }
      }

      // If not an admin, try clients table
      console.log(
        "[AUTH] Not found in admin_users, trying clients table for:",
        email
      );
      db.query(
        "SELECT * FROM clients WHERE companyEmail = ?",
        [email],
        async (err2, clientResults) => {
          if (err2) {
            console.error("[AUTH] Client lookup error:", err2);
            return res
              .status(500)
              .json({
                success: false,
                message: "DB error",
                error: err2.message,
              });
          }
          if (!clientResults.length) {
            console.log("[AUTH] Email not found in clients table:", email);
            return res
              .status(401)
              .json({ success: false, message: "Invalid credentials" });
          }

          const client = clientResults[0];
          try {
            let isValidPassword = false;

            // If adminPassword looks like bcrypt hash, use bcrypt
            if (
              client.adminPassword &&
              typeof client.adminPassword === "string" &&
              client.adminPassword.startsWith("$2")
            ) {
              try {
                isValidPassword = await bcrypt.compare(
                  password,
                  client.adminPassword
                );
                console.log(
                  "[AUTH] Bcrypt comparison result for client:",
                  isValidPassword
                );
              } catch (bcryptErr) {
                console.error(
                  "[AUTH] Bcrypt compare error, falling back to plain-text check:",
                  bcryptErr.message
                );
                isValidPassword = password === client.adminPassword;
              }
            } else {
              // Plain-text stored password (legacy) — do plain comparison and upgrade to hashed password if matches
              console.log(
                "[AUTH] Stored client password not hashed, performing plain-text comparison"
              );
              isValidPassword = password === client.adminPassword;
              console.log(
                "[AUTH] Plain-text comparison result for client:",
                isValidPassword
              );

              if (isValidPassword) {
                // Upgrade to bcrypt hash (do not await to avoid blocking response significantly)
                bcrypt
                  .hash(password, 10)
                  .then((hashed) => {
                    db.query(
                      "UPDATE clients SET adminPassword = ? WHERE id = ?",
                      [hashed, client.id],
                      (updateErr) => {
                        if (updateErr) {
                          console.error(
                            "[AUTH] Failed to upgrade client password to hash:",
                            updateErr.message
                          );
                        } else {
                          console.log(
                            "[AUTH] Successfully upgraded client password to hash for id:",
                            client.id
                          );
                        }
                      }
                    );
                  })
                  .catch((hashErr) => {
                    console.error(
                      "[AUTH] Error hashing password for upgrade:",
                      hashErr.message
                    );
                  });
              }
            }

            if (!isValidPassword) {
              console.log("[AUTH] Client password invalid for:", email);
              return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
            }

            // Create JWT token for client admin
            const token = jwt.sign(
              {
                id: client.id,
                name: client.companyName,
                email: client.companyEmail,
                role: "client_admin",
                type: "client",
                companyName: client.companyName,
              },
              JWT_SECRET,
              { expiresIn: "1d" }
            );

            // Set cookies (same cookie name as admin)
            setAuthCookies(res, token, req);

            const userData = {
              id: client.id,
              name: client.companyName,
              email: client.companyEmail,
              type: "client",
              role: "client_admin",
            };

            console.log("[AUTH] Client login successful:", {
              id: client.id,
              email: client.companyEmail,
            });
            return res.status(200).json({
              success: true,
              message: "Login successful",
              user: userData,
              token,
              expiresIn: 24 * 60 * 60 * 1000,
            });
          } catch (errClient) {
            console.error("[AUTH] Error in client authentication:", errClient);
            return res
              .status(500)
              .json({ success: false, message: "Authentication error" });
          }
        }
      );
    }
  );
});

// Client Admin Login endpoint (explicit route kept for backward compatibility)
router.post("/client-admin/login", async (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM clients WHERE companyEmail = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("[AUTH] Client-admin lookup error:", err);
        return res
          .status(500)
          .json({ success: false, message: "DB error", error: err.message });
      }
      if (!results.length) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      const client = results[0];
      try {
        let isValidPassword = false;

        try {
          isValidPassword = await bcrypt.compare(
            password,
            client.adminPassword
          );
        } catch (hashError) {
          console.log(
            "[AUTH] Hash comparison failed, trying plain-text comparison"
          );
          isValidPassword = password === client.adminPassword;

          if (isValidPassword) {
            // Upgrade to hashed password asynchronously
            bcrypt
              .hash(password, 10)
              .then((hashed) => {
                db.query(
                  "UPDATE clients SET adminPassword = ? WHERE id = ?",
                  [hashed, client.id],
                  (updateErr) => {
                    if (updateErr)
                      console.error(
                        "[AUTH] Failed to upgrade password to hash:",
                        updateErr.message
                      );
                    else
                      console.log(
                        "[AUTH] Upgraded client password to hash for id:",
                        client.id
                      );
                  }
                );
              })
              .catch((e) => console.error("[AUTH] Hashing error:", e.message));
          }
        }

        if (!isValidPassword) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
          {
            id: client.id,
            name: client.companyName,
            email: client.companyEmail,
            role: "client_admin",
            type: "client",
          },
          JWT_SECRET,
          { expiresIn: "1d" }
        );

        setAuthCookies(res, token, req);

        return res.status(200).json({
          success: true,
          user: {
            id: client.id,
            email: client.companyEmail,
            role: "client_admin",
            type: "client",
            companyName: client.companyName,
          },
          token,
          expiresIn: 24 * 60 * 60 * 1000,
        });
      } catch (err) {
        console.error("[AUTH] Error in client-admin authentication:", err);
        return res
          .status(500)
          .json({ success: false, message: "Authentication error" });
      }
    }
  );
});

// Client User Login endpoint
router.post('/client-user/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Client user login attempt for:', email);
  
  // Find client user with role information
  db.query(`
    SELECT cu.*, ur.role_name, ur.permissions_summary, c.companyName 
    FROM client_users cu 
    LEFT JOIN user_roles ur ON cu.role_id = ur.id
    LEFT JOIN clients c ON cu.client_id = c.id
    WHERE cu.email = ? AND cu.status = 'Active'
  `, [email], async (err, results) => {
    if (err) {
      console.error('Client user lookup error:', err);
      return res.status(500).json({ success: false, message: 'DB error', error: err });
    }
    
    if (!results.length) {
      console.log('Client user not found or inactive');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const clientUser = results[0];
    console.log('Found client user:', { id: clientUser.id, email: clientUser.email, role: clientUser.role_name });
    console.log('Client user fields:', Object.keys(clientUser));
    console.log('Client user password field:', clientUser.password);
    
    try {
      let isValidPassword = false;

      // Check if password field exists
      if (!clientUser.password) {
        console.log('No password field found in client user record');
        // For now, allow login with any password if no password is set (temporary solution)
        isValidPassword = true;
        console.log('Allowing login without password validation (temporary)');
      } else {
        // First try bcrypt comparison (for hashed passwords)
        try {
          isValidPassword = await bcrypt.compare(password, clientUser.password);
        } catch (hashError) {
          // If bcrypt.compare fails, it might be a plain-text password
          console.log('Hash comparison failed, trying plain-text comparison');
          isValidPassword = (password === clientUser.password);

          // If plain-text password is correct, upgrade it to hashed
          if (isValidPassword) {
            console.log('Plain-text password matched. Upgrading to hashed password...');
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query(
              'UPDATE client_users SET password = ? WHERE id = ?',
              [hashedPassword, clientUser.id],
              (updateErr) => {
                if (updateErr) {
                  console.error('Failed to upgrade password to hash:', updateErr);
                  // Continue anyway since login is successful
                } else {
                  console.log('Successfully upgraded password to hash');
                }
              }
            );
          }
        }
      }

      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Update last login
      db.query(
        'UPDATE client_users SET last_login = NOW() WHERE id = ?',
        [clientUser.id],
        (updateErr) => {
          if (updateErr) {
            console.error('Failed to update last login:', updateErr);
            // Continue anyway since login is successful
          }
        }
      );

      // Parse permissions
      let permissions = [];
      try {
        permissions = JSON.parse(clientUser.permissions_summary || '[]');
      } catch (parseError) {
        console.error('Error parsing permissions:', parseError);
        permissions = [];
      }

      // Create JWT token for client user
      const token = jwt.sign(
        { 
          id: clientUser.id, 
          email: clientUser.email, 
          role: 'client_user',
          role_name: clientUser.role_name,
          permissions: permissions,
          client_id: clientUser.client_id,
          companyName: clientUser.companyName,
          full_name: clientUser.full_name
        },
        JWT_SECRET
        // No expiresIn - token will not expire until manual logout
      );

      // Set cookie with proper configuration for production
      const isProduction = process.env.NODE_ENV === 'production';
      const reqIsSecure = req.secure || (req.headers && req.headers['x-forwarded-proto'] === 'https');
      const secureFlag = isProduction || reqIsSecure;
      
      const cookieOptions = {
        httpOnly: true,
        path: '/',
        maxAge: 24*60*60*1000, // 24 hours
        secure: secureFlag,
        sameSite: 'lax' // Use lax for better compatibility
      };
      
      console.log(`[AUTH] Client user setting cookies - Production: ${isProduction}, Secure: ${secureFlag}`);
      
      res.cookie('auth_token', token, cookieOptions);
      res.cookie('token', token, cookieOptions);

      res.json({ 
        success: true, 
        token: token, // Include token in response for localStorage fallback
        user: { 
          id: clientUser.id, 
          email: clientUser.email, 
          role: 'client_user',
          role_name: clientUser.role_name,
          permissions: permissions,
          client_id: clientUser.client_id,
          companyName: clientUser.companyName,
          full_name: clientUser.full_name
        } 
      });
    } catch (err) {
      console.error('Error in client user authentication:', err);
      res.status(500).json({ success: false, message: 'Authentication error' });
    }
  });
});

// Logout endpoint - clear auth cookies
router.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain = undefined; // Don't set domain

  res.clearCookie("auth_token", {
    httpOnly: true,
    path: "/",
    domain: cookieDomain,
  });
  res.clearCookie("token", {
    httpOnly: true,
    path: "/",
    domain: cookieDomain,
  });
  res.clearCookie("isAuthenticated", {
    httpOnly: false,
    path: "/",
    domain: cookieDomain,
  });

  return res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
