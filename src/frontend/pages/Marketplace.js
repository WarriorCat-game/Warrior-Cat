import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import { useNFT } from '../contexts/NFTContext';
import { formatCurrency } from '../utils/formatters';
import '../styles/pages/Marketplace.css';

/**
 * Marketplace page component
 * @returns {React.ReactElement} Marketplace page
 */
const Marketplace = () => {
  // Get NFT context
  const { 
    marketplaceNfts, 
    loading, 
    error, 
    fetchMarketplaceNFTs, 
    filters, 
    updateFilters,
    pagination
  } = useNFT();

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    minPrice: '',
    maxPrice: '',
    collection: '',
    sort: 'newest'
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchTerm, page: 1 });
  };

  // Handle filter inputs change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    const newFilters = {
      ...tempFilters,
      page: 1
    };
    
    // Convert price strings to numbers or null
    if (tempFilters.minPrice) {
      newFilters.minPrice = parseFloat(tempFilters.minPrice);
    } else {
      newFilters.minPrice = null;
    }
    
    if (tempFilters.maxPrice) {
      newFilters.maxPrice = parseFloat(tempFilters.maxPrice);
    } else {
      newFilters.maxPrice = null;
    }
    
    updateFilters(newFilters);
    setIsFilterOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    setTempFilters({
      minPrice: '',
      maxPrice: '',
      collection: '',
      sort: 'newest'
    });
    
    updateFilters({
      minPrice: null,
      maxPrice: null,
      collection: '',
      sort: 'newest',
      page: 1
    });
    
    setIsFilterOpen(false);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    updateFilters({ page: newPage });
  };

  // Set initial filter values when component mounts
  useEffect(() => {
    setTempFilters({
      minPrice: filters.minPrice || '',
      maxPrice: filters.maxPrice || '',
      collection: filters.collection || '',
      sort: filters.sort || 'newest'
    });
  }, [filters]);

  return (
    <div className="marketplace-page">
      <div className="marketplace-header">
        <h1>NFT Marketplace</h1>
        <p>Discover, collect, and trade unique Warrior Cat NFTs</p>
      </div>

      <div className="marketplace-controls">
        {/* Search Form */}
        <form className="marketplace-search" onSubmit={handleSearchSubmit}>
          <Input
            type="search"
            name="search"
            placeholder="Search NFTs by name, collection, or creator"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <Button type="submit" variant="primary">
            Search
          </Button>
        </form>

        {/* Filter Toggle Button */}
        <Button 
          variant="outline" 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="filter-toggle-btn"
        >
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="filter-panel">
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="minPrice">Min Price</label>
              <Input
                type="number"
                id="minPrice"
                name="minPrice"
                placeholder="Min"
                value={tempFilters.minPrice}
                onChange={handleFilterChange}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="maxPrice">Max Price</label>
              <Input
                type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="Max"
                value={tempFilters.maxPrice}
                onChange={handleFilterChange}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="collection">Collection</label>
              <Input
                type="text"
                id="collection"
                name="collection"
                placeholder="Collection name"
                value={tempFilters.collection}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="sort">Sort By</label>
              <select
                id="sort"
                name="sort"
                value={tempFilters.sort}
                onChange={handleFilterChange}
                className="sort-select"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>
          
          <div className="filter-actions">
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
            <Button variant="primary" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* NFT Grid */}
      <div className="nft-grid-container">
        {loading ? (
          <div className="marketplace-loader">
            <Loader size="large" text="Loading NFTs..." />
          </div>
        ) : error ? (
          <div className="marketplace-error">
            <p>Error loading NFTs: {error}</p>
            <Button variant="primary" onClick={fetchMarketplaceNFTs}>
              Try Again
            </Button>
          </div>
        ) : marketplaceNfts.length === 0 ? (
          <div className="marketplace-empty">
            <h3>No NFTs Found</h3>
            <p>Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="nft-grid">
            {marketplaceNfts.map((nft) => (
              <Link to={`/nft/${nft._id}`} key={nft._id} className="nft-link">
                <Card className="nft-card">
                  <div className="nft-image">
                    <img 
                      src={nft.imageUrl} 
                      alt={nft.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=NFT+Image';
                      }}
                    />
                  </div>
                  <div className="nft-details">
                    <h3 className="nft-name">{nft.name}</h3>
                    <p className="nft-collection">{nft.collection}</p>
                    <div className="nft-price">
                      <span className="price-label">Price:</span>
                      <span className="price-value">
                        {formatCurrency(nft.price, nft.currency)}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && marketplaceNfts.length > 0 && (
        <div className="pagination">
          <Button
            variant="outline"
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1}
          >
            Previous
          </Button>
          
          <div className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
            <span className="pagination-total">
              ({pagination.totalItems} total)
            </span>
          </div>
          
          <Button
            variant="outline"
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Marketplace; 