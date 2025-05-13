/**
 * Input handling system for game engine
 * Manages keyboard, mouse, and touch input
 */

class InputManager {
  /**
   * Initialize input manager
   * @param {HTMLElement} target - DOM element to attach input listeners to
   */
  constructor(target = window) {
    this.target = target;
    
    // Input state tracking
    this.keys = {};
    this.mouse = {
      x: 0,
      y: 0,
      buttons: {
        left: false,
        middle: false,
        right: false
      }
    };
    this.touches = [];
    this.gamepadState = {};
    
    // Input event callbacks
    this.keyCallbacks = {};
    this.mouseCallbacks = {};
    this.touchCallbacks = {};
    this.gamepadCallbacks = {};
    
    // Bind event handlers
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._onGamepadConnected = this._onGamepadConnected.bind(this);
    this._onGamepadDisconnected = this._onGamepadDisconnected.bind(this);
    
    // Initialize input handlers
    this._initKeyboard();
    this._initMouse();
    this._initTouch();
    this._initGamepad();
  }
  
  /**
   * Set up keyboard event listeners
   * @private
   */
  _initKeyboard() {
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
  }
  
  /**
   * Set up mouse event listeners
   * @private
   */
  _initMouse() {
    this.target.addEventListener('mousemove', this._onMouseMove);
    this.target.addEventListener('mousedown', this._onMouseDown);
    this.target.addEventListener('mouseup', this._onMouseUp);
    this.target.addEventListener('contextmenu', e => e.preventDefault());
  }
  
  /**
   * Set up touch event listeners
   * @private
   */
  _initTouch() {
    this.target.addEventListener('touchstart', this._onTouchStart, { passive: false });
    this.target.addEventListener('touchmove', this._onTouchMove, { passive: false });
    this.target.addEventListener('touchend', this._onTouchEnd);
    this.target.addEventListener('touchcancel', this._onTouchEnd);
  }
  
  /**
   * Set up gamepad event listeners
   * @private
   */
  _initGamepad() {
    window.addEventListener('gamepadconnected', this._onGamepadConnected);
    window.addEventListener('gamepaddisconnected', this._onGamepadDisconnected);
  }
  
  /**
   * Handle key down events
   * @param {KeyboardEvent} event - Key down event
   * @private
   */
  _onKeyDown(event) {
    this.keys[event.code] = true;
    
    // Execute callbacks for this key
    if (this.keyCallbacks.down && this.keyCallbacks.down[event.code]) {
      this.keyCallbacks.down[event.code].forEach(callback => callback(event));
    }
    
    // Execute global key down callbacks
    if (this.keyCallbacks.anyDown) {
      this.keyCallbacks.anyDown.forEach(callback => callback(event.code, event));
    }
  }
  
  /**
   * Handle key up events
   * @param {KeyboardEvent} event - Key up event
   * @private
   */
  _onKeyUp(event) {
    this.keys[event.code] = false;
    
    // Execute callbacks for this key
    if (this.keyCallbacks.up && this.keyCallbacks.up[event.code]) {
      this.keyCallbacks.up[event.code].forEach(callback => callback(event));
    }
    
    // Execute global key up callbacks
    if (this.keyCallbacks.anyUp) {
      this.keyCallbacks.anyUp.forEach(callback => callback(event.code, event));
    }
  }
  
  /**
   * Handle mouse move events
   * @param {MouseEvent} event - Mouse move event
   * @private
   */
  _onMouseMove(event) {
    const rect = this.target.getBoundingClientRect();
    this.mouse.x = event.clientX - rect.left;
    this.mouse.y = event.clientY - rect.top;
    
    // Execute mouse move callbacks
    if (this.mouseCallbacks.move) {
      this.mouseCallbacks.move.forEach(callback => callback(this.mouse.x, this.mouse.y, event));
    }
  }
  
  /**
   * Handle mouse down events
   * @param {MouseEvent} event - Mouse down event
   * @private
   */
  _onMouseDown(event) {
    event.preventDefault();
    
    switch (event.button) {
      case 0: // Left button
        this.mouse.buttons.left = true;
        break;
      case 1: // Middle button
        this.mouse.buttons.middle = true;
        break;
      case 2: // Right button
        this.mouse.buttons.right = true;
        break;
    }
    
    // Execute mouse down callbacks
    if (this.mouseCallbacks.down) {
      this.mouseCallbacks.down.forEach(callback => {
        callback(this.mouse.x, this.mouse.y, event.button, event);
      });
    }
  }
  
