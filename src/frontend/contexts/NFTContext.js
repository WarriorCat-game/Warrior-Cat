/**
 * NFT Context Provider for managing NFT-related state and actions
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut } from '../utils/api';
import { mintNFT } from '../utils/web3';
import { useAuth } from './AuthContext';

// Create the NFT context
const NFTContext = createContext();

/**
 * NFT Provider Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} NFTProvider component
 */
export const NFTProvider = ({ children }) => {
  // Get user authentication state
  const { user, isAuthenticated } = useAuth();
  
  // State for NFT data
  const [nfts, setNfts] = useState([]);
  const [marketplaceNfts, setMarketplaceNfts] = useState([]);
  const [selectedNft, setSelectedNft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for pagination and filtering
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: 'newest',
    isListed: '',
    minPrice: null,
    maxPrice: null,
    collection: ''
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  /**
   * Fetch NFTs owned by the user
   */
  const fetchUserNFTs = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiGet('/nft', { owner: user._id });
      
      if (response.success) {
        setNfts(response.data);
        setPagination({
          currentPage: response.pagination.current,
          totalPages: response.pagination.totalPages,
          totalItems: response.pagination.total
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user NFTs:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  /**
   * Fetch NFTs available in the marketplace
   */
  const fetchMarketplaceNFTs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiGet('/nft', {
        isListed: true,
        ...filters
      });
      
      if (response.success) {
        setMarketplaceNfts(response.data);
        setPagination({
          currentPage: response.pagination.current,
          totalPages: response.pagination.totalPages,
          totalItems: response.pagination.total
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching marketplace NFTs:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Fetch a single NFT by ID
   * 
   * @param {string} id - NFT ID
   * @returns {Promise<Object>} NFT data
   */
  const fetchNFTById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiGet(`/nft/${id}`);
      
      if (response.success) {
        setSelectedNft(response.data);
        return response.data;
      }
      
      return null;
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching NFT ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mint a new NFT
   * 
   * @param {Object} nftData - NFT metadata
   * @returns {Promise<Object>} Minting result
   */
  const createNFT = async (nftData) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to mint an NFT');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // First, mint the NFT using the blockchain utility
      const mintResult = await mintNFT(nftData);
      
      if (!mintResult.success) {
        throw new Error('Failed to mint NFT on blockchain');
      }
      
      // Then, register the NFT in our database
      const response = await apiPost('/nft', {
        ...nftData,
        tokenId: mintResult.tokenId,
        transactionHash: mintResult.transactionId
      });
      
      if (response.success) {
        // Add the new NFT to the user's collection
        setNfts(prevNfts => [response.data, ...prevNfts]);
        return response.data;
      }
      
      return null;
    } catch (err) {
      setError(err.message);
      console.error('Error creating NFT:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * List an NFT for sale
   * 
   * @param {string} id - NFT ID
   * @param {number} price - Listing price
   * @param {string} currency - Currency (default: 'SOL')
   * @returns {Promise<Object>} Listing result
   */
  const listNFT = async (id, price, currency = 'SOL') => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to list an NFT');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiPut(`/nft/${id}/list`, { price, currency });
      
      if (response.success) {
        // Update the NFT in our local state
        setNfts(prevNfts => 
          prevNfts.map(nft => 
            nft._id === id ? response.data : nft
          )
        );
        
        return response.data;
      }
      
      return null;
    } catch (err) {
      setError(err.message);
      console.error(`Error listing NFT ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Unlist an NFT from sale
   * 
   * @param {string} id - NFT ID
   * @returns {Promise<Object>} Unlisting result
   */
  const unlistNFT = async (id) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to unlist an NFT');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiPut(`/nft/${id}/unlist`);
      
      if (response.success) {
        // Update the NFT in our local state
        setNfts(prevNfts => 
          prevNfts.map(nft => 
            nft._id === id ? response.data : nft
          )
        );
        
        return response.data;
      }
      
      return null;
    } catch (err) {
      setError(err.message);
      console.error(`Error unlisting NFT ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Buy an NFT
   * 
   * @param {string} id - NFT ID
   * @param {string} transactionHash - Blockchain transaction hash
   * @returns {Promise<Object>} Purchase result
   */
  const buyNFT = async (id, transactionHash) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to buy an NFT');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiPost(`/nft/${id}/buy`, { transactionHash });
      
      if (response.success) {
        // Add the bought NFT to the user's collection
        setNfts(prevNfts => [response.data, ...prevNfts]);
        
        // Remove the NFT from the marketplace
        setMarketplaceNfts(prevNfts => 
          prevNfts.filter(nft => nft._id !== id)
        );
        
        return response.data;
      }
      
      return null;
    } catch (err) {
      setError(err.message);
      console.error(`Error buying NFT ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update filters for marketplace NFTs
   * 
   * @param {Object} newFilters - New filter values
   */
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Reset page to 1 when filters change
      page: newFilters.page || 1
    }));
  };

  // Fetch user NFTs when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserNFTs();
    } else {
      setNfts([]);
    }
  }, [isAuthenticated, fetchUserNFTs]);

  // Fetch marketplace NFTs when filters change
  useEffect(() => {
    fetchMarketplaceNFTs();
  }, [fetchMarketplaceNFTs]);

  // Context value
  const value = {
    // State
    nfts,
    marketplaceNfts,
    selectedNft,
    loading,
    error,
    filters,
    pagination,
    
    // Actions
    fetchUserNFTs,
    fetchMarketplaceNFTs,
    fetchNFTById,
    createNFT,
    listNFT,
    unlistNFT,
    buyNFT,
    updateFilters,
    setSelectedNft
  };

  return <NFTContext.Provider value={value}>{children}</NFTContext.Provider>;
};

/**
 * Custom hook to use the NFT context
 * @returns {Object} NFT context value
 */
export const useNFT = () => {
  const context = useContext(NFTContext);
  
  if (!context) {
    throw new Error('useNFT must be used within an NFTProvider');
  }
  
  return context;
}; 