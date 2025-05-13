/**
 * Main Game Engine for Warrior Cat NFT Game
 * Handles core game loop, rendering, and state management
 */

import { Scene } from './Scene';
import { AssetLoader } from './AssetLoader';
import { SoundManager } from './SoundManager';
import { InputManager } from './InputManager';
import { EventEmitter } from './EventEmitter';

class GameEngine {
  /**
   * Initialize the game engine
   * @param {HTMLCanvasElement} canvas - The canvas element for rendering
   * @param {Object} options - Engine configuration options
   */
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.lastTime = 0;
    this.deltaTime = 0;
    this.frameRate = options.frameRate || 60;
    this.frameInterval = 1000 / this.frameRate;
    this.isRunning = false;
    this.currentScene = null;
    
    // Initialize core systems
    this.events = new EventEmitter();
    this.assetLoader = new AssetLoader();
    this.soundManager = new SoundManager();
    this.inputManager = new InputManager(canvas);
    
    // Scene management
    this.scenes = {};
    
    // Bind methods to maintain context
    this.gameLoop = this.gameLoop.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    
    // Set up resize handler
    window.addEventListener('resize', this.resize.bind(this));
  }
  
  /**
   * Start the game loop
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.gameLoop);
    this.events.emit('gameStart');
  }
  
  /**
   * Stop the game loop
   */
  stop() {
    this.isRunning = false;
    this.events.emit('gameStop');
  }
  
  /**
   * Main game loop
   * @param {number} timestamp - Current timestamp
   */
  gameLoop(timestamp) {
    if (!this.isRunning) return;
    
    // Calculate delta time
    this.deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    
    // Update current scene
    if (this.currentScene) {
      this.currentScene.update(this.deltaTime / 1000);
    }
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Render current scene
    if (this.currentScene) {
      this.currentScene.render(this.ctx);
    }
    
    // Continue the loop
    requestAnimationFrame(this.gameLoop);
  }
  
  /**
   * Add a scene to the engine
   * @param {string} name - Scene identifier
   * @param {Scene} scene - Scene instance
   */
  addScene(name, scene) {
    this.scenes[name] = scene;
    scene.engine = this;
    scene.init();
  }
  
  /**
   * Switch to a different scene
   * @param {string} name - Name of the scene to switch to
   */
  setScene(name) {
    if (!this.scenes[name]) {
      console.error(`Scene '${name}' not found`);
      return;
    }
    
    // Exit current scene if it exists
    if (this.currentScene) {
      this.currentScene.exit();
      this.events.emit('sceneExit', this.currentScene);
    }
    
    // Set and enter new scene
    this.currentScene = this.scenes[name];
    this.currentScene.enter();
    this.events.emit('sceneEnter', this.currentScene);
  }
  
  /**
   * Handle window resize
   */
  resize() {
    const parent = this.canvas.parentElement;
    const containerWidth = parent.clientWidth;
    const containerHeight = parent.clientHeight;
    
    // Update canvas size
    this.canvas.width = containerWidth;
    this.canvas.height = containerHeight;
    this.width = containerWidth;
    this.height = containerHeight;
    
    // Notify current scene of resize
    if (this.currentScene && this.currentScene.resize) {
      this.currentScene.resize(containerWidth, containerHeight);
    }
    
    this.events.emit('resize', { width: containerWidth, height: containerHeight });
  }
}

export default GameEngine; 