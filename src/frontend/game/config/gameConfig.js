/**
 * Game configuration settings for Warrior Cat NFT Game
 * Official Website: https://www.warriorcats.xyz
 * GitHub: https://github.com/WarriorCat-game/Warrior-Cat
 * Twitter: @Warrior_Cat_
 */

export const gameConfig = {
  // Game display settings
  display: {
    width: 1280,
    height: 720,
    backgroundColor: '#1a1a2e',
    pixelRatio: window.devicePixelRatio || 1,
    fullscreen: false,
    targetFPS: 60,
  },
  
  // Game physics settings
  physics: {
    gravity: 980,
    friction: 0.2,
    bounce: 0.4,
    timeStep: 1/60,
    velocityIterations: 8,
    positionIterations: 3,
  },
  
  // Asset paths
  assets: {
    baseUrl: '/assets/game/',
    images: {
      characters: 'images/characters/',
      backgrounds: 'images/backgrounds/',
      ui: 'images/ui/',
      items: 'images/items/',
    },
    audio: {
      music: 'audio/music/',
      sfx: 'audio/sfx/',
    },
    data: 'data/',
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
    maxLevel: 50,
    experienceScale: 1.5,
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
    maxRounds: 30,
    criticalMultiplier: 2.0,
    missChance: 0.05,
    initiative: {
      speedWeight: 0.8,
      randomWeight: 0.2,
    },
    rewards: {
      baseXP: 50,
      baseTokens: 10,
      winBonus: 1.5,
    },
  },
  
  // Game progression
  progression: {
    playerLevels: 100,
    levelsPerRank: 10,
    ranks: [
      'Novice',
      'Apprentice',
      'Warrior',
      'Veteran',
      'Elite',
      'Master',
      'Grandmaster',
      'Legend',
      'Mythic',
      'Immortal',
    ],
    unlockRequirements: {
      pvp: { level: 5 },
      tournaments: { level: 10 },
      breeding: { level: 15 },
      quests: { level: 3 },
      crafting: { level: 8 },
    },
  },
  
  // Economy settings
  economy: {
    stakingRewards: 0.01, // 1% daily
    breedingCost: 1000, // tokens
    breedingCooldown: 86400, // 24 hours in seconds
    mintingCost: 0.1, // SOL
    marketplaceFee: 0.025, // 2.5%
  },
  
  // Social links
  socialLinks: {
    website: 'https://www.warriorcats.xyz',
    twitter: 'https://x.com/Warrior_Cat_',
    github: 'https://github.com/WarriorCat-game/Warrior-Cat'
  },
  
  // Debug settings
  debug: {
    enabled: process.env.NODE_ENV !== 'production',
    showFPS: true,
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
    showColliders: false,
    invincible: false,
  },
};

export default gameConfig; 