/**
 * Application configuration settings for Warrior Cat NFT Game
 * 
 * Official Website: https://www.warriorcats.xyz
 * GitHub: https://github.com/WarriorCat-game/Warrior-Cat
 * Twitter: @Warrior_Cat_
 */

const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

module.exports = {
  // Application settings
  app: {
    name: 'Warrior Cat NFT Game',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    url: process.env.APP_URL || 'http://localhost:3000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
    apiPrefix: '/api',
  },
  
  // Authentication settings
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'warrior-cat-secret-key',
    jwtExpiration: process.env.JWT_EXPIRATION || '7d',
    saltRounds: 10, 
  },
  
  // CORS settings
  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(',') || ['http://localhost:8080', 'https://www.warriorcats.xyz'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },
  
  // File uploads
  uploads: {
    path: process.env.UPLOAD_PATH || 'uploads/',
    maxSize: process.env.MAX_FILE_SIZE || 5242880, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  
  // Project information
  project: {
    name: 'Warrior Cat NFT Game',
    description: 'Collect, Trade, and Battle with Unique Warrior Cats on the Blockchain',
    website: 'https://www.warriorcats.xyz',
    twitter: 'https://x.com/Warrior_Cat_',
    github: 'https://github.com/WarriorCat-game/Warrior-Cat',
    apiBaseUrl: process.env.API_BASE_URL || 'https://api.warriorcats.xyz',
  },
  
  // Blockchain configuration
  blockchain: {
    network: process.env.BLOCKCHAIN_NETWORK || 'devnet',
    rpcUrl: process.env.RPC_URL || 'https://api.devnet.solana.com',
    marketplaceWallet: process.env.MARKETPLACE_WALLET || '',
    feePercentage: parseFloat(process.env.MARKETPLACE_FEE || '2.5'),
    nftContractAddress: process.env.NFT_CONTRACT_ADDRESS || '',
    tokenContractAddress: process.env.TOKEN_CONTRACT_ADDRESS || '',
  },
}; 