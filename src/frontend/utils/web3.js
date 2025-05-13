/**
 * Web3 utility functions for blockchain interactions
 */
import { BLOCKCHAIN } from './constants';

/**
 * Checks if a wallet provider (like Phantom) is available
 * @returns {boolean} Whether wallet provider is available
 */
export const isWalletAvailable = () => {
  return typeof window !== 'undefined' && 
         window.solana && 
         window.solana.isPhantom;
};

/**
 * Connects to the user's wallet
 * @returns {Promise<Object>} Wallet connection details
 */
export const connectWallet = async () => {
  if (!isWalletAvailable()) {
    throw new Error('Phantom wallet is not installed');
  }
  
  try {
    const resp = await window.solana.connect();
    return {
      address: resp.publicKey.toString(),
      connected: true
    };
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw error;
  }
};

/**
 * Disconnects from the user's wallet
 * @returns {Promise<void>}
 */
export const disconnectWallet = async () => {
  if (isWalletAvailable()) {
    try {
      await window.solana.disconnect();
      return { connected: false };
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  }
};

/**
 * Gets the currently connected wallet address
 * @returns {string|null} Wallet address or null if not connected
 */
export const getWalletAddress = () => {
  if (isWalletAvailable() && window.solana.isConnected) {
    return window.solana.publicKey.toString();
  }
  return null;
};

/**
 * Signs a message with the connected wallet
 * @param {string} message - Message to sign
 * @returns {Promise<Object>} Signature and public key
 */
export const signMessage = async (message) => {
  if (!isWalletAvailable() || !window.solana.isConnected) {
    throw new Error('Wallet not connected');
  }
  
  try {
    // Convert string to Uint8Array
    const encodedMessage = new TextEncoder().encode(message);
    
    // Sign the message
    const signedMessage = await window.solana.signMessage(
      encodedMessage,
      'utf8'
    );
    
    return {
      signature: signedMessage.signature,
      publicKey: signedMessage.publicKey.toString()
    };
  } catch (error) {
    console.error('Error signing message:', error);
    throw error;
  }
};

/**
 * Mints an NFT
 * @param {Object} metadata - NFT metadata
 * @returns {Promise<Object>} Transaction result
 */
export const mintNFT = async (metadata) => {
  // This is a placeholder for the actual minting implementation
  // The real implementation would require connecting to the Solana network
  // and calling the appropriate smart contract methods
  
  if (!isWalletAvailable() || !window.solana.isConnected) {
    throw new Error('Wallet not connected');
  }
  
  console.log('Minting NFT with metadata:', metadata);
  console.log('Using collection address:', BLOCKCHAIN.NFT_COLLECTION_ADDRESS);
  
  // Mock response for now
  return {
    success: true,
    transactionId: `mock_tx_${Date.now()}`,
    tokenId: `token_${Date.now()}`
  };
};

/**
 * Gets the balance of WCAT tokens for the connected wallet
 * @returns {Promise<number>} Token balance
 */
export const getTokenBalance = async () => {
  // This is a placeholder for the actual balance checking implementation
  // The real implementation would require connecting to the Solana network
  // and querying the token account balance
  
  if (!isWalletAvailable() || !window.solana.isConnected) {
    throw new Error('Wallet not connected');
  }
  
  // Mock response for now
  return 100.5;
};

/**
 * Switches network (between mainnet and devnet)
 * @param {string} network - Network to switch to ('mainnet' or 'devnet')
 * @returns {Promise<Object>} Network switching result
 */
export const switchNetwork = async (network) => {
  if (!isWalletAvailable()) {
    throw new Error('Wallet not available');
  }
  
  // Phantom doesn't directly support network switching through its API
  // This would typically require the user to do it manually in the wallet
  
  console.log(`Request to switch to ${network} network`);
  
  // Return the current network instead
  return {
    success: false,
    message: 'Network switching not directly supported in Phantom wallet',
    currentNetwork: BLOCKCHAIN.NETWORK
  };
}; 