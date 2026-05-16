import React from 'react';

interface PreviewAreaProps {
  children: React.ReactNode;
}

export function PreviewArea({ children }: PreviewAreaProps) {
  return (
    <main className="flex-1 bg-[#050505] flex items-center justify-center p-8 overflow-auto relative">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-2xl flex flex-col items-center relative z-10">
        {children}
      </div>
    </main>
  );
}
