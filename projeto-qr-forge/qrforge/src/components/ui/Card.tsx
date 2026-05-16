import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('bg-white border border-slate-100 rounded-2xl p-4 shadow-sm', className)}>
      {children}
    </div>
  );
}