  /**
   * Handle mouse up events
   * @param {MouseEvent} event - Mouse up event
   * @private
   */
  _onMouseUp(event) {
    switch (event.button) {
      case 0: // Left button
        this.mouse.buttons.left = false;
        break;
      case 1: // Middle button
        this.mouse.buttons.middle = false;
        break;
      case 2: // Right button
        this.mouse.buttons.right = false;
        break;
    }
    
    // Execute mouse up callbacks
    if (this.mouseCallbacks.up) {
      this.mouseCallbacks.up.forEach(callback => {
        callback(this.mouse.x, this.mouse.y, event.button, event);
      });
    }
  }
  
  /**
   * Handle touch start events
   * @param {TouchEvent} event - Touch start event
   * @private
   */
  _onTouchStart(event) {
    event.preventDefault();
    
    const rect = this.target.getBoundingClientRect();
    
    // Update touches array
    this.touches = Array.from(event.touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    }));
    
    // Execute touch start callbacks
    if (this.touchCallbacks.start) {
      this.touchCallbacks.start.forEach(callback => callback(this.touches, event));
    }
    
    // Simulate mouse events for the first touch
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.mouse.x = touch.clientX - rect.left;
      this.mouse.y = touch.clientY - rect.top;
      this.mouse.buttons.left = true;
      
      if (this.mouseCallbacks.down) {
        this.mouseCallbacks.down.forEach(callback => {
          callback(this.mouse.x, this.mouse.y, 0, null);
        });
      }
    }
  }
  
  /**
   * Handle touch move events
   * @param {TouchEvent} event - Touch move event
   * @private
   */
  _onTouchMove(event) {
    event.preventDefault();
    
    const rect = this.target.getBoundingClientRect();
    
    // Update touches array
    this.touches = Array.from(event.touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    }));
    
    // Execute touch move callbacks
    if (this.touchCallbacks.move) {
      this.touchCallbacks.move.forEach(callback => callback(this.touches, event));
    }
    
    // Simulate mouse events for the first touch
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.mouse.x = touch.clientX - rect.left;
      this.mouse.y = touch.clientY - rect.top;
      
      if (this.mouseCallbacks.move) {
        this.mouseCallbacks.move.forEach(callback => {
          callback(this.mouse.x, this.mouse.y, null);
        });
      }
    }
  }
  
  /**
   * Handle touch end events
   * @param {TouchEvent} event - Touch end event
   * @private
   */
  _onTouchEnd(event) {
    const rect = this.target.getBoundingClientRect();
    
    // Update touches array
    this.touches = Array.from(event.touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    }));
    
    // Execute touch end callbacks
    if (this.touchCallbacks.end) {
      this.touchCallbacks.end.forEach(callback => callback(this.touches, event));
    }
    
    // Simulate mouse events when all touches end
    if (event.touches.length === 0) {
      this.mouse.buttons.left = false;
      
      if (this.mouseCallbacks.up) {
        this.mouseCallbacks.up.forEach(callback => {
          callback(this.mouse.x, this.mouse.y, 0, null);
        });
      }
    }
  }
  
  /**
   * Handle gamepad connection
   * @param {GamepadEvent} event - Gamepad connected event
   * @private
   */
  _onGamepadConnected(event) {
    console.log(`Gamepad connected: ${event.gamepad.id}`);
    this.gamepadState[event.gamepad.index] = event.gamepad;
    
    if (this.gamepadCallbacks.connected) {
      this.gamepadCallbacks.connected.forEach(callback => {
        callback(event.gamepad);
      });
    }
  }
  
  /**
   * Handle gamepad disconnection
   * @param {GamepadEvent} event - Gamepad disconnected event
   * @private
   */
  _onGamepadDisconnected(event) {
    console.log(`Gamepad disconnected: ${event.gamepad.id}`);
    delete this.gamepadState[event.gamepad.index];
    
    if (this.gamepadCallbacks.disconnected) {
      this.gamepadCallbacks.disconnected.forEach(callback => {
        callback(event.gamepad);
      });
    }
  }
  
  /**
   * Register a keyboard event callback
   * @param {string} type - Event type ('down', 'up', 'anyDown', 'anyUp')
   * @param {string|Function} keyOrCallback - Key code or callback for 'anyDown'/'anyUp'
   * @param {Function} [callback] - Callback function for specific key events
   */
  onKey(type, keyOrCallback, callback) {
    if (!this.keyCallbacks[type]) {
      this.keyCallbacks[type] = {};
    }
    
    if (type === 'anyDown' || type === 'anyUp') {
      if (!this.keyCallbacks[type]) {
        this.keyCallbacks[type] = [];
      }
      this.keyCallbacks[type].push(keyOrCallback);
    } else {
      if (!this.keyCallbacks[type][keyOrCallback]) {
        this.keyCallbacks[type][keyOrCallback] = [];
      }
      this.keyCallbacks[type][keyOrCallback].push(callback);
    }
  }
  
  /**
   * Register a mouse event callback
   * @param {string} type - Event type ('move', 'down', 'up')
   * @param {Function} callback - Callback function
   */
  onMouse(type, callback) {
    if (!this.mouseCallbacks[type]) {
      this.mouseCallbacks[type] = [];
    }
    this.mouseCallbacks[type].push(callback);
  }
  
  /**
   * Register a touch event callback
   * @param {string} type - Event type ('start', 'move', 'end')
   * @param {Function} callback - Callback function
   */
  onTouch(type, callback) {
    if (!this.touchCallbacks[type]) {
      this.touchCallbacks[type] = [];
    }
    this.touchCallbacks[type].push(callback);
  }
  
  /**
   * Register a gamepad event callback
   * @param {string} type - Event type ('connected', 'disconnected', 'update')
   * @param {Function} callback - Callback function
   */
  onGamepad(type, callback) {
    if (!this.gamepadCallbacks[type]) {
      this.gamepadCallbacks[type] = [];
    }
    this.gamepadCallbacks[type].push(callback);
  }
  
  /**
   * Check if a key is currently pressed
   * @param {string} keyCode - Key code to check
   * @returns {boolean} True if key is pressed
   */
  isKeyPressed(keyCode) {
    return !!this.keys[keyCode];
  }
  
  /**
   * Check if any of the specified keys are pressed
   * @param {string[]} keyCodes - Array of key codes to check
   * @returns {boolean} True if any key is pressed
   */
  isAnyKeyPressed(keyCodes) {
    return keyCodes.some(key => this.isKeyPressed(key));
  }
  
  /**
   * Check if all of the specified keys are pressed
   * @param {string[]} keyCodes - Array of key codes to check
   * @returns {boolean} True if all keys are pressed
   */
  areAllKeysPressed(keyCodes) {
    return keyCodes.every(key => this.isKeyPressed(key));
  }
  
  /**
   * Check if a mouse button is currently pressed
   * @param {string} button - Button to check ('left', 'middle', 'right')
   * @returns {boolean} True if button is pressed
   */
  isMouseButtonPressed(button) {
    return !!this.mouse.buttons[button];
  }
  
  /**
   * Get the current mouse position
   * @returns {Object} Object with x and y coordinates
   */
  getMousePosition() {
    return { x: this.mouse.x, y: this.mouse.y };
  }
  
  /**
   * Get active touch points
   * @returns {Array} Array of touch points
   */
  getTouches() {
    return [...this.touches];
  }
  
  /**
   * Update and poll gamepads
   * Should be called in the game loop
   */
  updateGamepads() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    
    for (const gamepad of gamepads) {
      if (gamepad) {
        this.gamepadState[gamepad.index] = gamepad;
        
        if (this.gamepadCallbacks.update) {
          this.gamepadCallbacks.update.forEach(callback => {
            callback(gamepad);
          });
        }
      }
    }
  }
  
  /**
   * Clean up event listeners
   */
  destroy() {
    // Remove keyboard listeners
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    
    // Remove mouse listeners
    this.target.removeEventListener('mousemove', this._onMouseMove);
    this.target.removeEventListener('mousedown', this._onMouseDown);
    this.target.removeEventListener('mouseup', this._onMouseUp);
    
    // Remove touch listeners
    this.target.removeEventListener('touchstart', this._onTouchStart);
    this.target.removeEventListener('touchmove', this._onTouchMove);
    this.target.removeEventListener('touchend', this._onTouchEnd);
    this.target.removeEventListener('touchcancel', this._onTouchEnd);
    
    // Remove gamepad listeners
    window.removeEventListener('gamepadconnected', this._onGamepadConnected);
    window.removeEventListener('gamepaddisconnected', this._onGamepadDisconnected);
  }
}

export { InputManager }; 