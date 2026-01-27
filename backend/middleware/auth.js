// Authentication Middleware for JWT
// Protects admin routes and validates JWT tokens

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRY = '24h';

/**
 * Generate JWT token for authenticated admin
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

/**
 * Verify JWT token middleware
 */
export const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'No token provided' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Please login again' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Authentication failed' 
      });
    }
    
    return res.status(500).json({ 
      error: 'Authentication error',
      message: error.message 
    });
  }
};

/**
 * Optional authentication middleware
 * Continues even if no token provided
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

export default {
  generateToken,
  verifyToken,
  optionalAuth,
  JWT_SECRET,
  JWT_EXPIRY
};
