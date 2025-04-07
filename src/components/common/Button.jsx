import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button component with consistent styling across the application
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, outline, text)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {React.ReactNode} props.leftIcon - Icon to display on the left side of the button
 * @param {React.ReactNode} props.rightIcon - Icon to display on the right side of the button
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  type = 'button',
  onClick,
  children,
  className = '',
  ...rest
}) => {
  // Base styles for all buttons
  const baseStyles = 'font-medium rounded-md transition-colors duration-300 flex items-center justify-center';
  
  // Size variations
  const sizeStyles = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-sm',
    lg: 'py-4 px-8 text-base',
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary hover:bg-primary-dark text-black shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-primary',
    secondary: 'bg-secondary hover:bg-secondary-dark text-black shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-secondary',
    outline: 'border border-gray-600 bg-gray-700 hover:bg-gray-600 text-white shadow-sm',
    text: 'text-primary hover:text-primary-light hover:bg-gray-700 bg-transparent text-white',
  };
  
  // State styles
  const stateStyles = disabled || isLoading 
    ? 'opacity-70 cursor-not-allowed bg-gray-400 hover:bg-gray-400 shadow-none' 
    : '';
  
  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';
  
  // Loading spinner
  const loadingSpinner = (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button
      type={type}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${stateStyles} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading && loadingSpinner}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Button;
