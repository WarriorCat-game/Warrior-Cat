import Phaser from 'phaser';
import MainScene from './scenes/MainScene';
import UIScene from './scenes/UIScene';

/**
 * Initialize the Phaser game instance
 * @param {HTMLElement} container - The DOM element to mount the game
 * @param {Object} character - The selected character data
 * @returns {Phaser.Game} The Phaser game instance
 */
const initGame = (container, character) => {
  // Game configuration
  const config = {
    type: Phaser.AUTO,
    parent: container,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: [MainScene, UIScene],
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };

  // Create the game instance
  const game = new Phaser.Game(config);

  // Pass character data to the game
  game.registry.set('character', character);

  return game;
};

export default initGame; 