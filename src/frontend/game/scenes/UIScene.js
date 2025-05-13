import Phaser from 'phaser';

class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  init(data) {
    // Get character data
    this.character = data.character;
    this.health = 100;
    this.maxHealth = 100;
    this.mana = 100;
    this.maxMana = 100;
  }

  preload() {
    // Load UI assets
    this.load.image('ui-bg', '/assets/images/ui/panel_bg.png');
    this.load.image('health-bar', '/assets/images/ui/health_bar.png');
    this.load.image('mana-bar', '/assets/images/ui/mana_bar.png');
    this.load.image('skill-frame', '/assets/images/ui/skill_frame.png');
    
    // Load skill icons
    this.load.image('skill-attack', '/assets/images/skills/basic_attack.png');
    this.load.image('skill-1', `/assets/images/skills/${this.character.class.toLowerCase()}_skill1.png`);
    this.load.image('skill-2', `/assets/images/skills/${this.character.class.toLowerCase()}_skill2.png`);
    this.load.image('skill-3', `/assets/images/skills/${this.character.class.toLowerCase()}_skill3.png`);
    this.load.image('skill-ultimate', `/assets/images/skills/${this.character.class.toLowerCase()}_ultimate.png`);
  }

  create() {
    // Reference to the main scene
    this.mainScene = this.scene.get('MainScene');
    
    // Listen for player damage events
    this.mainScene.events.on('playerDamage', this.takeDamage, this);
    
    // Create UI elements
    this.createHealthBar();
    this.createManaBar();
    this.createSkillBar();
    this.createCharacterInfo();
    
    // Make UI elements fixed to camera
    this.cameras.main.setScrollX(0);
    this.cameras.main.setScrollY(0);
  }

  update() {
    // Update health and mana displays
    this.healthBar.setCrop(0, 0, this.healthBarWidth * (this.health / this.maxHealth), this.healthBarHeight);
    this.manaBar.setCrop(0, 0, this.manaBarWidth * (this.mana / this.maxMana), this.manaBarHeight);
    
    // Slowly regenerate mana
    if (this.mana < this.maxMana) {
      this.mana = Math.min(this.maxMana, this.mana + 0.05);
    }
  }

  createHealthBar() {
    const barX = 20;
    const barY = 20;
    
    // Create health bar background
    this.add.image(barX, barY, 'ui-bg').setOrigin(0, 0).setScale(1.5, 0.8).setAlpha(0.7);
    
    // Create health bar
    this.healthBar = this.add.image(barX + 10, barY + 10, 'health-bar').setOrigin(0, 0);
    this.healthBarWidth = this.healthBar.width;
    this.healthBarHeight = this.healthBar.height;
    
    // Add health text
    this.healthText = this.add.text(barX + 15, barY + 6, `${this.health}/${this.maxHealth}`, {
      font: '16px Arial',
      fill: '#ffffff'
    });
  }

  createManaBar() {
    const barX = 20;
    const barY = 50;
    
    // Create mana bar background
    this.add.image(barX, barY, 'ui-bg').setOrigin(0, 0).setScale(1.5, 0.8).setAlpha(0.7);
    
    // Create mana bar
    this.manaBar = this.add.image(barX + 10, barY + 10, 'mana-bar').setOrigin(0, 0);
    this.manaBarWidth = this.manaBar.width;
    this.manaBarHeight = this.manaBar.height;
    
    // Add mana text
    this.manaText = this.add.text(barX + 15, barY + 6, `${this.mana}/${this.maxMana}`, {
      font: '16px Arial',
      fill: '#ffffff'
    });
  }

  createSkillBar() {
    const barX = 300;
    const barY = 540;
    
    // Create skill bar background
    this.add.image(barX, barY, 'ui-bg').setOrigin(0.5, 1).setScale(4, 1).setAlpha(0.7);
    
    // Create skill slots
    const skills = ['attack', '1', '2', '3', 'ultimate'];
    const keys = ['Q', 'W', 'E', 'R', 'F'];
    
    skills.forEach((skill, index) => {
      const x = barX - 100 + (index * 50);
      
      // Add skill frame
      this.add.image(x, barY - 25, 'skill-frame').setOrigin(0.5);
      
      // Add skill icon
      this.add.image(x, barY - 25, `skill-${skill}`).setOrigin(0.5).setScale(0.8);
      
      // Add key binding text
      this.add.text(x, barY - 50, keys[index], {
        font: '14px Arial',
        fill: '#ffffff'
      }).setOrigin(0.5);
    });
  }

  createCharacterInfo() {
    const infoX = 700;
    const infoY = 20;
    
    // Create info panel background
    this.add.image(infoX, infoY, 'ui-bg').setOrigin(0, 0).setScale(1.5, 1.5).setAlpha(0.7);
    
    // Add character name and level
    this.add.text(infoX + 15, infoY + 10, `${this.character.name}`, {
      font: 'bold 16px Arial',
      fill: '#ffffff'
    });
    
    this.add.text(infoX + 15, infoY + 30, `Level ${this.character.level} ${this.character.class}`, {
      font: '14px Arial',
      fill: '#ffffff'
    });
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    this.healthText.setText(`${Math.floor(this.health)}/${this.maxHealth}`);
    
    // Game over if health reaches 0
    if (this.health <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    // Pause game
    this.scene.pause('MainScene');
    
    // Create game over panel
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    
    this.add.rectangle(centerX, centerY, 400, 200, 0x000000, 0.8);
    
    this.add.text(centerX, centerY - 40, 'GAME OVER', {
      font: 'bold 32px Arial',
      fill: '#ff0000'
    }).setOrigin(0.5);
    
    const restartButton = this.add.text(centerX, centerY + 20, 'Restart', {
      font: 'bold 20px Arial',
      fill: '#ffffff',
      backgroundColor: '#222222',
      padding: {
        left: 20,
        right: 20,
        top: 10,
        bottom: 10
      }
    }).setOrigin(0.5).setInteractive();
    
    restartButton.on('pointerover', () => {
      restartButton.setTint(0xffff00);
    });
    
    restartButton.on('pointerout', () => {
      restartButton.clearTint();
    });
    
    restartButton.on('pointerdown', () => {
      // Restart the scenes
      this.scene.stop('MainScene');
      this.scene.restart();
      this.scene.start('MainScene');
    });
  }
}

export default UIScene; 