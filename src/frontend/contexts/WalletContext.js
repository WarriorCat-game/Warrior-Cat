import React, { createContext, useContext, useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Create Wallet context
const WalletContext = createContext();

// Custom hook to use wallet context
export const useWallet = () => useContext(WalletContext);

export const WalletContextProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [provider, setProvider] = useState(null);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    // Initialize Solana connection
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    setConnection(connection);

    // Check if Phantom wallet is installed
    const checkForPhantom = () => {
      if ('solana' in window) {
        const provider = window.solana;
        if (provider.isPhantom) {
          setProvider(provider);
          
          // Try to reconnect if the wallet was previously connected
          if (provider.isConnected) {
            setConnected(true);
            setWalletAddress(provider.publicKey.toString());
          }
          
          // Register event listeners
          provider.on('connect', (publicKey) => {
            setConnected(true);
            setWalletAddress(publicKey.toString());
          });
          
          provider.on('disconnect', () => {
            setConnected(false);
            setWalletAddress('');
          });
        }
      }
    };
    
    checkForPhantom();
    
    return () => {
      // Cleanup listeners if needed
      if (provider) {
        provider.removeAllListeners();
      }
    };
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    if (!provider) {
      window.open('https://phantom.app/', '_blank');
      return;
    }
    
    try {
      const { publicKey } = await provider.connect();
      setConnected(true);
      setWalletAddress(publicKey.toString());
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = () => {
    if (provider) {
      provider.disconnect();
      setConnected(false);
      setWalletAddress('');
    }
  };
  
  // Get wallet balance
  const getBalance = async () => {
    if (!connected || !connection) return 0;
    
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await connection.getBalance(publicKey);
      return balance / 1000000000; // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  };
  
  // Context value
  const value = {
    connected,
    walletAddress,
    provider,
    connection,
    connectWallet,
    disconnectWallet,
    getBalance
  };
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 