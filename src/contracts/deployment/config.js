/**
 * Smart Contract Deployment Configuration
 * This file contains configuration for deploying the Warrior Cat NFT Game contracts
 * 
 * Official Website: https://www.warriorcats.xyz
 * GitHub: https://github.com/WarriorCat-game/Warrior-Cat
 * Twitter: @Warrior_Cat_
 */

require('dotenv').config();

// Environment-specific RPC endpoints
const RPC_ENDPOINTS = {
  mainnet: process.env.SOLANA_MAINNET_RPC || 'https://api.mainnet-beta.solana.com',
  testnet: process.env.SOLANA_TESTNET_RPC || 'https://api.testnet.solana.com',
  devnet: process.env.SOLANA_DEVNET_RPC || 'https://api.devnet.solana.com',
  localhost: 'http://localhost:8899',
};

// Contract deployment configuration
const deploymentConfig = {
  // Default network to deploy to
  defaultNetwork: process.env.SOLANA_NETWORK || 'devnet',
  
  // Network-specific configurations
  networks: {
    mainnet: {
      url: RPC_ENDPOINTS.mainnet,
      // Solana mainnet requires higher priority fee settings
      priorityFee: {
        microLamports: 10000, // Higher priority fee for faster inclusion
        maxCostPercentage: 0.5, // Max 0.5% of transaction cost
      },
      // Confirmation strategy
      confirmations: 32,
      // Throttle API calls to avoid rate limiting
      rateLimit: true,
    },
    testnet: {
      url: RPC_ENDPOINTS.testnet,
      priorityFee: {
        microLamports: 5000,
        maxCostPercentage: 1.0,
      },
      confirmations: 16,
      rateLimit: true,
    },
    devnet: {
      url: RPC_ENDPOINTS.devnet,
      priorityFee: {
        microLamports: 1000,
        maxCostPercentage: 5.0,
      },
      confirmations: 1,
      rateLimit: false,
    },
    localhost: {
      url: RPC_ENDPOINTS.localhost,
      priorityFee: {
        microLamports: 0,
        maxCostPercentage: 0,
      },
      confirmations: 1,
      rateLimit: false,
    },
  },
  
  // Contract deployment parameters
  contracts: {
    // NFT contract for warrior cats
    nft: {
      name: 'WarriorCatNFT',
      symbol: 'WCAT',
      metadataBaseUri: process.env.NFT_METADATA_BASE_URI || 'https://api.warriorcats.xyz/metadata/',
      maxSupply: 10000,
      mintPrice: 1.0, // SOL
      royaltyBasisPoints: 500, // 5%
      creators: [
        {
          address: process.env.CREATOR_WALLET_ADDRESS,
          share: 100, // Percentage
        },
      ],
    },
    
    // Token contract for in-game currency
    token: {
      name: 'Warrior Token',
      symbol: 'WARR',
      decimals: 9,
      initialSupply: 1000000000, // 1 billion tokens
      mintAuthority: process.env.MINT_AUTHORITY_ADDRESS,
    },
    
    // Marketplace contract
    marketplace: {
      feeRecipient: process.env.FEE_RECIPIENT_ADDRESS,
      feePercentage: 2.5, // 2.5%
      allowedNFTs: [
        // Allow our own NFT contract by default
        '${nft.programId}',
      ],
      allowedPaymentTokens: [
        // Allow SOL by default
        'So11111111111111111111111111111111111111112',
        // And our own token
        '${token.programId}',
      ],
    },
    
    // Staking contract for token rewards
    staking: {
      rewardRate: 1000, // Tokens per day per NFT
      lockPeriods: [
        { days: 7, multiplier: 1.0 },
        { days: 30, multiplier: 1.25 },
        { days: 90, multiplier: 1.5 },
      ],
      earlyWithdrawalFee: 10, // 10%
    },
    
    // Breeding contract
    breeding: {
      cooldownPeriod: 7 * 24 * 60 * 60, // 7 days in seconds
      breedingPrice: 1000, // WARR tokens
      breedingPools: [
        { rarity: 'common', chance: 70 },
        { rarity: 'uncommon', chance: 20 },
        { rarity: 'rare', chance: 8 },
        { rarity: 'epic', chance: 1.5 },
        { rarity: 'legendary', chance: 0.5 },
      ],
    },
  },
  
  // Project metadata
  project: {
    name: 'Warrior Cat NFT Game',
    website: 'https://www.warriorcats.xyz',
    twitter: 'https://x.com/Warrior_Cat_',
    github: 'https://github.com/WarriorCat-game/Warrior-Cat',
    description: 'Collect, Trade, and Battle with Unique Warrior Cats on the Blockchain'
  },
  
  // Wallet configuration
  wallet: {
    // Path to wallet keypair file
    keypairPath: process.env.WALLET_KEYPAIR_PATH || './keypair.json',
    
    // Alternative: use a mnemonic phrase (more secure when in production)
    mnemonic: process.env.WALLET_MNEMONIC,
    
    // Control which wallet to use for different operations
    deployerWallet: process.env.DEPLOYER_WALLET_ADDRESS,
    adminWallet: process.env.ADMIN_WALLET_ADDRESS,
  },
  
  // Security settings
  security: {
    // Whether to verify programs after deployment
    verifyPrograms: true,
    
    // Multisig requirements for admin operations (mainnet only)
    multisigThreshold: 2, // Require 2 signatures
    multisigOwners: [
      process.env.MULTISIG_OWNER_1,
      process.env.MULTISIG_OWNER_2,
      process.env.MULTISIG_OWNER_3,
    ],
  },
  
  // Logging and monitoring
  logging: {
    // Log level: debug, info, warn, error
    level: process.env.LOG_LEVEL || 'info',
    
    // Whether to log to file
    logToFile: process.env.LOG_TO_FILE === 'true',
    logFilePath: process.env.LOG_FILE_PATH || './deployment.log',
  },
};

module.exports = deploymentConfig; 