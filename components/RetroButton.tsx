import React from 'react';

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'danger';
}

export const RetroButton: React.FC<RetroButtonProps> = ({ children, variant = 'default', className = '', ...props }) => {
  // Windows 95 button style:
  // Gray background.
  // Light Top/Left border.
  // Dark Bottom/Right border.
  // Black text.
  
  return (
    <button
      type="button" // Default to button to prevent form submission unless specified
      className={`
        bg-win-gray text-black font-bold px-4 py-1 
        border-t-2 border-l-2 border-white 
        border-b-2 border-r-2 border-black
        active:border-t-black active:border-l-black active:border-r-white active:border-b-white
        active:border-t-2 active:border-l-2 active:border-b-2 active:border-r-2
        focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1
        disabled:text-gray-500 disabled:active:border-t-white
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};