/**
 * User routes
 */
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  connectWallet,
  getUserProfile,
  updateUserProfile,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require authentication)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.delete('/', protect, deleteUser);
router.post('/wallet/connect', protect, connectWallet);

module.exports = router; 