import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import '../styles/pages/Profile.css';

const Profile = () => {
  const { connected, connectWallet, walletAddress, getBalance } = useWallet();
  const [activeTab, setActiveTab] = useState('characters');
  const [balance, setBalance] = useState(0);
  const [characters, setCharacters] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (connected) {
      // Load user data
      loadUserData();
    }
  }, [connected]);

  const loadUserData = async () => {
    setLoading(true);
    
    // Get wallet balance
    const currentBalance = await getBalance();
    setBalance(currentBalance);
    
    // Mock data for demonstration
    setTimeout(() => {
      // Mock characters
      setCharacters([
        {
          id: 1,
          name: 'Whisker',
          class: 'Swordsman',
          level: 12,
          experience: 1250,
          nextLevel: 2000,
          stats: {
            strength: 25,
            defense: 18,
            magic: 5,
            speed: 15
          },
          equipment: {
            weapon: 'Steel Sword',
            armor: 'Leather Vest',
            accessory: 'Agility Charm'
          },
          image: '/assets/images/characters/swordsman.png'
        },
        {
          id: 2,
          name: 'Mittens',
          class: 'Mage',
          level: 8,
          experience: 800,
          nextLevel: 1500,
          stats: {
            strength: 7,
            defense: 10,
            magic: 30,
            speed: 12
          },
          equipment: {
            weapon: 'Apprentice Staff',
            armor: 'Mystic Robe',
            accessory: 'Mana Crystal'
          },
          image: '/assets/images/characters/mage.png'
        }
      ]);
      
      // Mock inventory items
      setInventory([
        {
          id: 1,
          name: 'Health Potion',
          type: 'consumable',
          quantity: 15,
          image: '/assets/images/items/health_potion.png'
        },
        {
          id: 2,
          name: 'Mana Potion',
          type: 'consumable',
          quantity: 8,
          image: '/assets/images/items/mana_potion.png'
        },
        {
          id: 3,
          name: 'Flaming Sword',
          type: 'equipment',
          rarity: 'epic',
          level: 15,
          image: '/assets/images/items/flaming_sword.png'
        }
      ]);
      
      // Mock transaction history
      setTransactions([
        {
          id: 1,
          type: 'purchase',
          item: 'Health Potion x5',
          amount: 25,
          timestamp: '2024-03-15T14:30:00Z'
        },
        {
          id: 2,
          type: 'sale',
          item: 'Bronze Shield',
          amount: 45,
          timestamp: '2024-03-14T11:20:00Z'
        },
        {
          id: 3,
          type: 'reward',
          item: 'Daily Quest Completion',
          amount: 100,
          timestamp: '2024-03-13T18:45:00Z'
        }
      ]);
      
      setLoading(false);
    }, 1500);
  };

  if (!connected) {
    return (
      <div className="wallet-connect-screen">
        <div className="container">
          <h2>Connect Your Wallet</h2>
          <p>You need to connect your wallet to view your profile.</p>
          <button className="btn-primary" onClick={connectWallet}>Connect Wallet</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="container">
          <div className="profile-info">
            <h1>Profile Dashboard</h1>
            <div className="wallet-info">
              <span className="wallet-address">
                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 6)}
              </span>
              <span className="wallet-balance">
                <img src="/assets/images/wcat-icon.png" alt="WCAT" />
                {balance.toFixed(2)} WCAT
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <div className="container">
          <div className="tabs-nav">
            <button 
              className={`tab-btn ${activeTab === 'characters' ? 'active' : ''}`}
              onClick={() => setActiveTab('characters')}
            >
              Characters
            </button>
            <button 
              className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              Inventory
            </button>
            <button 
              className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </button>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="container">
          {loading ? (
            <div className="loading-data">
              <p>Loading profile data...</p>
            </div>
          ) : (
            <>
              {/* Characters Tab */}
              {activeTab === 'characters' && (
                <div className="characters-tab">
                  {characters.length > 0 ? (
                    <div className="characters-list">
                      {characters.map(character => (
                        <div key={character.id} className="character-card">
                          <div className="character-image">
                            <img src={character.image} alt={character.name} />
                          </div>
                          <div className="character-details">
                            <h3>{character.name}</h3>
                            <p>Level {character.level} {character.class}</p>
                            
                            <div className="experience-bar">
                              <div 
                                className="experience-fill"
                                style={{ width: `${(character.experience / character.nextLevel) * 100}%` }}
                              ></div>
                              <span className="experience-text">
                                {character.experience}/{character.nextLevel} XP
                              </span>
                            </div>
                            
                            <div className="character-stats">
                              <div className="stat">
                                <span className="stat-name">STR</span>
                                <span className="stat-value">{character.stats.strength}</span>
                              </div>
                              <div className="stat">
                                <span className="stat-name">DEF</span>
                                <span className="stat-value">{character.stats.defense}</span>
                              </div>
                              <div className="stat">
                                <span className="stat-name">MAG</span>
                                <span className="stat-value">{character.stats.magic}</span>
                              </div>
                              <div className="stat">
                                <span className="stat-name">SPD</span>
                                <span className="stat-value">{character.stats.speed}</span>
                              </div>
                            </div>
                            
                            <div className="character-equipment">
                              <p><strong>Weapon:</strong> {character.equipment.weapon}</p>
                              <p><strong>Armor:</strong> {character.equipment.armor}</p>
                              <p><strong>Accessory:</strong> {character.equipment.accessory}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="character-card create-character">
                        <div className="create-icon">+</div>
                        <p>Create New Character</p>
                      </div>
                    </div>
                  ) : (
                    <div className="no-data">
                      <p>You don't have any characters yet. Create your first character to start playing!</p>
                      <button className="btn-primary">Create Character</button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Inventory Tab */}
              {activeTab === 'inventory' && (
                <div className="inventory-tab">
                  {inventory.length > 0 ? (
                    <div className="inventory-grid">
                      {inventory.map(item => (
                        <div key={item.id} className="inventory-item">
                          <div className="item-image">
                            <img src={item.image} alt={item.name} />
                            {item.quantity && (
                              <span className="item-quantity">x{item.quantity}</span>
                            )}
                            {item.rarity && (
                              <span className={`item-rarity ${item.rarity}`}>{item.rarity}</span>
                            )}
                          </div>
                          <div className="item-details">
                            <h4>{item.name}</h4>
                            {item.level && <p>Level {item.level}</p>}
                            <p className="item-type">{item.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-data">
                      <p>Your inventory is empty.</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Transactions Tab */}
              {activeTab === 'transactions' && (
                <div className="transactions-tab">
                  {transactions.length > 0 ? (
                    <div className="transactions-list">
                      <div className="transactions-header">
                        <span>Type</span>
                        <span>Item</span>
                        <span>Amount</span>
                        <span>Date</span>
                      </div>
                      
                      {transactions.map(transaction => (
                        <div key={transaction.id} className="transaction-row">
                          <span className={`transaction-type ${transaction.type}`}>
                            {transaction.type}
                          </span>
                          <span className="transaction-item">{transaction.item}</span>
                          <span className="transaction-amount">
                            {transaction.type === 'purchase' ? '-' : '+'}
                            {transaction.amount} WCAT
                          </span>
                          <span className="transaction-date">
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-data">
                      <p>No transaction history found.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 