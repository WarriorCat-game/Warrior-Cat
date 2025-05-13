/**
 * Asset loading system for game engine
 * Handles loading and caching of images, audio, and other assets
 */

class AssetLoader {
  constructor() {
    // Asset caches
    this.images = {};
    this.audio = {};
    this.json = {};
    this.other = {};
    
    // Tracking loading state
    this.totalAssets = 0;
    this.loadedAssets = 0;
    this.isLoading = false;
    
    // Callbacks
    this.onProgress = null;
    this.onComplete = null;
    this.onError = null;
  }
  
  /**
   * Load a batch of assets
   * @param {Object} assets - Object containing assets to load
   * @param {Function} onComplete - Callback when all assets are loaded
   * @param {Function} onProgress - Callback for loading progress
   * @param {Function} onError - Callback for loading errors
   * @returns {Promise} Promise that resolves when all assets are loaded
   */
  loadAssets(assets, onComplete, onProgress, onError) {
    this.isLoading = true;
    this.totalAssets = 0;
    this.loadedAssets = 0;
    
    this.onComplete = onComplete;
    this.onProgress = onProgress;
    this.onError = onError;
    
    const promises = [];
    
    // Process images
    if (assets.images) {
      this.totalAssets += Object.keys(assets.images).length;
      for (const [key, url] of Object.entries(assets.images)) {
        promises.push(this.loadImage(key, url));
      }
    }
    
    // Process audio
    if (assets.audio) {
      this.totalAssets += Object.keys(assets.audio).length;
      for (const [key, url] of Object.entries(assets.audio)) {
        promises.push(this.loadAudio(key, url));
      }
    }
    
    // Process JSON files
    if (assets.json) {
      this.totalAssets += Object.keys(assets.json).length;
      for (const [key, url] of Object.entries(assets.json)) {
        promises.push(this.loadJSON(key, url));
      }
    }
    
    // Process other assets
    if (assets.other) {
      this.totalAssets += Object.keys(assets.other).length;
      for (const [key, url] of Object.entries(assets.other)) {
        promises.push(this.loadOther(key, url));
      }
    }
    
    return Promise.all(promises)
      .then(() => {
        this.isLoading = false;
        if (this.onComplete) this.onComplete();
        return {
          images: this.images,
          audio: this.audio,
          json: this.json,
          other: this.other
        };
      })
      .catch(error => {
        console.error('Error loading assets:', error);
        if (this.onError) this.onError(error);
        throw error;
      });
  }
  
  /**
   * Load an image asset
   * @param {string} key - Asset identifier
   * @param {string} url - Asset URL
   * @returns {Promise} Promise that resolves when the asset is loaded
   */
  loadImage(key, url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.images[key] = img;
        this.assetLoaded();
        resolve(img);
      };
      
      img.onerror = (error) => {
        console.error(`Failed to load image: ${url}`, error);
        this.assetFailed(error);
        reject(error);
      };
      
      img.src = url;
    });
  }
  
  /**
   * Load an audio asset
   * @param {string} key - Asset identifier
   * @param {string} url - Asset URL
   * @returns {Promise} Promise that resolves when the asset is loaded
   */
  loadAudio(key, url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      
      audio.oncanplaythrough = () => {
        this.audio[key] = audio;
        this.assetLoaded();
        resolve(audio);
      };
      
      audio.onerror = (error) => {
        console.error(`Failed to load audio: ${url}`, error);
        this.assetFailed(error);
        reject(error);
      };
      
      audio.src = url;
      audio.load();
    });
  }
  
  /**
   * Load a JSON asset
   * @param {string} key - Asset identifier
   * @param {string} url - Asset URL
   * @returns {Promise} Promise that resolves when the asset is loaded
   */
  loadJSON(key, url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        this.json[key] = data;
        this.assetLoaded();
        return data;
      })
      .catch(error => {
        console.error(`Failed to load JSON: ${url}`, error);
        this.assetFailed(error);
        throw error;
      });
  }
  
  /**
   * Load any other type of asset
   * @param {string} key - Asset identifier
   * @param {string} url - Asset URL
   * @returns {Promise} Promise that resolves when the asset is loaded
   */
  loadOther(key, url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        this.other[key] = URL.createObjectURL(blob);
        this.assetLoaded();
        return this.other[key];
      })
      .catch(error => {
        console.error(`Failed to load asset: ${url}`, error);
        this.assetFailed(error);
        throw error;
      });
  }
  
  /**
   * Called when an asset is successfully loaded
   */
  assetLoaded() {
    this.loadedAssets++;
    
    if (this.onProgress) {
      const progress = this.loadedAssets / this.totalAssets;
      this.onProgress(progress, this.loadedAssets, this.totalAssets);
    }
  }
  
  /**
   * Called when an asset fails to load
   * @param {Error} error - The error that occurred
   */
  assetFailed(error) {
    if (this.onError) {
      this.onError(error);
    }
  }
  
  /**
   * Get the loading progress as a percentage
   * @returns {number} Progress percentage (0-100)
   */
  getProgress() {
    return (this.loadedAssets / this.totalAssets) * 100;
  }
  
  /**
   * Get an image by key
   * @param {string} key - Asset identifier
   * @returns {Image|null} The requested image or null if not found
   */
  getImage(key) {
    return this.images[key] || null;
  }
  
  /**
   * Get an audio file by key
   * @param {string} key - Asset identifier
   * @returns {Audio|null} The requested audio or null if not found
   */
  getAudio(key) {
    return this.audio[key] || null;
  }
  
  /**
   * Get JSON data by key
   * @param {string} key - Asset identifier
   * @returns {Object|null} The requested JSON data or null if not found
   */
  getJSON(key) {
    return this.json[key] || null;
  }
  
  /**
   * Get other asset by key
   * @param {string} key - Asset identifier
   * @returns {string|null} The requested asset URL or null if not found
   */
  getOther(key) {
    return this.other[key] || null;
  }
  
  /**
   * Clear all cached assets
   */
  clearCache() {
    // Release object URLs to prevent memory leaks
    Object.values(this.other).forEach(url => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    
    this.images = {};
    this.audio = {};
    this.json = {};
    this.other = {};
  }
}

export { AssetLoader }; 