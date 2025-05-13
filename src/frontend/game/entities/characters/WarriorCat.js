/**
 * WarriorCat entity class
 * Represents a warrior cat character in the game
 */

import gameConfig from '../../config/gameConfig';

class WarriorCat {
  /**
   * Create a new warrior cat
   * @param {Object} options - Configuration options
   * @param {string} options.id - Unique identifier
   * @param {string} options.name - Cat's name
   * @param {string} options.rarity - Rarity level (common, uncommon, rare, epic, legendary)
   * @param {Object} options.stats - Base stats
   * @param {number} options.level - Current level
   * @param {string} options.imageUrl - URL to the cat's image
   */
  constructor(options = {}) {
    this.id = options.id || crypto.randomUUID();
    this.name = options.name || 'Unnamed Cat';
    this.rarity = options.rarity || 'common';
    this.level = options.level || 1;
    this.experience = options.experience || 0;
    this.imageUrl = options.imageUrl || '';
    
    // Initialize stats
    const baseStats = { ...gameConfig.characters.baseStats };
    this.baseStats = options.stats || baseStats;
    
    // Apply rarity modifier
    const rarityModifier = gameConfig.characters.rarityModifiers[this.rarity] || 1;
    Object.keys(this.baseStats).forEach(stat => {
      this.baseStats[stat] *= rarityModifier;
    });
    
    // Calculate current stats based on level
    this.stats = this.calculateStats();
    
    // Combat state
    this.health = this.stats.health;
    this.isDefending = false;
    this.effects = [];
    
    // Equipment slots
    this.equipment = {
      head: null,
      body: null,
      paws: null,
      tail: null,
      accessory: null
    };
    
    // Skills and abilities
    this.skills = options.skills || [];
    
    // Movement and position
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.direction = 1; // 1 = right, -1 = left
    
    // Animation state
    this.currentAnimation = 'idle';
    this.animationFrame = 0;
  }
  
  /**
   * Calculate the cat's stats based on level and equipment
   * @returns {Object} Calculated stats
   */
  calculateStats() {
    const stats = { ...this.baseStats };
    const levelModifier = 1 + (this.level - 1) * 0.1;
    
    // Apply level scaling
    Object.keys(stats).forEach(stat => {
      stats[stat] = Math.floor(stats[stat] * levelModifier);
    });
    
    // Apply equipment bonuses
    Object.values(this.equipment).forEach(item => {
      if (!item) return;
      
      Object.keys(item.statBonus || {}).forEach(stat => {
        if (stats[stat] !== undefined) {
          stats[stat] += item.statBonus[stat];
        }
      });
    });
    
    return stats;
  }
  
  /**
   * Update the cat's state
   * @param {number} deltaTime - Time elapsed since last update in seconds
   */
  update(deltaTime) {
    // Update position based on velocity
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    
    // Update effects
    this.effects = this.effects.filter(effect => {
      effect.update(deltaTime);
      return effect.duration > 0;
    });
    
    // Update animation
    this.updateAnimation(deltaTime);
  }
  
  /**
   * Update the character's animation
   * @param {number} deltaTime - Time elapsed since last update in seconds
   */
  updateAnimation(deltaTime) {
    // Animation logic would go here
    this.animationFrame += deltaTime * 10;
  }
  
  /**
   * Render the cat
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  render(ctx) {
    // Basic rendering for now
    ctx.fillStyle = this.rarity === 'legendary' ? '#FFD700' : 
                   this.rarity === 'epic' ? '#9370DB' : 
                   this.rarity === 'rare' ? '#4169E1' : 
                   this.rarity === 'uncommon' ? '#32CD32' : 
                   '#A0A0A0';
    
    // Draw cat representation (placeholder)
    ctx.fillRect(this.position.x, this.position.y, 50, 50);
    
    // Draw name
    ctx.fillStyle = '#FFF';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, this.position.x + 25, this.position.y - 10);
    
    // Draw health bar
    const healthPercent = this.health / this.stats.health;
    ctx.fillStyle = '#333';
    ctx.fillRect(this.position.x, this.position.y - 5, 50, 3);
    ctx.fillStyle = healthPercent > 0.5 ? '#00FF00' : 
                   healthPercent > 0.25 ? '#FFFF00' : 
                   '#FF0000';
    ctx.fillRect(this.position.x, this.position.y - 5, 50 * healthPercent, 3);
  }
  
  /**
   * Attack another cat
   * @param {WarriorCat} target - The target to attack
   * @returns {Object} Attack result
   */
  attack(target) {
    if (!target) return { success: false, message: 'No target' };
    
    // Calculate base damage
    let damage = this.stats.attack;
    
    // Check for critical hit
    const criticalRoll = Math.random();
    const isCritical = criticalRoll <= this.stats.critical;
    if (isCritical) {
      damage *= gameConfig.battle.criticalMultiplier;
    }
    
    // Check for miss
    const missRoll = Math.random();
    if (missRoll < gameConfig.battle.missChance) {
      return { 
        success: false, 
        message: `${this.name}'s attack missed!`,
        isMiss: true
      };
    }
    
    // Apply defense reduction
    const defenseModifier = target.isDefending ? 1.5 : 1;
    const damageReduction = target.stats.defense * defenseModifier;
    damage = Math.max(1, Math.floor(damage - damageReduction));
    
    // Apply damage
    target.health = Math.max(0, target.health - damage);
    
    return {
      success: true,
      damage,
      isCritical,
      targetRemaining: target.health,
      message: isCritical 
        ? `${this.name} landed a critical hit on ${target.name} for ${damage} damage!` 
        : `${this.name} attacked ${target.name} for ${damage} damage!`,
      isDefeated: target.health <= 0
    };
  }
  
  /**
   * Level up the cat
   * @param {number} levels - Number of levels to add
   */
  levelUp(levels = 1) {
    this.level += levels;
    this.stats = this.calculateStats();
    this.health = this.stats.health;
    
    return {
      newLevel: this.level,
      stats: this.stats
    };
  }
  
  /**
   * Add experience points and level up if necessary
   * @param {number} amount - Amount of experience to add
   * @returns {Object} Result containing level up information if applicable
   */
  addExperience(amount) {
    this.experience += amount;
    
    // Calculate experience needed for next level
    const expNeeded = this.getExperienceForNextLevel();
    
    // Check if should level up
    if (this.experience >= expNeeded) {
      this.experience -= expNeeded;
      return this.levelUp();
    }
    
    return {
      newExp: this.experience,
      expNeeded,
      progress: this.experience / expNeeded
    };
  }
  
  /**
   * Calculate experience needed for next level
   * @returns {number} Experience needed
   */
  getExperienceForNextLevel() {
    return Math.floor(100 * Math.pow(gameConfig.characters.experienceScale, this.level - 1));
  }
  
  /**
   * Equip an item
   * @param {Object} item - Item to equip
   * @returns {Object} Previous item or null
   */
  equip(item) {
    if (!item || !item.type || !this.equipment[item.type]) {
      return { success: false, message: 'Invalid item or slot' };
    }
    
    const previousItem = this.equipment[item.type];
    this.equipment[item.type] = item;
    
    // Recalculate stats with new equipment
    this.stats = this.calculateStats();
    
    return { 
      success: true, 
      previousItem,
      newStats: this.stats
    };
  }
}

export default WarriorCat; 