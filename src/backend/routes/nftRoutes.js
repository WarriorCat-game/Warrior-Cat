/**
 * NFT routes
 */
const express = require('express');
const router = express.Router();
const {
  getNFTs,
  getNFTById,
  mintNFT,
  listNFT,
  unlistNFT,
  buyNFT
} = require('../controllers/nftController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getNFTs);
router.get('/:id', getNFTById);

// Protected routes (require authentication)
router.post('/', protect, mintNFT);
router.put('/:id/list', protect, listNFT);
router.put('/:id/unlist', protect, unlistNFT);
router.post('/:id/buy', protect, buyNFT);

module.exports = router; 