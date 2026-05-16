import React from 'react';
import { cn } from '../../utils/cn';

export interface LabelProps extends React.ComponentPropsWithoutRef<'label'> {}

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      {...props}
      className={cn(
        'text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-1.5 block',
        className
      )}
    >
      {children}
    </label>
  );
}
