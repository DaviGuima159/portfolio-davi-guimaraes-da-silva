import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
  );
}
