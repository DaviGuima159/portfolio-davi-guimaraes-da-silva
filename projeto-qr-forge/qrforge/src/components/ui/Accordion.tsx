import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AccordionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, icon, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02] transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.04] transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-white/60">{icon}</div>}
          <span className="text-sm font-semibold text-slate-300">{title}</span>
        </div>
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-slate-600 transition-transform duration-500",
            isOpen && "rotate-180 text-white"
          )} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-4 pt-0 border-t border-slate-50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
