import React from 'react';

interface RetroInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const RetroInput: React.FC<RetroInputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-1 text-black font-serif font-bold">{label}:</label>
      <input
        className={`
          bg-white text-black px-2 py-1 font-mono
          border-t-2 border-l-2 border-black
          border-b-2 border-r-2 border-white
          focus:outline-none
          ${className}
        `}
        {...props}
      />
    </div>
  );
};