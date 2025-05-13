/**
 * Authentication Context Provider for managing user auth state
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiPost } from '../utils/api';
import { STORAGE_KEYS } from '../utils/constants';
import { connectWallet, signMessage, getWalletAddress } from '../utils/web3';

// Create the auth context
const AuthContext = createContext();

/**
 * Authentication Provider Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} AuthProvider component
 */
export const AuthProvider = ({ children }) => {
  // State for user data and loading status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing auth on mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        
        if (token) {
          // Get user info from token
          // This would typically involve a call to a /me endpoint
          // For now, we'll just set a basic user object
          const userData = {
            token,
            // Additional user data would come from the API
            isAuthenticated: true
          };
          
          setUser(userData);
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        setError(err.message);
        // Clear potentially corrupted token
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      } finally {
        setLoading(false);
      }
    };

    checkExistingAuth();
  }, []);

  /**
   * Register a new user
   * 
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiPost('/users/register', userData);
      
      if (response.success && response.user && response.user.token) {
        // Store token
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.user.token);
        
        // Set user in state
        setUser({
          ...response.user,
          isAuthenticated: true
        });
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log in an existing user
   * 
   * @param {Object} credentials - User login credentials
   * @returns {Promise<Object>} Login result
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiPost('/users/login', credentials);
      
      if (response.success && response.user && response.user.token) {
        // Store token
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.user.token);
        
        // Set user in state
        setUser({
          ...response.user,
          isAuthenticated: true
        });
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out the current user
   */
  const logout = () => {
    // Remove token from storage
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    
    // Clear user from state
    setUser(null);
  };

  /**
   * Connect wallet and authenticate
   * 
   * @returns {Promise<Object>} Wallet connection result
   */
  const connectAndAuthWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Connect to wallet
      await connectWallet();
      
      // Get wallet address
      const walletAddress = getWalletAddress();
      
      if (!walletAddress) {
        throw new Error('Failed to get wallet address');
      }
      
      // Generate a message to sign
      const message = `Authenticate wallet ${walletAddress} with Warrior Cat at ${new Date().toISOString()}`;
      
      // Sign the message
      const { signature } = await signMessage(message);
      
      // Authenticate with backend
      const response = await apiPost('/users/wallet/login', {
        walletAddress,
        signature,
        message
      });
      
      if (response.success && response.user && response.user.token) {
        // Store token
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.user.token);
        
        // Set user in state
        setUser({
          ...response.user,
          isAuthenticated: true,
          walletConnected: true
        });
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Value object to provide through context
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    connectAndAuthWallet,
    isAuthenticated: !!user?.isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 