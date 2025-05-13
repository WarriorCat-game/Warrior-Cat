<div align="center">
  <img src="assets/images/warrior-cat-logo.png" alt="Warrior Cat Logo" width="500">
  <h3>Collect, Trade, and Battle with Unique Warrior Cats on the Blockchain</h3>
</div>

# Warrior Cat NFT Game

A blockchain-based NFT game where players can collect, trade, and battle with unique warrior cats powered by Solana.

## 🌟 Features

- **Web3 Authentication** - Connect with crypto wallets for secure sign-in
- **NFT Marketplace** - Buy, sell, and trade warrior cat NFTs
- **Battle System** - Turn-based combat with strategic gameplay
- **Character Progression** - Level up and evolve your warrior cats
- **Blockchain Integration** - Built on Solana for fast, low-cost transactions

## 🏗️ Architecture Overview

The Warrior Cat NFT Game uses a modern, scalable architecture with three main components:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend ├─────▶│ Node.js Backend ├─────▶│ Solana Network  │
│                 │◀─────┤                 │◀─────┤                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                        │                         │
        ▼                        ▼                         ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ Game Engine     │      │ MongoDB         │      │ Smart Contracts │
│ (Custom WebGL)  │      │ (User Data)     │      │ (NFT & Tokens)  │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## 📁 Project Structure

```
warrior-cat/
├── assets/               # Project assets
│   └── images/           # Images for documentation
├── src/
│   ├── frontend/           # Frontend React application
│   │   ├── assets/         # Static assets (images, audio, etc.)
│   │   ├── components/     # Reusable React components
│   │   ├── contexts/       # React context providers
│   │   ├── game/           # Game logic and components
│   │   │   ├── assets/     # Game-specific assets
│   │   │   ├── config/     # Game configuration
│   │   │   ├── engine/     # Custom game engine
│   │   │   ├── entities/   # Game entities (characters, items)
│   │   │   └── scenes/     # Game scenes and levels
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS styles
│   │   ├── utils/          # Utility functions
│   │   ├── App.js          # Main App component
│   │   ├── index.js        # Entry point
│   │   └── index.html      # HTML template
│   │
│   ├── backend/            # Backend Node.js server
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Server entry point
│   │
│   └── contracts/          # Smart contracts
│       ├── deployment/     # Deployment scripts
│       └── src/            # Contract source code
│
├── dist/                   # Built frontend assets (generated)
├── node_modules/           # Dependencies (generated)
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore file
├── package.json            # Project configuration
├── webpack.config.js       # Webpack configuration
└── README.md               # Project documentation
```

## 🔄 Data Flow

The application follows a unidirectional data flow architecture:

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ┌─────────┐       ┌────────────┐       ┌──────────────┐  │
│  │         │       │            │       │              │  │
│  │  User   ├──────▶│  Frontend  ├──────▶│   Backend    │  │
│  │ Actions │       │  Components│       │   Services   │  │
│  │         │       │            │       │              │  │
│  └─────────┘       └────────────┘       └──────┬───────┘  │
│                          ▲                     │          │
│                          │                     │          │
│                          │                     ▼          │
│                    ┌─────┴─────┐       ┌──────────────┐  │
│                    │           │       │              │  │
│                    │  Context  │◀──────┤  Blockchain  │  │
│                    │  Provider │       │  Network     │  │
│                    │           │       │              │  │
│                    └───────────┘       └──────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Key Data Flow Processes:

1. **User Authentication**
   - User connects wallet (Phantom)
   - Backend verifies wallet signature
   - JWT token returned for subsequent requests

2. **NFT Interactions**
   - NFT data fetched from Solana network
   - Cached in MongoDB for performance
   - Frontend renders NFTs with real-time data

3. **Battle System**
   - Game engine manages battle state
   - Results verified by backend
   - Critical actions validated on blockchain

## 🛠️ Technical Implementation

### Game Engine Architecture

The custom game engine is built with a component-based architecture:

