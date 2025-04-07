// Authentication middleware
import jwt from 'jsonwebtoken';
import { getUserById } from '../db/schemas/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tradeheaven-secret-key';

// Middleware to verify JWT token and attach user to request
export const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const user = getUserById(decoded.userId);
    if (!user) {
      return res.status(403).json({ error: 'Invalid token: User not found' });
    }
    
    // Attach user to request
    req.user = user;
    
    // Continue to next middleware or route handler
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    console.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'An error occurred during authentication' });
  }
};

// Optional middleware - attaches user if token is valid, but continues even if not
export const attachUser = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const user = getUserById(decoded.userId);
    
    // Attach user to request (or null if not found)
    req.user = user || null;
  } catch (error) {
    // If token is invalid, just set user to null
    req.user = null;
  }
  
  // Continue to next middleware or route handler
  next();
}; 