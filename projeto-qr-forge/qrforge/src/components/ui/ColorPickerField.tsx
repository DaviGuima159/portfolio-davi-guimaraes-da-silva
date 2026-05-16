import React from 'react';
import { Label } from './Label';

interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorPickerField({ label, value, onChange }: ColorPickerFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="relative group overflow-hidden w-10 h-10 rounded-xl border border-white/10 glow-indigo">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -top-2 -left-2 w-[150%] h-[150%] cursor-pointer border-none bg-transparent"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-mono text-slate-400 uppercase focus:ring-1 focus:ring-white/20 outline-none"
        />
      </div>
    </div>
  );
}