```
┌───────────────────────────────────────────────────────────┐
│                      GameEngine                           │
├───────────────┬──────────────┬───────────────┬───────────┤
│ EventEmitter  │ AssetLoader  │ InputManager  │ Scene     │
└───────┬───────┴──────┬───────┴───────┬───────┴─────┬─────┘
        │              │                │             │
        ▼              ▼                ▼             ▼
┌───────────────┐ ┌──────────┐  ┌─────────────┐ ┌──────────┐
│ Event System  │ │ Assets   │  │ User Input  │ │ Entities │
└───────────────┘ └──────────┘  └─────────────┘ └──────────┘
```

Key components:

- **EventEmitter**: Pub/sub system for decoupled communication
- **AssetLoader**: Handles loading of images, sounds, and data
- **InputManager**: Processes keyboard, mouse, and touch events
- **Scene**: Manages entities and game loop logic
- **SoundManager**: Handles audio playback and effects

### 🎮 Game Logic Implementation

The game uses a component-based entity system:

```javascript
// Example of a WarriorCat entity
class WarriorCat {
  constructor(options = {}) {
    this.id = options.id || crypto.randomUUID();
    this.name = options.name || 'Unnamed Cat';
    this.rarity = options.rarity || 'common';
    this.level = options.level || 1;
    
    // Initialize stats based on rarity and level
    const baseStats = { ...gameConfig.characters.baseStats };
    this.baseStats = options.stats || baseStats;
    
    // Apply rarity modifier
    const rarityModifier = gameConfig.characters.rarityModifiers[this.rarity] || 1;
    Object.keys(this.baseStats).forEach(stat => {
      this.baseStats[stat] *= rarityModifier;
    });
    
    // Calculate current stats based on level
    this.stats = this.calculateStats();
  }
  
  // Combat logic
  attack(target) {
    // Calculate damage
    let damage = this.stats.attack;
    
    // Check for critical hit
    const isCritical = Math.random() <= this.stats.critical;
    if (isCritical) {
      damage *= gameConfig.battle.criticalMultiplier;
    }
    
    // Apply damage
    target.health = Math.max(0, target.health - damage);
    
    return {
      success: true,
      damage,
      isCritical,
      isDefeated: target.health <= 0
    };
  }
}
```

### 📱 Frontend Architecture

The frontend uses React with Context API for state management:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                      App Component                      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│      ┌──────────────┐  ┌──────────────┐                 │
│      │              │  │              │                 │
│      │ AuthContext  │  │ NFTContext   │                 │
│      │              │  │              │                 │
│      └──────────────┘  └──────────────┘                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │         │  │         │  │         │  │         │     │
│  │ Home    │  │ Market  │  │ Game    │  │ Profile │     │
│  │ Page    │  │ Page    │  │ Page    │  │ Page    │     │
│  │         │  │         │  │         │  │         │     │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Key contexts:

- **AuthContext**: Manages user authentication state
- **NFTContext**: Handles NFT data and interactions
- **WalletContext**: Connects to blockchain wallets

### 🔗 Blockchain Integration

The integration with Solana blockchain is handled through:

1. **Smart Contracts**:
   - NFT contract for minting and transferring cats
   - Token contract for in-game currency
   - Marketplace contract for trading

2. **Contract Deployment**:
   - Configuration-driven deployment process
   - Network selection (devnet, testnet, mainnet)
   - Wallet management for transaction signing

```javascript
// Example of contract deployment logic
async function deployContracts(network = 'devnet') {
  // Connect to the network
  const connection = new Connection(
    network === 'mainnet' 
      ? process.env.SOLANA_MAINNET_RPC 
      : network === 'testnet'
        ? process.env.SOLANA_TESTNET_RPC
        : process.env.SOLANA_DEVNET_RPC,
    'confirmed'
  );
  
  // Deploy NFT contract
  const nftContractAddress = await deployNFTContract(connection, wallet);
  
  // Deploy token contract
  const tokenContractAddress = await deployTokenContract(connection, wallet, nftContractAddress);
  
  return { nftContract: nftContractAddress, tokenContract: tokenContractAddress };
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB
- Solana CLI (for blockchain interaction)
- Phantom Wallet (for testing)

### Installation

1. **Clone the repository**:
   ```
   git clone https://github.com/WarriorCat-game/Warrior-Cat.git
   cd Warrior-Cat
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Add project logo**:
   ```
   # Either create a new PNG logo or convert the existing SVG
   # Place it at assets/images/warrior-cat-logo.png
   # See assets/images/LOGO_WORKFLOW.md for details
   ```

