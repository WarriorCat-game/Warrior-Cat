/**
 * User Controller
 * Handles user-related API requests
 */
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * @desc    Register new user
 * @route   POST /api/users/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }
    
    // Create new user
    const user = await User.create({
      username,
      email,
      password
    });
    
    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid user data'
      });
    }
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/users/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }
    
    // Find user by email and include password
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Connect wallet to user account
 * @route   POST /api/users/wallet/connect
 * @access  Private
 */
exports.connectWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Please provide wallet address'
      });
    }
    
    // Check if wallet is already connected to another account
    const walletExists = await User.findOne({ walletAddress });
    
    if (walletExists && walletExists._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Wallet already connected to another account'
      });
    }
    
    // Update user with wallet address
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { walletAddress },
      { new: true }
    );
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Connect wallet error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getUserProfile = async (req, res) => {
  try {
    // Get user from JWT token
    const user = await User.findById(req.user._id)
      .populate('nftCollection')
      .populate('gameData.characters');
    
    if (user) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          walletAddress: user.walletAddress,
          role: user.role,
          profileImage: user.profileImage,
          gameData: user.gameData,
          nftCollection: user.nftCollection
        }
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email, profileImage, currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    
    if (user) {
      // Update basic information if provided
      if (username) user.username = username;
      if (email) user.email = email;
      if (profileImage) user.profileImage = profileImage;
      
      // Update password if provided
      if (currentPassword && newPassword) {
        const isMatch = await user.matchPassword(currentPassword);
        
        if (!isMatch) {
          return res.status(400).json({
            success: false,
            error: 'Current password is incorrect'
          });
        }
        
        if (newPassword.length < 8) {
          return res.status(400).json({
            success: false,
            error: 'New password must be at least 8 characters long'
          });
        }
        
        user.password = newPassword;
      }
      
      const updatedUser = await user.save();
      
      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          walletAddress: updatedUser.walletAddress,
          role: updatedUser.role,
          profileImage: updatedUser.profileImage,
          token: generateToken(updatedUser._id)
        }
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/users
 * @access  Private
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    await User.findByIdAndDelete(req.user._id);
    
    res.json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 