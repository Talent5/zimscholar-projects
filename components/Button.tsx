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
  const baseStyles = "inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 rounded-xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 hover:-translate-y-0.5 active:translate-y-0",
    secondary: "glass text-white border border-glass-border hover:border-neon-cyan/30 hover:shadow-lg hover:shadow-neon-cyan/10 hover:-translate-y-0.5 active:translate-y-0",
    outline: "border-2 border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan hover:shadow-lg hover:shadow-neon-cyan/10",
    ghost: "text-slate-400 hover:text-white hover:bg-glass-light",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs gap-1.5",
    md: "px-6 py-3 text-sm gap-2",
    lg: "px-8 py-4 text-base gap-2.5",
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
