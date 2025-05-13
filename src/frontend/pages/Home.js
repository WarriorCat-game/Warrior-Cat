import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import '../styles/pages/Home.css';

/**
 * Home page component
 * @returns {React.ReactElement} Home page
 */
const Home = () => {
  // Example feature data
  const features = [
    {
      id: 1,
      title: 'Create & Collect',
      description: 'Create unique Warrior Cat NFTs and build your collection.',
      icon: '🎨',
    },
    {
      id: 2,
      title: 'Trade & Earn',
      description: 'Buy, sell, and trade your Warrior Cat NFTs on our marketplace.',
      icon: '💰',
    },
    {
      id: 3,
      title: 'Battle & Compete',
      description: 'Enter battles and competitions with your Warrior Cats.',
      icon: '⚔️',
    },
    {
      id: 4,
      title: 'Community & Rewards',
      description: 'Join our community and earn rewards for participation.',
      icon: '🏆',
    },
  ];

  // Example how-it-works steps
  const steps = [
    {
      id: 1,
      title: 'Connect Your Wallet',
      description: 'Link your cryptocurrency wallet to get started with Warrior Cat.',
      image: '/images/connect-wallet.png',
    },
    {
      id: 2,
      title: 'Create or Collect',
      description: 'Mint your own Warrior Cat NFTs or collect existing ones from the marketplace.',
      image: '/images/create-collect.png',
    },
    {
      id: 3,
      title: 'Trade and Battle',
      description: 'Trade your Warrior Cats or enter them into battles to earn rewards.',
      image: '/images/trade-battle.png',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Collect, Trade, and Battle with Warrior Cat NFTs</h1>
          <p>
            The ultimate platform for digital cat warriors. Create, collect, and battle
            with unique NFT cats on the blockchain.
          </p>
          <div className="hero-buttons">
            <Link to="/marketplace">
              <Button variant="primary" size="large">
                Explore Marketplace
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="outline" size="large">
                Create Warrior Cat
              </Button>
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="/images/hero-warrior-cat.png" 
            alt="Warrior Cat Hero" 
            className="hero-cat-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x400?text=Warrior+Cat';
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Warrior Cat?</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <Card key={feature.id} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          {steps.map((step) => (
            <div key={step.id} className="step">
              <div className="step-number">{step.id}</div>
              <div className="step-image">
                <img 
                  src={step.image} 
                  alt={step.title}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x200?text=Step+${step.id}`;
                  }}
                />
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Warrior Cat Journey?</h2>
          <p>Join thousands of collectors and creators on the Warrior Cat platform.</p>
          <Link to="/register">
            <Button variant="primary" size="large">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 