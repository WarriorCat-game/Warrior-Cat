import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import { useNFT } from '../contexts/NFTContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatAddress, formatDate } from '../utils/formatters';
import '../styles/pages/NFTDetail.css';

/**
 * NFT Detail page component for viewing individual NFT information
 * @returns {React.ReactElement} NFT Detail page
 */
const NFTDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const { 
    selectedNft, 
    loading, 
    error, 
    fetchNFTById, 
    buyNFT, 
    listNFT, 
    unlistNFT 
  } = useNFT();

  // Local state
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [listingPrice, setListingPrice] = useState('');
  const [listingCurrency, setListingCurrency] = useState('SOL');
  const [isPriceValid, setIsPriceValid] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [transactionError, setTransactionError] = useState('');

  // Fetch NFT data on mount
  useEffect(() => {
    fetchNFTById(id);
  }, [id, fetchNFTById]);

  // Handle price input change
  const handlePriceChange = (e) => {
    const value = e.target.value;
    setListingPrice(value);
    setIsPriceValid(value > 0);
  };

  // Handle currency change
  const handleCurrencyChange = (e) => {
    setListingCurrency(e.target.value);
  };

  // Handle list NFT
  const handleListNFT = async () => {
    if (!isPriceValid) return;
    
    setTransactionInProgress(true);
    setTransactionError('');
    
    try {
      await listNFT(id, parseFloat(listingPrice), listingCurrency);
      setIsListModalOpen(false);
    } catch (err) {
      setTransactionError(err.message);
    } finally {
      setTransactionInProgress(false);
    }
  };

  // Handle unlist NFT
  const handleUnlistNFT = async () => {
    setTransactionInProgress(true);
    setTransactionError('');
    
    try {
      await unlistNFT(id);
    } catch (err) {
      setTransactionError(err.message);
    } finally {
      setTransactionInProgress(false);
    }
  };

  // Handle buy NFT
  const handleBuyNFT = async () => {
    setTransactionInProgress(true);
    setTransactionError('');
    
    try {
      // In a real implementation, this would connect to a wallet and handle payment
      const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      await buyNFT(id, mockTransactionHash);
      setIsBuyModalOpen(false);
    } catch (err) {
      setTransactionError(err.message);
    } finally {
      setTransactionInProgress(false);
    }
  };

  // Handle going back to marketplace
  const handleBackToMarketplace = () => {
    navigate('/marketplace');
  };

  // Determine if current user is the owner
  const isOwner = selectedNft && isAuthenticated && user._id === selectedNft.owner._id;

  // NFT Attributes display
  const renderAttributes = () => {
    if (!selectedNft || !selectedNft.attributes || selectedNft.attributes.length === 0) {
      return <p className="no-attributes">No attributes found</p>;
    }

    return (
      <div className="nft-attributes-grid">
        {selectedNft.attributes.map((attr, index) => (
          <div key={index} className="nft-attribute">
            <span className="attribute-type">{attr.trait_type}</span>
            <span className="attribute-value">{attr.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="nft-detail-loader">
        <Loader size="large" text="Loading NFT details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="nft-detail-error">
        <h2>Error Loading NFT</h2>
        <p>{error}</p>
        <Button variant="primary" onClick={() => fetchNFTById(id)}>
          Try Again
        </Button>
        <Button variant="outline" onClick={handleBackToMarketplace}>
          Back to Marketplace
        </Button>
      </div>
    );
  }

  if (!selectedNft) {
    return (
      <div className="nft-detail-not-found">
        <h2>NFT Not Found</h2>
        <p>The NFT you're looking for doesn't exist or has been removed.</p>
        <Button variant="primary" onClick={handleBackToMarketplace}>
          Back to Marketplace
        </Button>
      </div>
    );
  }

  return (
    <div className="nft-detail-page">
      <div className="nft-detail-header">
        <Button variant="outline" onClick={handleBackToMarketplace}>
          &larr; Back to Marketplace
        </Button>
      </div>

      <div className="nft-detail-content">
        {/* NFT Image */}
        <div className="nft-detail-image-container">
          <img 
            src={selectedNft.imageUrl} 
            alt={selectedNft.name}
            className="nft-detail-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x500?text=NFT+Image';
            }}
          />
        </div>

        {/* NFT Information */}
        <div className="nft-detail-info">
          <div className="nft-detail-title-section">
            <span className="nft-collection">{selectedNft.collection}</span>
            <h1 className="nft-title">{selectedNft.name}</h1>
          </div>

          <div className="nft-owner-section">
            <p className="owner-label">Owned by</p>
            <p className="owner-value">
              {isOwner 
                ? 'You' 
                : formatAddress(selectedNft.owner.walletAddress || '', 6, 4)}
            </p>
          </div>

          {selectedNft.isListed && (
            <div className="nft-price-section">
              <p className="price-label">Price</p>
              <p className="price-value">
                {formatCurrency(selectedNft.price, selectedNft.currency)}
              </p>
            </div>
          )}

          <div className="nft-description-section">
            <h3>Description</h3>
            <p className="nft-description">{selectedNft.description}</p>
          </div>

          <div className="nft-attributes-section">
            <h3>Attributes</h3>
            {renderAttributes()}
          </div>

          <div className="nft-details-section">
            <h3>Details</h3>
            <div className="nft-details-grid">
              <div className="detail-item">
                <span className="detail-label">Token ID</span>
                <span className="detail-value">{selectedNft.tokenId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Token Standard</span>
                <span className="detail-value">{selectedNft.tokenStandard || 'ERC-721'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Blockchain</span>
                <span className="detail-value">{selectedNft.blockchain || 'Solana'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created</span>
                <span className="detail-value">{formatDate(selectedNft.createdAt)}</span>
              </div>
            </div>
          </div>

          {transactionError && (
            <div className="transaction-error">
              <p>{transactionError}</p>
            </div>
          )}

          <div className="nft-actions">
            {isOwner ? (
              selectedNft.isListed ? (
                <Button 
                  variant="secondary" 
                  onClick={handleUnlistNFT}
                  disabled={transactionInProgress}
                  className="action-button"
                >
                  {transactionInProgress ? 'Processing...' : 'Remove from Sale'}
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={() => setIsListModalOpen(true)}
                  className="action-button"
                >
                  List for Sale
                </Button>
              )
            ) : (
              selectedNft.isListed && (
                <Button 
                  variant="primary" 
                  onClick={() => setIsBuyModalOpen(true)}
                  disabled={transactionInProgress}
                  className="action-button"
                >
                  {transactionInProgress ? 'Processing...' : 'Buy Now'}
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      {/* List NFT Modal */}
      <Modal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        title="List NFT for Sale"
      >
        <div className="listing-modal-content">
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <div className="price-input-group">
              <input
                type="number"
                id="price"
                value={listingPrice}
                onChange={handlePriceChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                className="price-input"
              />
              <select
                value={listingCurrency}
                onChange={handleCurrencyChange}
                className="currency-select"
              >
                <option value="SOL">SOL</option>
                <option value="ETH">ETH</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
            {listingPrice && !isPriceValid && (
              <p className="input-error">Please enter a valid price</p>
            )}
          </div>

          <div className="modal-actions">
            <Button 
              variant="outline" 
              onClick={() => setIsListModalOpen(false)}
              disabled={transactionInProgress}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleListNFT}
              disabled={!isPriceValid || transactionInProgress}
            >
              {transactionInProgress ? 'Processing...' : 'List NFT'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Buy NFT Modal */}
      <Modal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        title="Complete Purchase"
      >
        <div className="buy-modal-content">
          <p className="buy-confirmation">
            You are about to purchase <strong>{selectedNft.name}</strong> for{' '}
            <strong>{formatCurrency(selectedNft.price, selectedNft.currency)}</strong>
          </p>
          
          <div className="purchase-details">
            <div className="purchase-detail-item">
              <span>Item Price:</span>
              <span>{formatCurrency(selectedNft.price, selectedNft.currency)}</span>
            </div>
            <div className="purchase-detail-item">
              <span>Service Fee (2.5%):</span>
              <span>
                {formatCurrency(selectedNft.price * 0.025, selectedNft.currency)}
              </span>
            </div>
            <div className="purchase-detail-item total">
              <span>Total:</span>
              <span>
                {formatCurrency(selectedNft.price * 1.025, selectedNft.currency)}
              </span>
            </div>
          </div>

          <div className="modal-actions">
            <Button 
              variant="outline" 
              onClick={() => setIsBuyModalOpen(false)}
              disabled={transactionInProgress}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleBuyNFT}
              disabled={transactionInProgress}
            >
              {transactionInProgress ? 'Processing...' : 'Confirm Purchase'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NFTDetail;