4. **Create environment variables**:
   ```
   cp .env.example .env
   ```
   Then edit the `.env` file with your specific configuration.

5. **Start MongoDB**:
   ```
   mongod
   ```

6. **Run the development servers**:
   ```
   # Run frontend and backend together
   npm run dev
   
   # Run frontend only
   npm run dev:frontend
   
   # Run backend only
   npm run dev:backend
   ```

7. **Access the application**:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000/api

## 📡 API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `POST /api/users/wallet/connect` - Connect wallet to user account

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users` - Delete user account

### NFTs
- `GET /api/nft` - Get all NFTs with filtering
- `GET /api/nft/:id` - Get single NFT by ID
- `POST /api/nft` - Create new NFT (mint)
- `PUT /api/nft/:id/list` - List NFT for sale
- `PUT /api/nft/:id/unlist` - Unlist NFT from sale
- `POST /api/nft/:id/buy` - Buy NFT

### Transactions
- `GET /api/transactions` - Get transaction history
- `GET /api/transactions/:id` - Get transaction details
- `POST /api/transactions/verify` - Verify transaction on blockchain

## 🔧 Configuration

The application uses a multi-level configuration system:

1. **Environment Variables**: Basic setup through `.env` file
2. **Backend Config**: Detailed server configuration in `src/backend/config/`
3. **Game Config**: Game-specific settings in `src/frontend/game/config/gameConfig.js`
4. **Contract Config**: Blockchain settings in `src/contracts/deployment/config.js`

Example game configuration:

```javascript
export const gameConfig = {
  // Game display settings
  display: {
    width: 1280,
    height: 720,
    backgroundColor: '#1a1a2e',
    pixelRatio: window.devicePixelRatio || 1,
  },
  
  // Character settings
  characters: {
    baseStats: {
      health: 100,
      attack: 10,
      defense: 5,
      speed: 5,
      critical: 0.05,
    },
    rarityModifiers: {
      common: 1.0,
      uncommon: 1.2,
      rare: 1.5,
      epic: 2.0,
      legendary: 3.0,
    },
  },
  
  // Battle settings
  battle: {
    turnTimeLimit: 30, // seconds
    criticalMultiplier: 2.0,
    missChance: 0.05,
  }
};
```

## 🛡️ Security Features

1. **Authentication**:
   - JWT token-based access control
   - Wallet signature verification
   - Rate limiting for API endpoints

2. **Blockchain**:
   - Transaction verification
   - Secure key management
   - Smart contract validation

3. **Data**:
   - Input validation and sanitization
   - Protection against common web vulnerabilities
   - Secure MongoDB configuration

## 💻 Technologies Used

### Frontend
- React
- React Router
- CSS Modules
- Web3.js
- Custom Game Engine (Canvas/WebGL)

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- WebSockets for real-time updates

### Blockchain
- Solana
- Phantom Wallet
- Solana Program Library (SPL)

## 📊 Performance Optimizations

1. **Asset Loading**:
   - Progressive asset loading
   - Texture atlasing for game resources
   - Asset caching strategies

2. **Rendering**:
   - Efficient canvas rendering
   - Batched updates for DOM manipulation
   - Memoization of expensive calculations

3. **Database**:
   - Indexed MongoDB collections
   - Caching layer for frequent queries
   - Connection pooling

## 📫 Contact & Links

- **Website**: [https://www.warriorcats.xyz](https://www.warriorcats.xyz)
- **Twitter**: [@Warrior_Cat_](https://x.com/Warrior_Cat_)
- **GitHub**: [WarriorCat-game/Warrior-Cat](https://github.com/WarriorCat-game/Warrior-Cat)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 