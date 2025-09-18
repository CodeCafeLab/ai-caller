// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key';

// JWT middleware with enhanced error handling and logging
const authenticateJWT = (req, res, next) => {
  console.log('\n[AUTH] === Starting Authentication Check ===');
  console.log(`[AUTH] Request URL: ${req.originalUrl}`);
  console.log(`[AUTH] Request Method: ${req.method}`);
  
  // 1. Try to get token from multiple sources
  let token;
  
  // Check Authorization header first (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    console.log('[AUTH] Token found in Authorization header');
  } 
  // Then check cookies
  else if (req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
    console.log('[AUTH] Token found in auth_token cookie');
  }
  // Then check query parameters (for testing only - not recommended for production)
  else if (req.query && req.query.token) {
    token = req.query.token;
    console.warn('[AUTH] WARNING: Token found in query parameter - this is not secure for production');
  }

  // 2. Log token presence (but not the actual token for security)
  if (token) {
    console.log(`[AUTH] Token found: ${token.substring(0, 10)}... (length: ${token.length})`);
  } else {
    console.log('[AUTH] No token found in request');
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required. No token provided.' 
    });
  }

  // 3. Verify the token
  console.log('[AUTH] Verifying token...');
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('[AUTH] Token verification failed:', err.name, '-', err.message);
      
      let errorMessage = 'Invalid or expired token';
      let statusCode = 401;
      
      // Provide more specific error messages
      if (err.name === 'TokenExpiredError') {
        errorMessage = 'Session expired. Please log in again.';
        statusCode = 403; // Forbidden
      } else if (err.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid authentication token';
      }
      
      return res.status(statusCode).json({ 
        success: false, 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    
    // 4. Token is valid, attach user to request
    console.log('[AUTH] Token verified successfully. User:', { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      type: user.type
    });
    
    // Attach user to request for use in route handlers
    req.user = user;
    
    // Add user info to response locals for logging
    res.locals.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    
    // Continue to the next middleware/route handler
    next();
  });
};

// Optional: Role-based access control middleware
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to access this resource' 
      });
    }
    
    next();
  };
};

module.exports = { 
  authenticateJWT, 
  authorize,
  JWT_SECRET 
};