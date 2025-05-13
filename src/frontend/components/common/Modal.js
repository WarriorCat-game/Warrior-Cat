/**
 * Modal component for displaying dialogs and overlays
 */
import React, { useEffect } from 'react';
import '../../styles/components/Modal.css';
import Button from './Button';

/**
 * Modal component for dialogs, forms, and other overlays
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} [props.title] - Modal title
 * @param {string} [props.size='medium'] - Modal size (small, medium, large)
 * @param {boolean} [props.closeOnOverlayClick=true] - Whether clicking the overlay closes the modal
 * @param {boolean} [props.showCloseButton=true] - Whether to show a close button in the header
 * @param {React.ReactNode} [props.footer] - Custom footer content
 * @param {string} [props.className] - Additional CSS class names
 * @returns {React.ReactElement|null} Modal component or null if closed
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'medium',
  closeOnOverlayClick = true,
  showCloseButton = true,
  footer,
  className = '',
  ...rest
}) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // Add event listener for Escape key
      document.addEventListener('keydown', handleEscapeKey);
      
      // Prevent body scrolling while modal is open
      document.body.style.overflow = 'hidden';
    }

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      
      // Restore body scrolling when modal is closed
      if (isOpen) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, onClose]);

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  // Handle overlay click
  const handleOverlayClick = (e) => {
    // Only close if the click was directly on the overlay (not its children)
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  // Construct modal class names
  const modalClasses = [
    'modal-container',
    `modal-size-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className={modalClasses} {...rest}>
        {/* Modal header */}
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="small"
                onClick={onClose}
                className="modal-close-button"
                aria-label="Close dialog"
              >
                &times;
              </Button>
            )}
          </div>
        )}
        
        {/* Modal content */}
        <div className="modal-content">
          {children}
        </div>
        
        {/* Modal footer */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal; 