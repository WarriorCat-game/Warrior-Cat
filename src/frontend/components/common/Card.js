/**
 * Card component for displaying content in a contained box
 */
import React from 'react';
import '../../styles/components/Card.css';

/**
 * Card component with customizable elevation, padding, and border
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className] - Additional CSS class names
 * @param {number} [props.elevation=1] - Card elevation (1-5)
 * @param {string} [props.padding='medium'] - Card padding (small, medium, large)
 * @param {boolean} [props.outlined=false] - Whether card has outline instead of shadow
 * @param {boolean} [props.interactive=false] - Whether card has hover/active states
 * @param {Function} [props.onClick] - Click handler
 * @returns {React.ReactElement} Card component
 */
const Card = ({
  children,
  className = '',
  elevation = 1,
  padding = 'medium',
  outlined = false,
  interactive = false,
  onClick,
  ...rest
}) => {
  // Construct class names based on props
  const cardClasses = [
    'card',
    outlined ? 'card-outlined' : `card-elevation-${elevation}`,
    `card-padding-${padding}`,
    interactive ? 'card-interactive' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card; 