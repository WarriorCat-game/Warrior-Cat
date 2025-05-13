import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import '../styles/components/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { connected, connectWallet, disconnectWallet, walletAddress } = useWallet();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/assets/images/logo.png" alt="Warrior Cat Logo" />
          <span>Warrior Cat</span>
        </Link>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/game" onClick={() => setMenuOpen(false)}>Play</Link></li>
            <li><Link to="/marketplace" onClick={() => setMenuOpen(false)}>Marketplace</Link></li>
            <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
          </ul>

          <div className="navbar-wallet">
            {connected ? (
              <div className="wallet-connected">
                <span className="wallet-address">
                  {walletAddress.substring(0, 4)}...{walletAddress.substring(walletAddress.length - 4)}
                </span>
                <button className="btn-disconnect" onClick={disconnectWallet}>
                  Disconnect
                </button>
              </div>
            ) : (
              <button className="btn-connect btn-secondary" onClick={connectWallet}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <div className={`toggle-bar ${menuOpen ? 'active' : ''}`}></div>
          <div className={`toggle-bar ${menuOpen ? 'active' : ''}`}></div>
          <div className={`toggle-bar ${menuOpen ? 'active' : ''}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 