import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/Header.css';

/**
 * Header component with navigation and wallet connection
 * 
 * @param {Object} props - Component props
 * @param {string} props.logo - Path to the logo image
 * @param {string} props.logoSmall - Path to the small logo image for mobile
 * @returns {React.ReactElement} Header component
 */
const Header = ({ logo, logoSmall }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout, connectAndAuthWallet } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when navigating or clicking outside
  const closeMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Handle scroll events to change header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle clicking outside menu to close it
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isMenuOpen && e.target.closest('.navbar-menu') === null && 
          e.target.closest('.menu-toggle') === null) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isMenuOpen]);

  // Handle login
  const handleLogin = () => {
    navigate('/login');
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      await connectAndAuthWallet();
      closeMenu();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  // Generate navigation links
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/create', label: 'Create' },
    { path: '/game', label: 'Game' },
    { path: '/about', label: 'About' }
  ];

  return (
    <header className={`site-header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="site-logo" onClick={closeMenu}>
          <img 
            src={logo} 
            alt="Warrior Cat" 
            className="logo-default" 
            onError={(e) => {
              console.error('Logo failed to load:', e);
            }}
          />
          <img 
            src={logoSmall} 
            alt="Warrior Cat" 
            className="logo-small" 
            onError={(e) => {
              console.error('Small logo failed to load:', e);
            }}
          />
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="menu-bar"></span>
          <span className="menu-bar"></span>
          <span className="menu-bar"></span>
        </button>

        {/* Navigation */}
        <nav className={`navbar ${isMenuOpen ? 'menu-open' : ''}`}>
          <ul className="navbar-menu">
            {navLinks.map(link => (
              <li key={link.path} className="navbar-item">
                <Link 
                  to={link.path} 
                  className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Authentication Buttons */}
          <div className="auth-buttons">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="profile-link" onClick={closeMenu}>
                  <div className="profile-avatar">
                    {user?.username?.charAt(0) || user?.walletAddress?.substring(0, 2) || 'U'}
                  </div>
                </Link>
                <Button 
                  variant="outline" 
                  size="small" 
                  onClick={handleLogout}
                  className="logout-button"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="small" 
                  onClick={handleLogin}
                  className="login-button"
                >
                  Login
                </Button>
                <Button 
                  variant="primary" 
                  size="small" 
                  onClick={handleConnectWallet}
                  className="wallet-button"
                >
                  Connect Wallet
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 