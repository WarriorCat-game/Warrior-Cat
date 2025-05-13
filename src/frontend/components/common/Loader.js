/**
 * Loader component for indicating loading states
 */
import React from 'react';
import '../../styles/components/Loader.css';

/**
 * Loader component with different sizes and variants
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='medium'] - Loader size (small, medium, large)
 * @param {string} [props.variant='primary'] - Color variant (primary, secondary, white)
 * @param {boolean} [props.fullScreen=false] - Whether to display as a full-screen overlay
 * @param {string} [props.text] - Optional text to display below the loader
 * @param {string} [props.className] - Additional CSS class names
 * @returns {React.ReactElement} Loader component
 */
const Loader = ({
  size = 'medium',
  variant = 'primary',
  fullScreen = false,
  text,
  className = '',
  ...rest
}) => {
  // Construct loader class names
  const loaderClasses = [
    'loader',
    `loader-${size}`,
    `loader-${variant}`,
    className
  ].filter(Boolean).join(' ');

  // If fullScreen is true, render with overlay
  if (fullScreen) {
    return (
      <div className="loader-overlay" {...rest}>
        <div className="loader-container">
          <div className={loaderClasses}>
            <div className="loader-spinner"></div>
          </div>
          {text && <div className="loader-text">{text}</div>}
        </div>
      </div>
    );
  }

  // Otherwise, render standalone loader
  return (
    <div className="loader-container" {...rest}>
      <div className={loaderClasses}>
        <div className="loader-spinner"></div>
      </div>
      {text && <div className="loader-text">{text}</div>}
    </div>
  );
};

export default Loader; 