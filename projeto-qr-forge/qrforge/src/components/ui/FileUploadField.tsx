import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './Button';
import { Label } from './Label';

interface FileUploadFieldProps {
  label: string;
  onFileChange: (file: File | null) => void;
  previewUrl?: string;
}

export function FileUploadField({ label, onFileChange, previewUrl }: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      
      {!previewUrl ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-2xl hover:border-white/30 hover:bg-white/5 transition-all group"
        >
          <Upload className="w-6 h-6 text-slate-600 group-hover:text-white mb-2 transition-colors" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-300">
            Select Asset
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </button>
      ) : (
        <div className="relative p-2 border border-white/10 rounded-2xl flex items-center gap-4 bg-white/5 backdrop-blur-md">
          <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-xl object-contain bg-slate-900 border border-white/10" />
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tight">Active Logo</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFileChange(null)}
            className="text-red-400 hover:bg-red-400/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
