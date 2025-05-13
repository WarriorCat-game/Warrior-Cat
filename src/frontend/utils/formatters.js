/**
 * Utility functions for formatting data in the application
 */

/**
 * Formats a wallet address by shortening it for display
 * @param {string} address - The wallet address to format
 * @param {number} startChars - Number of characters to show at start (default: 4)
 * @param {number} endChars - Number of characters to show at end (default: 4)
 * @returns {string} Formatted wallet address
 */
export const formatAddress = (address, startChars = 4, endChars = 4) => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
};

/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'SOL')
 * @param {number} decimals - Decimal places (default: 2)
 * @returns {string} Formatted currency amount
 */
export const formatCurrency = (amount, currency = 'SOL', decimals = 2) => {
  if (amount === undefined || amount === null) return `0 ${currency}`;
  
  const formattedAmount = Number(amount).toFixed(decimals);
  return `${formattedAmount} ${currency}`;
};

/**
 * Formats a date for display
 * @param {Date|string|number} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  return new Intl.DateTimeFormat('en-US', {...defaultOptions, ...options}).format(dateObj);
};

/**
 * Formats a number with thousands separators
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places (default: 0)
 * @returns {string} Formatted number
 */
export const formatNumber = (num, decimals = 0) => {
  if (num === undefined || num === null) return '0';
  
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formats a file size in bytes to a human-readable format
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Decimal places (default: 2)
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Formats a duration in milliseconds to a readable format
 * @param {number} ms - Duration in milliseconds
 * @param {boolean} showSeconds - Whether to include seconds (default: true)
 * @returns {string} Formatted duration
 */
export const formatDuration = (ms, showSeconds = true) => {
  if (!ms) return '0m';
  
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
  const parts = [];
  
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (showSeconds && seconds > 0) parts.push(`${seconds}s`);
  
  return parts.join(' ') || '0s';
}; 