import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-white text-black hover:bg-slate-200 shadow-xl shadow-white/5',
    secondary: 'bg-slate-800 text-white hover:bg-slate-700 border border-white/5',
    outline: 'border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-slate-200',
    ghost: 'hover:bg-white/5 text-slate-400 hover:text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium',
    md: 'px-4 py-2 text-sm font-semibold',
    lg: 'px-6 py-3 text-base font-semibold',
    icon: 'p-2',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
