/**
 * Sound Manager for the game engine
 * Handles loading, playing, and managing audio
 */

class SoundManager {
  /**
   * Initialize the sound manager
   */
  constructor() {
    // Sound collections
    this.sounds = {};
    this.music = {};
    
    // Current state
    this.currentMusic = null;
    this.currentMusicVolume = 1;
    this.masterVolume = 1;
    this.soundVolume = 1;
    this.musicVolume = 0.7;
    this.isMuted = false;
    
    // Track active sound instances
    this.activeSounds = [];
    
    // Context initialization
    this.context = null;
    this.initAudioContext();
    
    // Context state tracking
    this.isContextRunning = false;
    
    // Bind methods
    this.resumeAudioContext = this.resumeAudioContext.bind(this);
  }
  
  /**
   * Initialize Web Audio API context
   */
  initAudioContext() {
    try {
      // Create audio context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContext();
      
      // Create master gain node
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = this.masterVolume;
      this.masterGain.connect(this.context.destination);
      
      // Create separate gain nodes for sounds and music
      this.soundsGain = this.context.createGain();
      this.soundsGain.gain.value = this.soundVolume;
      this.soundsGain.connect(this.masterGain);
      
      this.musicGain = this.context.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);
      
      // Add interaction listeners to start audio context
      window.addEventListener('click', this.resumeAudioContext, { once: true });
      window.addEventListener('touchstart', this.resumeAudioContext, { once: true });
      window.addEventListener('keydown', this.resumeAudioContext, { once: true });
      
      console.log('Audio context initialized');
    } catch (error) {
      console.error('Web Audio API not supported:', error);
    }
  }
  
  /**
   * Resume audio context after user interaction
   */
  resumeAudioContext() {
    if (this.context && this.context.state !== 'running') {
      this.context.resume().then(() => {
        console.log('Audio context resumed');
        this.isContextRunning = true;
      }).catch(error => {
        console.error('Error resuming audio context:', error);
      });
    } else {
      this.isContextRunning = true;
    }
  }
  
  /**
   * Load a sound effect
   * @param {string} key - Identifier for the sound
   * @param {string} url - URL of the sound file
   * @returns {Promise} Promise resolving when the sound is loaded
   */
  loadSound(key, url) {
    return fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.sounds[key] = audioBuffer;
        return audioBuffer;
      })
      .catch(error => {
        console.error(`Error loading sound "${key}":`, error);
        throw error;
      });
  }
  
  /**
   * Load a music track
   * @param {string} key - Identifier for the music
   * @param {string} url - URL of the music file
   * @returns {Promise} Promise resolving when the music is loaded
   */
  loadMusic(key, url) {
    return fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.music[key] = audioBuffer;
        return audioBuffer;
      })
      .catch(error => {
        console.error(`Error loading music "${key}":`, error);
        throw error;
      });
  }
  
  /**
   * Play a sound effect
   * @param {string} key - Identifier for the sound
   * @param {Object} options - Playback options
   * @param {number} options.volume - Volume level (0-1)
   * @param {number} options.pan - Stereo panning (-1 to 1)
   * @param {number} options.rate - Playback rate (1 = normal)
   * @param {boolean} options.loop - Whether to loop the sound
   * @returns {Object} Sound instance with control methods
   */
  playSound(key, options = {}) {
    if (!this.sounds[key]) {
      console.warn(`Sound "${key}" not found`);
      return null;
    }
    
    if (this.isMuted) {
      return null;
    }
    
    const source = this.context.createBufferSource();
    source.buffer = this.sounds[key];
    
    // Set playback rate
    if (options.rate !== undefined) {
      source.playbackRate.value = options.rate;
    }
    
    // Set loop
    source.loop = !!options.loop;
    
    // Create gain node for this sound
    const gainNode = this.context.createGain();
    gainNode.gain.value = (options.volume !== undefined ? options.volume : 1) * this.soundVolume;
    
    // Create and connect panner if needed
    let panner = null;
    if (options.pan !== undefined) {
      panner = this.context.createStereoPanner();
      panner.pan.value = options.pan;
      source.connect(panner);
      panner.connect(gainNode);
    } else {
      source.connect(gainNode);
    }
    
    // Connect to master output
    gainNode.connect(this.soundsGain);
    
    // Start playback
    const startTime = this.context.currentTime;
    source.start(0);
    
    // Create sound instance object
    const soundInstance = {
      source,
      gainNode,
      panner,
      startTime,
      duration: source.buffer.duration,
      isPaused: false,
      
      // Stop playback
      stop() {
        try {
          source.stop();
        } catch (error) {
          // Ignore errors from stopping already stopped sources
        }
        this.removeFromActive(soundInstance);
      },
      
      // Set volume
      setVolume(value) {
        gainNode.gain.value = value * this.soundVolume;
      },
      
      // Set panning
      setPan(value) {
        if (panner) {
          panner.pan.value = value;
        }
      },
      
      // Set playback rate
      setRate(value) {
        source.playbackRate.value = value;
      }
    };
    
    // Track active sounds
    this.activeSounds.push(soundInstance);
    
    // Remove from active sounds when finished
    source.onended = () => {
      this.removeFromActive(soundInstance);
    };
    
    return soundInstance;
  }
  
  /**
   * Play a music track
   * @param {string} key - Identifier for the music
   * @param {Object} options - Playback options
   * @param {number} options.volume - Volume level (0-1)
   * @param {number} options.fadeIn - Fade-in time in seconds
   * @param {boolean} options.loop - Whether to loop the music
   * @returns {Object} Music instance with control methods
   */
  playMusic(key, options = {}) {
    if (!this.music[key]) {
      console.warn(`Music "${key}" not found`);
      return null;
    }
    
    // Stop current music if playing
    if (this.currentMusic) {
      this.stopMusic();
    }
    
    const source = this.context.createBufferSource();
    source.buffer = this.music[key];
    
    // Set loop
    source.loop = options.loop !== undefined ? options.loop : true;
    
    // Create gain node for this music
    const gainNode = this.context.createGain();
    
    // Set initial volume (0 if fading in)
    const targetVolume = (options.volume !== undefined ? options.volume : 1) * this.musicVolume;
    if (options.fadeIn) {
      gainNode.gain.value = 0;
      gainNode.gain.linearRampToValueAtTime(
        targetVolume,
        this.context.currentTime + options.fadeIn
      );
    } else {
      gainNode.gain.value = targetVolume;
    }
    
    // Connect to music output
    source.connect(gainNode);
    gainNode.connect(this.musicGain);
    
    // Start playback
    const startTime = this.context.currentTime;
    source.start(0);
    
    // Create music instance object
    const musicInstance = {
      source,
      gainNode,
      key,
      startTime,
      duration: source.buffer.duration,
      isPaused: false,
      
      // Fade out and stop
      fadeOut(duration = 1) {
        gainNode.gain.linearRampToValueAtTime(
          0,
          this.context.currentTime + duration
        );
        setTimeout(() => {
          try {
            source.stop();
          } catch (error) {
            // Ignore errors from stopping already stopped sources
          }
        }, duration * 1000);
      },
      
      // Set volume
      setVolume(value) {
        this.currentMusicVolume = value;
        gainNode.gain.value = value * this.musicVolume;
      }
    };
    
    // Store as current music
    this.currentMusic = musicInstance;
    this.currentMusicVolume = targetVolume / this.musicVolume;
    
    return musicInstance;
  }
  
  /**
   * Stop the currently playing music
   * @param {number} fadeOut - Optional fade-out time in seconds
   */
  stopMusic(fadeOut = 0) {
    if (!this.currentMusic) return;
    
    if (fadeOut > 0) {
      this.currentMusic.fadeOut(fadeOut);
    } else {
      try {
        this.currentMusic.source.stop();
      } catch (error) {
        // Ignore errors from stopping already stopped sources
      }
    }
    
    this.currentMusic = null;
  }
  
  /**
   * Remove a sound instance from the active sounds array
   * @param {Object} instance - Sound instance to remove
   */
  removeFromActive(instance) {
    const index = this.activeSounds.indexOf(instance);
    if (index !== -1) {
      this.activeSounds.splice(index, 1);
    }
  }
  
  /**
   * Set master volume
   * @param {number} volume - Volume level (0-1)
   */
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.masterGain.gain.value = this.isMuted ? 0 : this.masterVolume;
  }
  
  /**
   * Set sound effects volume
   * @param {number} volume - Volume level (0-1)
   */
  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
    this.soundsGain.gain.value = this.isMuted ? 0 : this.soundVolume;
  }
  
  /**
   * Set music volume
   * @param {number} volume - Volume level (0-1)
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.musicGain.gain.value = this.isMuted ? 0 : this.musicVolume;
    
    // Also update current music if playing
    if (this.currentMusic) {
      this.currentMusic.gainNode.gain.value = this.currentMusicVolume * this.musicVolume;
    }
  }
  
  /**
   * Mute all audio
   */
  mute() {
    if (this.isMuted) return;
    
    this.isMuted = true;
    this.masterGain.gain.value = 0;
  }
  
  /**
   * Unmute audio
   */
  unmute() {
    if (!this.isMuted) return;
    
    this.isMuted = false;
    this.masterGain.gain.value = this.masterVolume;
  }
  
  /**
   * Toggle mute state
   * @returns {boolean} New mute state
   */
  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
    return this.isMuted;
  }
  
  /**
   * Pause all currently playing sounds
   */
  pauseAll() {
    this.context.suspend();
  }
  
  /**
   * Resume all paused sounds
   */
  resumeAll() {
    this.context.resume();
  }
  
  /**
   * Stop all currently playing sounds
   */
  stopAll() {
    // Stop all active sounds
    this.activeSounds.forEach(sound => {
      try {
        sound.source.stop();
      } catch (error) {
        // Ignore errors from stopping already stopped sources
      }
    });
    this.activeSounds = [];
    
    // Stop current music
    if (this.currentMusic) {
      try {
        this.currentMusic.source.stop();
      } catch (error) {
        // Ignore errors from stopping already stopped sources
      }
      this.currentMusic = null;
    }
  }
}

export { SoundManager }; 