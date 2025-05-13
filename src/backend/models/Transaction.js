const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Transaction schema for tracking NFT sales, purchases, and other blockchain transactions
 */
const TransactionSchema = new Schema({
  // Type of transaction (sale, purchase, mint, transfer, etc.)
  type: {
    type: String,
    enum: ['SALE', 'PURCHASE', 'MINT', 'TRANSFER', 'STAKING_REWARD', 'BREEDING_FEE'],
    required: true
  },
  
  // Reference to the NFT involved in the transaction
  nftId: {
    type: Schema.Types.ObjectId,
    ref: 'NFT',
    required: true
  },
  
  // User who is selling/sending the NFT (null for minting)
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // User who is buying/receiving the NFT
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Price in the platform's token (if applicable)
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  
  // Platform fee taken from the transaction (percentage)
  marketplaceFee: {
    type: Number,
    min: 0,
    default: 2.5 // 2.5% default fee
  },
  
  // Actual blockchain transaction data
  blockchain: {
    // Transaction hash on the blockchain
    txHash: {
      type: String,
      trim: true
    },
    // Block number when the transaction was confirmed
    blockNumber: Number,
    // Transaction timestamp from blockchain
    blockTimestamp: Date,
    // Gas used for the transaction
    gasUsed: Number,
    // Network where the transaction occurred (mainnet, testnet, etc.)
    network: {
      type: String,
      default: 'mainnet'
    }
  },
  
  // Transaction status
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  
  // Additional metadata or notes about the transaction
  metadata: {
    type: Object,
    default: {}
  },
  
  // Standard timestamps for record-keeping
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware: update the 'updatedAt' field on save
TransactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to confirm a transaction
TransactionSchema.methods.confirmTransaction = function(txHash, blockNumber) {
  this.status = 'CONFIRMED';
  this.blockchain.txHash = txHash;
  this.blockchain.blockNumber = blockNumber;
  this.blockchain.blockTimestamp = new Date();
  return this.save();
};

// Method to mark a transaction as failed
TransactionSchema.methods.failTransaction = function(reason) {
  this.status = 'FAILED';
  this.metadata.failureReason = reason;
  return this.save();
};

// Static method to find transactions by NFT ID
TransactionSchema.statics.findByNftId = function(nftId) {
  return this.find({ nftId }).sort({ createdAt: -1 }).populate('nftId sellerId buyerId');
};

// Static method to find transactions by user ID (as buyer or seller)
TransactionSchema.statics.findByUserId = function(userId) {
  return this.find({
    $or: [{ sellerId: userId }, { buyerId: userId }]
  }).sort({ createdAt: -1 }).populate('nftId sellerId buyerId');
};

// Static method to get recent transactions
TransactionSchema.statics.getRecent = function(limit = 10) {
  return this.find({ status: 'CONFIRMED' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('nftId sellerId buyerId');
};

// Create a virtual field for total amount (price + fee)
TransactionSchema.virtual('totalAmount').get(function() {
  return this.price * (1 + this.marketplaceFee / 100);
});

// Ensure virtual fields are included when converting to JSON
TransactionSchema.set('toJSON', { virtuals: true });
TransactionSchema.set('toObject', { virtuals: true });

// Create and export the model
const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction; 