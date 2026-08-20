import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', fullWidth = false, className = '', ...props }) => {
  const base = "inline-flex items-center justify-center font-mono uppercase tracking-wider transition-all duration-300 rounded-full focus:outline-none";
  const v = {
    primary: "bg-brand-600 text-white hover:shadow-lg hover:shadow-brand-600/20 hover:-translate-y-0.5 active:translate-y-0",
    secondary: "bg-slate-600 text-white hover:bg-slate-700 hover:-translate-y-0.5 active:translate-y-0",
    outline: "border border-brand-600 text-brand-600 hover:bg-brand-50 hover:border-brand-600/50 hover:-translate-y-0.5 active:translate-y-0",
    ghost: "text-stone-500 hover:text-stone-800 hover:bg-stone-100",
  };
  const s = { sm: "px-4 py-2 text-xs gap-1.5", md: "px-6 py-3 text-sm gap-2", lg: "px-8 py-4 text-base gap-2.5" };
  return <button className={`${base} ${v[variant]} ${s[size]} ${fullWidth ? 'w-full' : ''} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} {...props}>{children}</button>;
};
