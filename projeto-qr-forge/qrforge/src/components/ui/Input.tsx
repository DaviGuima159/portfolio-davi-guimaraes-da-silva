import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.ComponentPropsWithoutRef<'input'> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={cn(
        'w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all backdrop-blur-md',
        className
      )}
    />
  );
}
