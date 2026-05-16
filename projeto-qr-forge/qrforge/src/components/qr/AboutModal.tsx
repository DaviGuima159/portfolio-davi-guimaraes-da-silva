import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Hammer, Shield, Zap, Heart, Globe } from 'lucide-react';
import { Button } from '../ui/Button';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0F0F12] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -z-10" />

            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">O Manifesto Forge</h2>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-400 mt-2">Tecnologia com Alma de Artesão</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8 text-slate-300 leading-relaxed">
                <p className="text-lg">
                  O <span className="text-white font-bold italic">Qr Forge</span> surgiu com o intuito de auxiliar pessoas a forjarem códigos QR de forma <span className="text-white underline decoration-indigo-500 underline-offset-4">fácil, acessível e profissional</span>.
                </p>

                <p>
                  Em um mundo saturado de ferramentas genéricas, escolhemos o caminho do artesanato digital. Acreditamos que um QR Code não deve ser apenas funcional, mas sim uma <span className="text-white font-medium">extensão da identidade de uma marca</span>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                      <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider">Acessibilidade</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Interface intuitiva para que qualquer pessoa, sem conhecimentos técnicos, possa criar códigos incríveis.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider">Segurança</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Sincronização em nuvem segura com Firebase, garantindo que suas criações estejam sempre salvas.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                      <Hammer className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider">Artesanato</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Cada estilo, padrão de ponto e template é desenhado para maximizar a escaneabilidade.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                      <Globe className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider">Global</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Feito para conectar o mundo físico ao digital de maneira fluida e elegante.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex flex-col items-center border-t border-white/5">
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 flex items-center gap-2">
                    Forjado com <Heart className="w-3 h-3 text-red-500 fill-red-500" /> para a Web Moderna
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-6 px-10 rounded-full h-12"
                    onClick={onClose}
                  >
                    Voltar para a Forja
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
