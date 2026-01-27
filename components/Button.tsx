import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-brand-600 hover:bg-brand-700 text-white shadow-lg hover:shadow-xl focus:ring-brand-500",
    secondary: "bg-accent-400 hover:bg-accent-500 text-slate-900 shadow-md hover:shadow-lg focus:ring-accent-400",
    outline: "border-2 border-brand-600 text-brand-600 hover:bg-brand-50 focus:ring-brand-500",
    ghost: "text-brand-600 hover:bg-brand-50 hover:text-brand-700",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};