import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-main">
          <div className="footer-logo">
            <img src="/assets/images/logo.png" alt="Warrior Cat Logo" />
            <h3>Warrior Cat</h3>
            <p>An original blockchain game built on the Solana ecosystem.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h4>Game</h4>
              <ul>
                <li><Link to="/game">Play Now</Link></li>
                <li><Link to="/marketplace">Marketplace</Link></li>
                <li><Link to="/tokens">WCAT Token</Link></li>
                <li><Link to="/roadmap">Roadmap</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4>Community</h4>
              <ul>
                <li><a href="https://x.com/Warrior_Cat_" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                <li><a href="https://discord.gg/warriorcat" target="_blank" rel="noopener noreferrer">Discord</a></li>
                <li><a href="https://t.me/warriorcat" target="_blank" rel="noopener noreferrer">Telegram</a></li>
                <li><a href="https://github.com/WarriorCat-game/Warrior-Cat" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4>Resources</h4>
              <ul>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/support">Support</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {new Date().getFullYear()} Warrior Cat Project Team. All rights reserved.</p>
          </div>
          
          <div className="footer-social">
            <a href="https://x.com/Warrior_Cat_" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="icon-twitter"></i>
            </a>
            <a href="https://discord.gg/warriorcat" target="_blank" rel="noopener noreferrer" aria-label="Discord">
              <i className="icon-discord"></i>
            </a>
            <a href="https://t.me/warriorcat" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <i className="icon-telegram"></i>
            </a>
            <a href="https://github.com/WarriorCat-game/Warrior-Cat" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="icon-github"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 