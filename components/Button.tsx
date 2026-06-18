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
  const baseStyles = "inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 rounded-full focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-neon-cyan text-white hover:shadow-lg hover:shadow-neon-cyan/15 hover:-translate-y-0.5 active:translate-y-0",
    secondary: "border border-white/10 text-white hover:border-white/20 hover:bg-white/[0.03] hover:-translate-y-0.5 active:translate-y-0",
    outline: "border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/5 hover:border-neon-cyan/50 hover:-translate-y-0.5 active:translate-y-0",
    ghost: "text-slate-400 hover:text-white hover:bg-white/[0.03]",
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
