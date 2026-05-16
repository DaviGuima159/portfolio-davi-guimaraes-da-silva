import React from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.ComponentPropsWithoutRef<'select'> {
  options: { value: string; label: string }[];
}

export function Select({ className, options, ...props }: SelectProps) {
  return (
    <div className="relative group">
      <select
        {...props}
        className={cn(
          'w-full appearance-none px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all cursor-pointer backdrop-blur-md',
          className
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1A1A1E] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:text-white transition-colors" />
    </div>
  );
}
