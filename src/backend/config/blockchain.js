/**
 * Blockchain configuration for the Warrior Cat NFT Game
 * 
 * Official Website: https://www.warriorcats.xyz
 * GitHub: https://github.com/WarriorCat-game/Warrior-Cat
 * Twitter: @Warrior_Cat_
 */

const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Load environment variables
const network = process.env.BLOCKCHAIN_NETWORK || 'devnet';
const rpcUrl = process.env.RPC_URL || 'https://api.devnet.solana.com';
const marketplaceWalletPath = process.env.MARKETPLACE_WALLET_PATH || '';

// Network endpoints
const endpoints = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  testnet: 'https://api.testnet.solana.com',
  devnet: 'https://api.devnet.solana.com',
};

// Select endpoint based on network
const endpoint = rpcUrl || endpoints[network] || endpoints.devnet;

// Create connection to Solana
const connection = new Connection(endpoint, 'confirmed');

// Load marketplace wallet if path provided
let marketplaceWallet = null;
if (marketplaceWalletPath) {
  try {
    const keypairData = JSON.parse(
      fs.readFileSync(path.resolve(marketplaceWalletPath), 'utf8')
    );
    marketplaceWallet = Keypair.fromSecretKey(new Uint8Array(keypairData));
    console.log('Marketplace wallet loaded successfully');
  } catch (error) {
    console.error('Failed to load marketplace wallet:', error);
  }
}

// NFT Program IDs
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
const NFT_PROGRAM_ID = process.env.NFT_PROGRAM_ID ? 
  new PublicKey(process.env.NFT_PROGRAM_ID) : 
  null;

// Project settings
const PROJECT = {
  name: 'Warrior Cat NFT Game',
  website: 'https://www.warriorcats.xyz',
  twitter: 'https://x.com/Warrior_Cat_',
  github: 'https://github.com/WarriorCat-game/Warrior-Cat',
  apiBaseUrl: process.env.API_BASE_URL || 'https://api.warriorcats.xyz',
  metadataBaseUrl: process.env.METADATA_BASE_URL || 'https://api.warriorcats.xyz/metadata',
};

module.exports = {
  network,
  connection,
  marketplaceWallet,
  TOKEN_PROGRAM_ID,
  METADATA_PROGRAM_ID,
  NFT_PROGRAM_ID,
  PROJECT,
  
  // Get a connection to the Solana network
  getConnection() {
    return connection;
  },
  
  // Get marketplace wallet
  getMarketplaceWallet() {
    return marketplaceWallet;
  },
  
  // Utility function to check if wallet is connected
  isMarketplaceWalletConnected() {
    return !!marketplaceWallet;
  },
  
  // Get the configured program ID for NFT operations
  getNFTProgramId() {
    return NFT_PROGRAM_ID;
  },
  
  // Get project information
  getProjectInfo() {
    return PROJECT;
  },
}; 