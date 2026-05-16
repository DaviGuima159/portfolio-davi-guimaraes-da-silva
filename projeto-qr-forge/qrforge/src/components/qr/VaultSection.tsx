import React from 'react';
import { useQR } from '../../context/QRContext';
import { Button } from '../ui/Button';
import { Heart, Trash2, Clock, History as HistoryIcon, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface VaultSectionProps {
  type: 'history' | 'favorites';
}

export function VaultSection({ type }: VaultSectionProps) {
  const { state, toggleFavorite, deleteHistoryItem, loadHistoryItem } = useQR();

  const items = type === 'history' 
    ? state.history 
    : state.history.filter(i => i.isFavorite);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center opacity-40">
        {type === 'history' ? <HistoryIcon className="w-8 h-8 mb-2" /> : <Star className="w-8 h-8 mb-2" />}
        <p className="text-xs font-medium uppercase tracking-widest leading-loose">
          {type === 'history' ? 'Nenhum QR forjado recentemente' : 'Sem favoritos salvos'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {items.map((item) => (
        <div 
          key={item.id}
          className="group relative bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all cursor-pointer"
          onClick={() => loadHistoryItem(item)}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0 pr-8">
              <p className="text-xs font-bold text-white truncate">{item.data}</p>
              <p className="text-[10px] text-slate-500 mt-1">
                {formatDistanceToNow(item.timestamp, { addSuffix: true, locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className={item.isFavorite ? 'text-amber-400' : 'text-slate-500'}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item.id);
              }}
            >
              <Heart className={item.isFavorite ? 'w-4 h-4 fill-current' : 'w-4 h-4'} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-500 hover:text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                deleteHistoryItem(item.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Mini preview indicator */}
          <div className="absolute top-4 right-4 w-6 h-6 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: (item.options.dotsOptions as any)?.color || '#fff' }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}
