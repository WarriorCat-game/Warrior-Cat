/**
 * NFT Controller
 * Handles NFT-related API requests
 */
const NFT = require('../models/NFT');
const User = require('../models/User');

/**
 * @desc    Get all NFTs with filtering
 * @route   GET /api/nft
 * @access  Public
 */
exports.getNFTs = async (req, res) => {
  try {
    // Build filter object from query parameters
    const filter = {};
    
    // Filter by owner if provided
    if (req.query.owner) {
      filter.owner = req.query.owner;
    }
    
    // Filter by collection if provided
    if (req.query.collection) {
      filter['metadata.collection'] = req.query.collection;
    }
    
    // Filter by listing status
    if (req.query.isListed === 'true') {
      filter.isListed = true;
    } else if (req.query.isListed === 'false') {
      filter.isListed = false;
    }
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.listingPrice = {};
      
      if (req.query.minPrice) {
        filter.listingPrice.$gte = Number(req.query.minPrice);
      }
      
      if (req.query.maxPrice) {
        filter.listingPrice.$lte = Number(req.query.maxPrice);
      }
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Sort options
    let sort = {};
    
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sort = { listingPrice: 1 };
          break;
        case 'price_desc':
          sort = { listingPrice: -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        case 'rarity':
          sort = { 'rarity.rank': 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    } else {
      sort = { createdAt: -1 };
    }
    
    // Execute query
    const nfts = await NFT.find(filter)
      .populate('owner', 'username profileImage walletAddress')
      .populate('creator', 'username profileImage walletAddress')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await NFT.countDocuments(filter);
    
    res.json({
      success: true,
      count: nfts.length,
      total,
      pagination: {
        current: page,
        totalPages: Math.ceil(total / limit),
        perPage: limit,
        total
      },
      data: nfts
    });
  } catch (error) {
    console.error('Get NFTs error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Get single NFT by ID
 * @route   GET /api/nft/:id
 * @access  Public
 */
exports.getNFTById = async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id)
      .populate('owner', 'username profileImage walletAddress')
      .populate('creator', 'username profileImage walletAddress');
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        error: 'NFT not found'
      });
    }
    
    res.json({
      success: true,
      data: nft
    });
  } catch (error) {
    console.error('Get NFT by ID error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'NFT not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Create new NFT (mint)
 * @route   POST /api/nft
 * @access  Private
 */
exports.mintNFT = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      attributes,
      metadata,
      tokenId
    } = req.body;
    
    // Validation
    if (!name || !description || !image || !tokenId || !metadata?.collection || !metadata?.contractAddress) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }
    
    // Check if NFT with this tokenId already exists
    const tokenExists = await NFT.findOne({ tokenId });
    
    if (tokenExists) {
      return res.status(400).json({
        success: false,
        error: 'NFT with this token ID already exists'
      });
    }
    
    // Create NFT document
    const nft = await NFT.create({
      tokenId,
      name,
      description,
      image,
      owner: req.user._id,
      creator: req.user._id,
      attributes: attributes || [],
      metadata,
      history: [
        {
          event: 'mint',
          from: null,
          to: req.user._id,
          transactionHash: req.body.transactionHash || `mockTx_${Date.now()}`,
          timestamp: Date.now()
        }
      ]
    });
    
    // Calculate rarity score if attributes are provided
    if (attributes && attributes.length > 0) {
      nft.rarity.score = nft.calculateRarityScore();
      await nft.save();
    }
    
    // Add NFT to user's collection
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { nftCollection: nft._id } },
      { new: true }
    );
    
    res.status(201).json({
      success: true,
      data: nft
    });
  } catch (error) {
    console.error('Mint NFT error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    List NFT for sale
 * @route   PUT /api/nft/:id/list
 * @access  Private
 */
exports.listNFT = async (req, res) => {
  try {
    const { price, currency } = req.body;
    
    if (!price || price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid price'
      });
    }
    
    // Find NFT by ID
    const nft = await NFT.findById(req.params.id);
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        error: 'NFT not found'
      });
    }
    
    // Check if user is the owner
    if (nft.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to list this NFT'
      });
    }
    
    // Update NFT with listing information
    nft.isListed = true;
    nft.listingPrice = price;
    nft.listingCurrency = currency || 'SOL';
    
    // Add listing event to history
    nft.history.push({
      event: 'list',
      from: req.user._id,
      price,
      currency: currency || 'SOL',
      timestamp: Date.now()
    });
    
    await nft.save();
    
    res.json({
      success: true,
      data: nft
    });
  } catch (error) {
    console.error('List NFT error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'NFT not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Unlist NFT from sale
 * @route   PUT /api/nft/:id/unlist
 * @access  Private
 */
exports.unlistNFT = async (req, res) => {
  try {
    // Find NFT by ID
    const nft = await NFT.findById(req.params.id);
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        error: 'NFT not found'
      });
    }
    
    // Check if user is the owner
    if (nft.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to unlist this NFT'
      });
    }
    
    // Check if NFT is listed
    if (!nft.isListed) {
      return res.status(400).json({
        success: false,
        error: 'NFT is not listed for sale'
      });
    }
    
    // Update NFT
    nft.isListed = false;
    nft.listingPrice = null;
    
    // Add unlisting event to history
    nft.history.push({
      event: 'unlist',
      from: req.user._id,
      timestamp: Date.now()
    });
    
    await nft.save();
    
    res.json({
      success: true,
      data: nft
    });
  } catch (error) {
    console.error('Unlist NFT error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'NFT not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Buy NFT
 * @route   POST /api/nft/:id/buy
 * @access  Private
 */
exports.buyNFT = async (req, res) => {
  try {
    const { transactionHash } = req.body;
    
    // Find NFT by ID
    const nft = await NFT.findById(req.params.id);
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        error: 'NFT not found'
      });
    }
    
    // Check if NFT is listed for sale
    if (!nft.isListed) {
      return res.status(400).json({
        success: false,
        error: 'NFT is not listed for sale'
      });
    }
    
    // Check if buyer is not the owner
    if (nft.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'You cannot buy your own NFT'
      });
    }
    
    const previousOwner = nft.owner;
    
    // Update NFT with new owner and reset listing
    nft.owner = req.user._id;
    nft.isListed = false;
    
    // Add sale event to history
    nft.history.push({
      event: 'sale',
      from: previousOwner,
      to: req.user._id,
      price: nft.listingPrice,
      currency: nft.listingCurrency,
      transactionHash: transactionHash || `mockTx_${Date.now()}`,
      timestamp: Date.now()
    });
    
    await nft.save();
    
    // Remove NFT from previous owner's collection
    await User.findByIdAndUpdate(
      previousOwner,
      { $pull: { nftCollection: nft._id } }
    );
    
    // Add NFT to new owner's collection
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { nftCollection: nft._id } }
    );
    
    res.json({
      success: true,
      data: nft
    });
  } catch (error) {
    console.error('Buy NFT error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'NFT not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 