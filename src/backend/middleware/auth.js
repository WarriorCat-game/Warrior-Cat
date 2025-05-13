/**
 * Authentication middleware for JWT verification
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'warrior_cat_secret';

/**
 * Middleware to protect routes
 * Verifies JWT token from Authorization header
 */
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Attach user to request object
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Token invalid or expired'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

/**
 * Middleware to check if user is admin
 * Must be used after the protect middleware
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Not authorized as an admin'
    });
  }
};

/**
 * Middleware to check for wallet authentication
 * Verifies signature from user wallet
 */
const walletAuth = async (req, res, next) => {
  try {
    const { walletAddress, signature, message } = req.body;
    
    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide walletAddress, signature, and message'
      });
    }
    
    // Verify the signature against the message and wallet address
    // This is a placeholder for actual wallet signature verification
    // Real implementation would use appropriate blockchain library
    
    const user = await User.findOne({ walletAddress });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Wallet not registered'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Wallet auth error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Wallet authentication error'
    });
  }
};

module.exports = {
  protect,
  admin,
  walletAuth,
  JWT_SECRET
}; 