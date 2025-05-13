/**
 * Deployment script for Warrior Cat NFT Game
 * 
 * This script handles the deployment of smart contracts to the Solana blockchain
 */

const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Contract paths
const NFT_CONTRACT_PATH = path.join(__dirname, '../src/nft_items.js');
const TOKEN_CONTRACT_PATH = path.join(__dirname, '../src/wcat_token.js');

/**
 * Deploy contracts to Solana blockchain
 * @param {string} network - The network to deploy to (mainnet, testnet, devnet)
 * @returns {Promise<{nftContract: string, tokenContract: string}>} - Deployed contract addresses
 */
async function deployContracts(network = 'devnet') {
  console.log(`Deploying contracts to ${network}...`);
  
  // Connect to the network
  const connection = new Connection(
    network === 'mainnet' 
      ? process.env.SOLANA_MAINNET_RPC 
      : network === 'testnet'
        ? process.env.SOLANA_TESTNET_RPC
        : process.env.SOLANA_DEVNET_RPC,
    'confirmed'
  );
  
  // Load wallet key from environment or file
  let wallet;
  try {
    const keypairFile = process.env.SOLANA_KEYPAIR_FILE;
    if (keypairFile) {
      const keypairData = JSON.parse(fs.readFileSync(keypairFile, 'utf8'));
      wallet = Keypair.fromSecretKey(new Uint8Array(keypairData));
    } else {
      throw new Error('No keypair file specified');
    }
  } catch (error) {
    console.error('Error loading wallet:', error);
    process.exit(1);
  }
  
  // Deploy NFT contract
  console.log('Deploying NFT contract...');
  const nftContractAddress = await deployNFTContract(connection, wallet);
  console.log(`NFT contract deployed at: ${nftContractAddress}`);
  
  // Deploy token contract
  console.log('Deploying token contract...');
  const tokenContractAddress = await deployTokenContract(connection, wallet, nftContractAddress);
  console.log(`Token contract deployed at: ${tokenContractAddress}`);
  
  return {
    nftContract: nftContractAddress,
    tokenContract: tokenContractAddress
  };
}

/**
 * Deploy NFT contract
 * @param {Connection} connection - Solana connection
 * @param {Keypair} wallet - Deployer wallet
 * @returns {Promise<string>} - Contract address
 */
async function deployNFTContract(connection, wallet) {
  // Implementation would load the contract and deploy to Solana
  // This is a placeholder for the actual deployment logic
  console.log('Loading NFT contract from:', NFT_CONTRACT_PATH);
  
  // For demo purposes, return a placeholder address
  return new PublicKey('NFTxyz789DefGHIjkLMNopqRSTuvwXYZ12345678').toString();
}

/**
 * Deploy token contract
 * @param {Connection} connection - Solana connection
 * @param {Keypair} wallet - Deployer wallet
 * @param {string} nftContractAddress - Address of the NFT contract
 * @returns {Promise<string>} - Contract address
 */
async function deployTokenContract(connection, wallet, nftContractAddress) {
  // Implementation would load the contract and deploy to Solana
  // This is a placeholder for the actual deployment logic
  console.log('Loading token contract from:', TOKEN_CONTRACT_PATH);
  console.log('Linking to NFT contract:', nftContractAddress);
  
  // For demo purposes, return a placeholder address
  return new PublicKey('TOKENabcDEFghiJKLmnoPQRstUVWxyz12345678').toString();
}

// Execute deployment if script is run directly
if (require.main === module) {
  deployContracts()
    .then(result => {
      console.log('Deployment completed successfully:');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(error => {
      console.error('Deployment failed:', error);
      process.exit(1);
    });
}

module.exports = { deployContracts }; 