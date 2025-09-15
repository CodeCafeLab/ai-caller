// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key';

// JWT middleware
const authenticateJWT = (req, res, next) => {
  console.log('[AUTH] Starting authentication check');
  console.log('[AUTH] Request headers:', JSON.stringify(req.headers, null, 2));
  // Get token from Authorization header or cookies
  const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
  console.log('[AUTH] Token found:', !!token);
  
  if (!token) {
    console.log('[AUTH] No token found in request');
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  console.log('[AUTH] Verifying token...');
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('[AUTH] Token verification failed:', err.message);
    } else {
      console.log('[AUTH] Token verified successfully. User:', { id: user.id, email: user.email, role: user.role });
    }
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateJWT, JWT_SECRET };
