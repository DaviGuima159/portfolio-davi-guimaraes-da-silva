import React from 'react';
import { UserMenu } from '../qr/UserMenu';
import { HelpCircle } from 'lucide-react';

interface SidebarProps {
  children: React.ReactNode;
  onInfoClick?: () => void;
}

export function Sidebar({ children, onInfoClick }: SidebarProps) {
  return (
    <aside className="w-full lg:w-96 h-full flex flex-col bg-[#0A0A0B] border-r border-white/5 overflow-y-auto">
      <div className="p-8 border-b border-white/5 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Qr Forge</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">Mastercrafted Codes</p>
          </div>
          <button 
            onClick={onInfoClick}
            className="p-2 text-slate-500 hover:text-white transition-colors hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5"
            title="Sobre o Qr Forge"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        
        <UserMenu />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </aside>
  );
}
