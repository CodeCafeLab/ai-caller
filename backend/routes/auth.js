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

  // Use the specific host as domain in production to avoid domain scoping issues
  const cookieDomain = isProduction ? "aicaller.codecafelab.in" : undefined;

  // Main httpOnly cookie for server-side auth (so browser won't expose it to JS)
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only send on HTTPS in production
    sameSite: "strict",
  });
  res.json({ success: true, token });

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

// Logout endpoint - clear auth cookies
router.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain = isProduction ? "aicaller.codecafelab.in" : undefined;

  res.clearCookie("auth_token", {
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
