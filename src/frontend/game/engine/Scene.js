/**
 * Base Scene class for the game engine
 * Provides lifecycle methods and entity management
 */

class Scene {
  /**
   * Initialize a new scene
   * @param {Object} options - Scene configuration options
   */
  constructor(options = {}) {
    this.name = options.name || 'Scene';
    this.entities = [];
    this.initialized = false;
    this.active = false;
    this.engine = null;
  }
  
  /**
   * Initialize the scene
   * Called once when the scene is added to the game engine
   */
  init() {
    if (this.initialized) return;
    this.initialized = true;
  }
  
  /**
   * Enter the scene
   * Called when the scene becomes active
   */
  enter() {
    this.active = true;
    this.entities.forEach(entity => {
      if (entity.enable) entity.enable();
    });
  }
  
  /**
   * Exit the scene
   * Called when the scene is no longer active
   */
  exit() {
    this.active = false;
    this.entities.forEach(entity => {
      if (entity.disable) entity.disable();
    });
  }
  
  /**
   * Update the scene
   * @param {number} deltaTime - Time elapsed since last update in seconds
   */
  update(deltaTime) {
    if (!this.active) return;
    
    // Update all entities in the scene
    this.entities.forEach(entity => {
      if (entity.update) entity.update(deltaTime);
    });
  }
  
  /**
   * Render the scene
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  render(ctx) {
    if (!this.active) return;
    
    // Render all entities in the scene
    this.entities.forEach(entity => {
      if (entity.render) entity.render(ctx);
    });
  }
  
  /**
   * Add an entity to the scene
   * @param {Object} entity - The entity to add
   * @returns {Object} The added entity
   */
  addEntity(entity) {
    this.entities.push(entity);
    entity.scene = this;
    
    if (entity.init) entity.init();
    if (this.active && entity.enable) entity.enable();
    
    return entity;
  }
  
  /**
   * Remove an entity from the scene
   * @param {Object} entity - The entity to remove
   */
  removeEntity(entity) {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      if (entity.disable) entity.disable();
      this.entities.splice(index, 1);
      entity.scene = null;
    }
  }
  
  /**
   * Find entities by tag
   * @param {string} tag - The tag to search for
   * @returns {Array} - Array of matching entities
   */
  findEntitiesByTag(tag) {
    return this.entities.filter(entity => entity.tag === tag);
  }
  
  /**
   * Get the first entity with a specific tag
   * @param {string} tag - The tag to search for
   * @returns {Object|null} - The found entity or null
   */
  getEntityByTag(tag) {
    return this.entities.find(entity => entity.tag === tag) || null;
  }
  
  /**
   * Handle window resize
   * @param {number} width - New width
   * @param {number} height - New height
   */
  resize(width, height) {
    // Notify all entities of resize
    this.entities.forEach(entity => {
      if (entity.resize) entity.resize(width, height);
    });
  }
  
  /**
   * Clear all entities from the scene
   */
  clear() {
    this.entities.forEach(entity => {
      if (entity.disable) entity.disable();
    });
    this.entities = [];
  }
}

export { Scene }; 