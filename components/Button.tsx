import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', fullWidth = false, className = '', ...props }) => {
  const base = "inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 rounded-xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  const v = {
    primary: "bg-neon-cyan text-white hover:shadow-lg hover:shadow-neon-cyan/20 hover:-translate-y-0.5 active:translate-y-0",
    secondary: "border border-stone-200 text-stone-700 bg-white hover:border-stone-300 hover:bg-stone-50 hover:-translate-y-0.5 active:translate-y-0",
    outline: "border border-neon-cyan/30 text-neon-cyan hover:bg-blue-50 hover:border-neon-cyan/50 hover:-translate-y-0.5 active:translate-y-0",
    ghost: "text-stone-500 hover:text-stone-800 hover:bg-stone-100",
  };
  const s = { sm: "px-4 py-2 text-xs gap-1.5", md: "px-6 py-3 text-sm gap-2", lg: "px-8 py-4 text-base gap-2.5" };
  return <button className={`${base} ${v[variant]} ${s[size]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>{children}</button>;
};
