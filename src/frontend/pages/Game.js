import React, { useEffect, useState, useRef } from 'react';
import { useWallet } from '../contexts/WalletContext';
import '../styles/pages/Game.css';

// Import Phaser game
import initGame from '../game/initGame';

const Game = () => {
  const { connected, connectWallet } = useWallet();
  const [gameInitialized, setGameInitialized] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characters, setCharacters] = useState([
    { id: 1, name: 'Whisker', class: 'Swordsman', level: 1 },
    { id: 2, name: 'Mittens', class: 'Mage', level: 5 },
    { id: 3, name: 'Shadow', class: 'Assassin', level: 3 }
  ]);
  const gameContainerRef = useRef(null);

  // Initialize game once the component is mounted and wallet is connected
  useEffect(() => {
    if (connected && selectedCharacter && gameContainerRef.current && !gameInitialized) {
      const game = initGame(gameContainerRef.current, selectedCharacter);
      setGameInitialized(true);
      
      return () => {
        // Destroy game instance on component unmount
        if (game) {
          game.destroy(true);
        }
      };
    }
  }, [connected, selectedCharacter, gameInitialized]);

  // Character selection handler
  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    setGameInitialized(false); // Reset game initialization when changing characters
  };

  // Create new character
  const handleCreateCharacter = () => {
    // In a real app, this would open a character creation modal
    alert('Character creation would be implemented here');
  };

  if (!connected) {
    return (
      <div className="wallet-connect-screen">
        <div className="container">
          <h2>Connect Your Wallet</h2>
          <p>You need to connect your wallet to play Warrior Cat.</p>
          <button className="btn-primary" onClick={connectWallet}>Connect Wallet</button>
        </div>
      </div>
    );
  }

  if (!selectedCharacter) {
    return (
      <div className="character-select-screen">
        <div className="container">
          <h2>Select Your Character</h2>
          <div className="character-list">
            {characters.map(character => (
              <div 
                key={character.id} 
                className="character-card"
                onClick={() => handleCharacterSelect(character)}
              >
                <div className="character-image">
                  <img 
                    src={`/assets/images/characters/${character.class.toLowerCase()}.png`} 
                    alt={character.name} 
                  />
                </div>
                <div className="character-info">
                  <h3>{character.name}</h3>
                  <p>Level {character.level} {character.class}</p>
                </div>
              </div>
            ))}
            
            <div className="character-card create-character" onClick={handleCreateCharacter}>
              <div className="create-icon">+</div>
              <p>Create New Character</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page">
      <div className="game-header">
        <div className="container">
          <div className="character-info">
            <h2>{selectedCharacter.name}</h2>
            <p>Level {selectedCharacter.level} {selectedCharacter.class}</p>
          </div>
          <button 
            className="btn-secondary back-button"
            onClick={() => setSelectedCharacter(null)}
          >
            Change Character
          </button>
        </div>
      </div>

      <div className="game-container" ref={gameContainerRef}>
        {!gameInitialized && (
          <div className="loading-game">
            <p>Loading game...</p>
          </div>
        )}
      </div>

      <div className="game-controls">
        <div className="container">
          <div className="skill-bar">
            <div className="skill-icon" title="Basic Attack">Q</div>
            <div className="skill-icon" title="Skill 1">W</div>
            <div className="skill-icon" title="Skill 2">E</div>
            <div className="skill-icon" title="Skill 3">R</div>
            <div className="skill-icon" title="Special">F</div>
          </div>
          <div className="game-stats">
            <div className="stat health">
              <span className="label">HP</span>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="stat mana">
              <span className="label">MP</span>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game; 