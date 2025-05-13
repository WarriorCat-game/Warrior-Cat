import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  init() {
    // Get character data from registry
    this.character = this.registry.get('character');
    // Initialize player variables
    this.player = null;
    this.enemies = null;
    this.cursors = null;
    this.speed = 200;
  }

  preload() {
    // Load character assets based on class
    this.load.spritesheet('player', `/assets/images/characters/${this.character.class.toLowerCase()}_spritesheet.png`, {
      frameWidth: 64,
      frameHeight: 64
    });
    
    // Load map tileset
    this.load.image('tiles', '/assets/images/tileset/world_tileset.png');
    this.load.tilemapTiledJSON('map', '/assets/maps/starting_zone.json');
    
    // Load enemy sprites
    this.load.spritesheet('slime', '/assets/images/enemies/slime_spritesheet.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    
    // Load item sprites
    this.load.image('potion', '/assets/images/items/health_potion.png');
    
    // Load UI elements
    this.load.image('button', '/assets/images/ui/button.png');
  }

  create() {
    // Create map
    this.createMap();
    
    // Create player
    this.createPlayer();
    
    // Create enemies
    this.createEnemies();
    
    // Set up keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Set up camera to follow player
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    
    // Launch UI scene
    this.scene.launch('UIScene', { character: this.character });
    
    // Set up collision detection
    this.physics.add.collider(this.player, this.worldLayer);
    this.physics.add.collider(this.enemies, this.worldLayer);
    this.physics.add.collider(this.player, this.enemies, this.handleEnemyCollision, null, this);
  }

  update() {
    if (!this.player) return;
    
    // Player movement
    this.player.body.setVelocity(0);
    
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-this.speed);
      this.player.setFlipX(true);
      this.player.anims.play('walk', true);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(this.speed);
      this.player.setFlipX(false);
      this.player.anims.play('walk', true);
    }
    
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-this.speed);
      this.player.anims.play('walk', true);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(this.speed);
      this.player.anims.play('walk', true);
    }
    
    // Stop animations if not moving
    if (this.cursors.left.isUp && this.cursors.right.isUp && this.cursors.up.isUp && this.cursors.down.isUp) {
      this.player.anims.play('idle', true);
    }
    
    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.player.body.velocity.normalize().scale(this.speed);
  }

  createMap() {
    // Create the tilemap
    this.map = this.make.tilemap({ key: 'map' });
    
    // Add tileset image
    const tileset = this.map.addTilesetImage('world_tileset', 'tiles');
    
    // Create ground layer
    this.groundLayer = this.map.createLayer('Ground', tileset, 0, 0);
    
    // Create world layer with collision
    this.worldLayer = this.map.createLayer('World', tileset, 0, 0);
    this.worldLayer.setCollisionByProperty({ collides: true });
    
    // Create above-player layer for things like roofs or treetops
    this.aboveLayer = this.map.createLayer('Above', tileset, 0, 0);
    this.aboveLayer.setDepth(10);
  }

  createPlayer() {
    // Get spawn point from map
    const spawnPoint = this.map.findObject('Objects', obj => obj.name === 'Spawn Point');
    
    // Create player sprite
    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
    this.player.setCollideWorldBounds(true);
    
    // Create player animations
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });
    
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 9 }),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNumbers('player', { start: 10, end: 13 }),
      frameRate: 12,
      repeat: 0
    });
  }

  createEnemies() {
    // Create enemy group
    this.enemies = this.physics.add.group();
    
    // Get enemy spawn points from map
    const enemySpawnPoints = this.map.filterObjects('Objects', obj => obj.name === 'Enemy Spawn Point');
    
    // Create enemies at spawn points
    enemySpawnPoints.forEach(enemyPoint => {
      const enemy = this.enemies.create(enemyPoint.x, enemyPoint.y, 'slime');
      enemy.setCollideWorldBounds(true);
      
      // Basic AI - random movement
      this.time.addEvent({
        delay: 2000,
        callback: () => {
          // Generate random direction
          const directions = ['left', 'right', 'up', 'down', 'idle'];
          const direction = directions[Math.floor(Math.random() * directions.length)];
          
          switch (direction) {
            case 'left':
              enemy.setVelocityX(-50);
              break;
            case 'right':
              enemy.setVelocityX(50);
              break;
            case 'up':
              enemy.setVelocityY(-50);
              break;
            case 'down':
              enemy.setVelocityY(50);
              break;
            default:
              enemy.setVelocity(0);
              break;
          }
        },
        callbackScope: this,
        loop: true
      });
    });
    
    // Create enemy animations
    this.anims.create({
      key: 'slime_idle',
      frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1
    });
    
    // Play animations
    this.enemies.playAnimation('slime_idle');
  }

  handleEnemyCollision(player, enemy) {
    // Flash the player when hit
    this.tweens.add({
      targets: player,
      alpha: 0.5,
      duration: 100,
      ease: 'Linear',
      yoyo: true,
      repeat: 3
    });
    
    // Emit event to UI scene to update health
    this.events.emit('playerDamage', 10);
    
    // Knockback
    const direction = new Phaser.Math.Vector2(player.x - enemy.x, player.y - enemy.y).normalize().scale(200);
    player.body.setVelocity(direction.x, direction.y);
    
    // Small delay to prevent multiple hits
    enemy.disableBody(true, false);
    this.time.delayedCall(500, () => {
      enemy.enableBody(true, enemy.x, enemy.y, true, true);
    });
  }
}

export default MainScene; 