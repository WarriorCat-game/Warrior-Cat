/**
 * Common Input component with validation support
 */
import React, { useState } from 'react';
import '../../styles/components/Input.css';

/**
 * Input component with label, validation, and error messaging
 * 
 * @param {Object} props - Component props
 * @param {string} props.name - Input name attribute
 * @param {string} props.label - Input label text
 * @param {string} [props.type='text'] - Input type attribute
 * @param {string} [props.value=''] - Input value
 * @param {Function} props.onChange - Change handler function
 * @param {string} [props.placeholder=''] - Input placeholder text
 * @param {boolean} [props.required=false] - Whether input is required
 * @param {string} [props.error=''] - Error message to display
 * @param {boolean} [props.disabled=false] - Whether input is disabled
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {Function} [props.onBlur] - Blur handler function
 * @param {Function} [props.onFocus] - Focus handler function
 * @returns {React.ReactElement} Input component
 */
const Input = ({
  name,
  label,
  type = 'text',
  value = '',
  onChange,
  placeholder = '',
  required = false,
  error = '',
  disabled = false,
  className = '',
  onBlur,
  onFocus,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  
  // Determine if the input has a value (for floating label effect)
  const hasValue = value !== undefined && value !== '';
  
  // Handle focus event
  const handleFocus = (e) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };
  
  // Handle blur event
  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };
  
  // Determine input container class names
  const inputContainerClasses = [
    'input-container',
    focused ? 'input-focused' : '',
    hasValue ? 'input-filled' : '',
    error ? 'input-error' : '',
    disabled ? 'input-disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={inputContainerClasses}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label} {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="input-field"
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
      />
      
      {error && (
        <div className="input-error-message" id={`${name}-error`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Input; 