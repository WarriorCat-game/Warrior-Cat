/**
 * Validation utility functions for form inputs
 */

/**
 * Validates if a value is not empty
 * @param {string} value - Value to check
 * @returns {boolean} True if value is not empty
 */
export const isNotEmpty = (value) => {
  return value !== undefined && value !== null && value.trim() !== '';
};

/**
 * Validates if a value meets minimum length requirement
 * @param {string} value - Value to check
 * @param {number} minLength - Minimum length required
 * @returns {boolean} True if value meets requirement
 */
export const minLength = (value, minLength) => {
  if (!value) return false;
  return value.length >= minLength;
};

/**
 * Validates if a value meets maximum length requirement
 * @param {string} value - Value to check
 * @param {number} maxLength - Maximum length allowed
 * @returns {boolean} True if value meets requirement
 */
export const maxLength = (value, maxLength) => {
  if (!value) return true;
  return value.length <= maxLength;
};

/**
 * Validates if a value is a valid email address
 * @param {string} value - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (value) => {
  if (!value) return false;
  
  // Simple regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

/**
 * Validates if a value is a valid wallet address for Solana
 * @param {string} value - Wallet address to validate
 * @returns {boolean} True if wallet address is valid
 */
export const isValidWalletAddress = (value) => {
  if (!value) return false;
  
  // Basic check for Solana wallet address format
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);
};

/**
 * Validates if a value contains only alphanumeric characters
 * @param {string} value - Value to validate
 * @returns {boolean} True if value is alphanumeric
 */
export const isAlphanumeric = (value) => {
  if (!value) return false;
  
  return /^[a-zA-Z0-9]+$/.test(value);
};

/**
 * Validates if a value is a valid number within range
 * @param {string|number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if value is a valid number within range
 */
export const isValidNumber = (value, min = null, max = null) => {
  if (value === undefined || value === null || value === '') return false;
  
  const numberValue = Number(value);
  if (isNaN(numberValue)) return false;
  
  if (min !== null && numberValue < min) return false;
  if (max !== null && numberValue > max) return false;
  
  return true;
};

/**
 * Validates if a password meets security requirements
 * @param {string} value - Password to validate
 * @returns {object} Validation results for different criteria
 */
export const validatePassword = (value) => {
  if (!value) {
    return {
      valid: false,
      hasMinLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false
    };
  }
  
  const hasMinLength = value.length >= 8;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);
  
  const valid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  
  return {
    valid,
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar
  };
};

/**
 * Validates if two values match (e.g., password confirmation)
 * @param {string} value1 - First value
 * @param {string} value2 - Second value
 * @returns {boolean} True if values match
 */
export const valuesMatch = (value1, value2) => {
  return value1 === value2;
};

/**
 * Validates if a URL is valid
 * @param {string} value - URL to validate
 * @returns {boolean} True if URL is valid
 */
export const isValidUrl = (value) => {
  if (!value) return false;
  
  try {
    new URL(value);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Creates a validation function that combines multiple validators
 * @param {...Function} validators - Validator functions to combine
 * @returns {Function} Combined validator function
 */
export const combineValidators = (...validators) => {
  return (value) => {
    for (const validator of validators) {
      if (!validator(value)) {
        return false;
      }
    }
    return true;
  };
}; 