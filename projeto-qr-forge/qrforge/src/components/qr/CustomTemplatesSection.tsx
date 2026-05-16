import React, { useState } from 'react';
import { useQR } from '../../context/QRContext';
import { Button } from '../ui/Button';
import { Trash2, Plus, Layout, Save, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '../ui/Input';
import { cn } from '../../utils/cn';

export function CustomTemplatesSection() {
  const { state, saveAsTemplate, deleteTemplate, applyPreset } = useQR();
  const [isAdding, setIsAdding] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const handleSave = async () => {
    if (!templateName.trim()) return;
    await saveAsTemplate(templateName);
    setTemplateName('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Meus Templates</span>
        {!isAdding && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-[9px] gap-1 px-2 border border-white/5 bg-white/5 hover:bg-white/10"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-2.5 h-2.5" />
            Salvar Atual
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2">
          <Input 
            autoFocus
            placeholder="Nome do Template..." 
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="h-9 text-xs"
          />
          <div className="flex gap-2">
            <Button className="flex-1 h-8 text-[10px] gap-1" onClick={handleSave}>
              <Save className="w-3" /> Salvar
            </Button>
            <Button variant="outline" className="flex-1 h-8 text-[10px]" onClick={() => setIsAdding(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {state.customTemplates.length === 0 && !isAdding ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-2xl opacity-40">
          <Layout className="w-6 h-6 mb-2" />
          <p className="text-[9px] uppercase font-bold tracking-widest text-slate-500">Nenhum template salvo</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {state.customTemplates.map((template) => (
            <div 
              key={template.id}
              className="group relative bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-all cursor-pointer overflow-hidden"
              onClick={() => applyPreset(template.options)}
            >
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-white truncate group-hover:text-indigo-400 transition-colors uppercase tracking-wider">
                    {template.name}
                  </p>
                  <p className="text-[8px] text-slate-500 mt-0.5">
                    {formatDistanceToNow(template.timestamp, { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
                <button 
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded-md text-slate-500 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTemplate(template.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              
              <div className="flex gap-1 mt-3">
                <div 
                  className="w-2 h-2 rounded-full shadow-sm" 
                  style={{ backgroundColor: (template.options.dotsOptions as any)?.color || '#fff' }} 
                />
                <div 
                  className="w-2 h-2 rounded-full border border-white/10 shadow-sm" 
                  style={{ backgroundColor: (template.options.backgroundOptions as any)?.color || '#000' }} 
                />
              </div>

              {/* Decorative gradient corner on hover */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
