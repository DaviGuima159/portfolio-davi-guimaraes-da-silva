import React, { useMemo } from 'react';
import { useQR } from '../../context/QRContext';
import { analyzeQR } from '../../utils/analysis';
import { ShieldCheck, ShieldAlert, ShieldX, Info, Zap } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export function QRAnalysisPanel() {
  const { state, autoCorrectContrast } = useQR();
  const analysis = useMemo(() => analyzeQR(state.options), [state.options]);

  const config = {
    excellent: { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Excelente' },
    good: { icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Bom' },
    warning: { icon: ShieldAlert, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Atenção' },
    critical: { icon: ShieldX, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Crítico' },
  }[analysis.status];

  const Icon = config.icon;

  return (
    <div className={cn("mt-6 p-4 rounded-2xl border border-white/5 backdrop-blur-md transition-all", config.bg)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4", config.color)} />
          <span className="text-xs font-bold uppercase tracking-wider text-white">Escaneabilidade: {config.label}</span>
        </div>
        <span className={cn("text-xs font-mono font-bold", config.color)}>{analysis.score}%</span>
      </div>

      {analysis.suggestions.length > 0 && (
        <div className="space-y-2">
          {analysis.suggestions.map((s, i) => (
            <div key={i} className="flex gap-2">
              <Info className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-relaxed italic">{s}</p>
            </div>
          ))}
          
          {analysis.status !== 'excellent' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full mt-4 h-8 text-[9px] gap-2 border-white/10 bg-white/5 hover:bg-indigo-500 hover:text-white"
              onClick={autoCorrectContrast}
            >
              <Zap className="w-3 h-3" />
              Auto-Corrigir Contraste
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
