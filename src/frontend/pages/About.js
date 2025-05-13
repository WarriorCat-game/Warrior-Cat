import React from 'react';
import '../styles/pages/About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-header">
        <div className="container">
          <h1>About Warrior Cat</h1>
          <p>Learn more about our vision, the game, and the team behind Warrior Cat.</p>
        </div>
      </div>

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <h2>Our Story</h2>
            <p>
              Warrior Cat began as a vision to create a unique gaming experience that seamlessly merges the 
              immersive world of action RPGs with the revolutionary possibilities of blockchain technology. 
              Founded by a team of passionate gamers and blockchain enthusiasts, our project aims to redefine 
              digital ownership and create a truly player-owned gaming ecosystem.
            </p>
            <p>
              Set in the magical world of Aethermew, the game invites players to become part of an ancient 
              feline civilization, where they can explore, battle, and build. Our commitment to high-quality 
              gameplay, stunning visuals, and innovative tokenomics sets Warrior Cat apart in the blockchain 
              gaming space.
            </p>
          </div>
          <div className="about-image">
            <img src="/assets/images/about-image.png" alt="Warrior Cat Team" />
          </div>
        </div>
      </section>

      <section className="vision-section">
        <div className="container">
          <h2>Our Vision</h2>
          <div className="vision-cards">
            <div className="vision-card">
              <h3>Redefine Ownership</h3>
              <p>Create a game where players truly own their digital assets and can freely trade, sell, or utilize them across the ecosystem.</p>
            </div>
            <div className="vision-card">
              <h3>Innovate Game Economics</h3>
              <p>Build a sustainable Play-to-Own model that balances gameplay enjoyment with real economic value.</p>
            </div>
            <div className="vision-card">
              <h3>Foster Community</h3>
              <p>Develop a decentralized governance system where players actively participate in shaping the future of the game.</p>
            </div>
            <div className="vision-card">
              <h3>Set New Standards</h3>
              <p>Establish best practices for blockchain gaming that prioritize player experience, security, and fair economics.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="roadmap-section">
        <div className="container">
          <h2>Development Roadmap</h2>
          <div className="roadmap">
            <div className="roadmap-item">
              <div className="roadmap-date">Q1-Q2 2024</div>
              <div className="roadmap-content">
                <h3>Foundation Building</h3>
                <ul>
                  <li>Game engine development</li>
                  <li>Smart contract development</li>
                  <li>Art asset creation</li>
                  <li>Community building</li>
                </ul>
              </div>
            </div>
            
            <div className="roadmap-item">
              <div className="roadmap-date">Q3-Q4 2024</div>
              <div className="roadmap-content">
                <h3>Feature Integration</h3>
                <ul>
                  <li>Complete game loop</li>
                  <li>Blockchain integration</li>
                  <li>Testnet deployment</li>
                  <li>Closed alpha</li>
                </ul>
              </div>
            </div>
            
            <div className="roadmap-item">
              <div className="roadmap-date">Q1 2025</div>
              <div className="roadmap-content">
                <h3>Optimization & Launch</h3>
                <ul>
                  <li>Performance optimization</li>
                  <li>Public beta</li>
                  <li>Mainnet deployment</li>
                  <li>Official launch</li>
                </ul>
              </div>
            </div>
            
            <div className="roadmap-item">
              <div className="roadmap-date">Q2+ 2025</div>
              <div className="roadmap-content">
                <h3>Ecosystem Expansion</h3>
                <ul>
                  <li>Content updates</li>
                  <li>Cross-chain features</li>
                  <li>Mobile release</li>
                  <li>Esports ecosystem</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h2>Meet the Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="/assets/images/team/alex.png" alt="Alex Chen" />
              </div>
              <h3>Alex Chen</h3>
              <p>Founder & Game Director</p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="/assets/images/team/sarah.png" alt="Sarah Williams" />
              </div>
              <h3>Sarah Williams</h3>
              <p>Lead Blockchain Developer</p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="/assets/images/team/david.png" alt="David Kim" />
              </div>
              <h3>David Kim</h3>
              <p>Art Director</p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="/assets/images/team/maya.png" alt="Maya Johnson" />
              </div>
              <h3>Maya Johnson</h3>
              <p>Lead Game Designer</p>
            </div>
          </div>
        </div>
      </section>

      <section className="partners-section">
        <div className="container">
          <h2>Our Partners</h2>
          <div className="partners-grid">
            <div className="partner">
              <img src="/assets/images/partners/solana.png" alt="Solana" />
            </div>
            <div className="partner">
              <img src="/assets/images/partners/phantom.png" alt="Phantom" />
            </div>
            <div className="partner">
              <img src="/assets/images/partners/unity.png" alt="Unity" />
            </div>
            <div className="partner">
              <img src="/assets/images/partners/metaplex.png" alt="Metaplex" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 