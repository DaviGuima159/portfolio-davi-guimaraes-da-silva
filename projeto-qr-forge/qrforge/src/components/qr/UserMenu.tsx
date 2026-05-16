import React from 'react';
import { useQR } from '../../context/QRContext';
import { Button } from '../ui/Button';
import { LogIn, LogOut, User } from 'lucide-react';

export function UserMenu() {
  const { user, login, logout } = useQR();

  if (!user) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 hover:text-white"
        onClick={login}
      >
        <LogIn className="w-3.5 h-3.5" />
        Entrar / Salvar na Nuvem
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-white/5 p-2 pr-4 rounded-xl border border-white/5 group">
      {user.photoURL ? (
        <img 
          src={user.photoURL} 
          alt={user.displayName || 'User'} 
          className="w-8 h-8 rounded-lg object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <User className="w-4 h-4 text-indigo-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-white truncate leading-tight">
          {user.displayName || 'Artesão'}
        </p>
        <p className="text-[9px] text-slate-500 truncate">Sincronizado</p>
      </div>
      <button 
        onClick={logout}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-red-400"
        title="Sair"
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
