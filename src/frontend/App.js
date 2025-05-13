import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Game from './pages/Game';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import About from './pages/About';
import NFTDetail from './pages/NFTDetail';
import CreateNFT from './pages/CreateNFT';
import Login from './pages/Login';
import Register from './pages/Register';

// Wallet Context
import { WalletContextProvider } from './contexts/WalletContext';
import { AuthProvider } from './contexts/AuthContext';
import { NFTProvider } from './contexts/NFTContext';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          <img src="/assets/images/logo.png" alt="Warrior Cat Logo" />
        </div>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <NFTProvider>
        <WalletContextProvider>
          <Router>
            <div className="app-container">
              <Header logo="/assets/images/logo.svg" logoSmall="/assets/images/logo-icon.svg" />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/game" element={<Game />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/nft/:id" element={<NFTDetail />} />
                  <Route path="/create" element={<CreateNFT />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </WalletContextProvider>
      </NFTProvider>
    </AuthProvider>
  );
}

export default App; 