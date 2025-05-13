/**
 * NFT model definition
 */
const mongoose = require('mongoose');

const NFTSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mintedAt: {
    type: Date,
    default: Date.now
  },
  attributes: [
    {
      trait_type: {
        type: String,
        required: true
      },
      value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
      }
    }
  ],
  metadata: {
    collection: {
      type: String,
      required: true
    },
    blockchain: {
      type: String,
      enum: ['solana', 'ethereum'],
      default: 'solana'
    },
    contractAddress: {
      type: String,
      required: true
    }
  },
  rarity: {
    score: {
      type: Number,
      default: 0
    },
    rank: {
      type: Number
    }
  },
  isListed: {
    type: Boolean,
    default: false
  },
  listingPrice: {
    type: Number,
    min: 0
  },
  listingCurrency: {
    type: String,
    default: 'SOL'
  },
  history: [
    {
      event: {
        type: String,
        enum: ['mint', 'transfer', 'list', 'unlist', 'sale'],
        required: true
      },
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      price: {
        type: Number
      },
      currency: {
        type: String
      },
      transactionHash: {
        type: String
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  gameProperties: {
    level: {
      type: Number,
      default: 1
    },
    strength: {
      type: Number,
      default: 10
    },
    agility: {
      type: Number,
      default: 10
    },
    intelligence: {
      type: Number,
      default: 10
    },
    stamina: {
      type: Number,
      default: 10
    },
    special: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Create indexes
NFTSchema.index({ tokenId: 1 });
NFTSchema.index({ owner: 1 });
NFTSchema.index({ isListed: 1, listingPrice: 1 });
NFTSchema.index({ 'metadata.collection': 1 });
NFTSchema.index({ 'rarity.rank': 1 });

// Virtual populate for collection details
NFTSchema.virtual('collectionDetails', {
  ref: 'Collection',
  localField: 'metadata.collection',
  foreignField: 'name',
  justOne: true
});

// Method to calculate the rarity score
NFTSchema.methods.calculateRarityScore = function() {
  if (!this.attributes || this.attributes.length === 0) {
    return 0;
  }
  
  // This is a simplified rarity calculation
  // A real implementation would be more complex and collection-specific
  let rarityScore = 0;
  
  // Add implementation here
  
  return rarityScore;
};

const NFT = mongoose.model('NFT', NFTSchema);

module.exports = NFT; 