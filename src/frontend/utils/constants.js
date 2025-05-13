/**
 * Constants used throughout the Warrior Cat application
 */

// API URLs
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.warriorcats.xyz' 
  : 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  TOKEN_INFO: `${API_BASE_URL}/token/info`,
  MARKETPLACE: `${API_BASE_URL}/nft/marketplace`,
};

// Blockchain Constants
export const BLOCKCHAIN = {
  NETWORK: process.env.SOLANA_NETWORK || 'devnet',
  WCAT_TOKEN_ADDRESS: process.env.WCAT_TOKEN_ADDRESS,
  NFT_COLLECTION_ADDRESS: process.env.NFT_COLLECTION_ADDRESS,
};

// Game Settings
export const GAME_SETTINGS = {
  CHARACTER_CLASSES: [
    { id: 'swordsman', name: 'Swordsman', description: 'Masters of close combat with powerful sword techniques.' },
    { id: 'mage', name: 'Mage', description: 'Wielders of arcane magic and powerful spells.' },
    { id: 'archer', name: 'Archer', description: 'Skilled marksmen with deadly accuracy at long ranges.' },
    { id: 'assassin', name: 'Assassin', description: 'Stealthy fighters specializing in critical strikes and evasion.' },
    { id: 'summoner', name: 'Summoner', description: 'Masters of calling forth creatures to aid in battle.' },
    { id: 'paladin', name: 'Paladin', description: 'Holy warriors with healing abilities and strong defenses.' },
  ],
  
  ELEMENT_TYPES: [
    { id: 'fire', name: 'Fire', strong_against: 'ice', weak_against: 'water' },
    { id: 'water', name: 'Water', strong_against: 'fire', weak_against: 'electric' },
    { id: 'earth', name: 'Earth', strong_against: 'electric', weak_against: 'ice' },
    { id: 'electric', name: 'Electric', strong_against: 'water', weak_against: 'earth' },
    { id: 'ice', name: 'Ice', strong_against: 'earth', weak_against: 'fire' },
    { id: 'light', name: 'Light', strong_against: 'dark', weak_against: 'dark' },
    { id: 'dark', name: 'Dark', strong_against: 'light', weak_against: 'light' },
  ],
  
  GAME_REGIONS: [
    { id: 'forest', name: 'Whisker Woods', min_level: 1, max_level: 10 },
    { id: 'mountains', name: 'Claw Mountains', min_level: 10, max_level: 20 },
    { id: 'desert', name: 'Sandy Dunes', min_level: 20, max_level: 30 },
    { id: 'caves', name: 'Midnight Caves', min_level: 30, max_level: 40 },
    { id: 'volcano', name: 'Ember Volcano', min_level: 40, max_level: 50 },
  ],
};

// UI Constants
export const UI = {
  BREAKPOINTS: {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },
  
  ANIMATION_DURATION: {
    short: 200,
    medium: 300,
    long: 500,
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'wcat_auth_token',
  USER_SETTINGS: 'wcat_user_settings',
  SELECTED_CHARACTER: 'wcat_selected_character',
  GAME_PROGRESS: 'wcat_game_progress',
};

// Time Constants (in milliseconds)
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
}; 