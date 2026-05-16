/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { PreviewArea } from './components/layout/PreviewArea';
import { SettingsPanel } from './components/qr/SettingsPanel';
import { QRPreviewCanvas } from './components/qr/QRPreviewCanvas';
import { QRAnalysisPanel } from './components/qr/QRAnalysisPanel';
import { AboutModal } from './components/qr/AboutModal';
import { Button } from './components/ui/Button';
import { Download, RefreshCw } from 'lucide-react';
import { QRProvider, useQR } from './context/QRContext';

function AppContent() {
  const { reset, download } = useQR();
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#0F0F12] text-slate-200 font-sans">
      {/* Sidebar - Configurações */}
      <Sidebar onInfoClick={() => setShowAbout(true)}>
        <SettingsPanel />
      </Sidebar>

      {/* Main Preview */}
      <PreviewArea>
        <div className="glass-panel p-12 rounded-[2.5rem] flex flex-col items-center gap-10 border border-white/10 transition-all duration-700 hover:shadow-indigo-500/5">
          
          {/* Renderização Dinâmica do QR Code */}
          <div className="p-4 bg-[#0A0A0B] rounded-3xl shadow-2xl relative group overflow-hidden border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <QRPreviewCanvas />
          </div>

          {/* Painel de Análise Inteligente */}
          <div className="w-full max-w-sm">
            <QRAnalysisPanel />
          </div>

          <div className="flex gap-4 w-full max-w-sm">
            <Button className="flex-1 gap-2 h-14" size="lg" onClick={download}>
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button variant="outline" className="gap-2" size="lg" onClick={reset}>
              <RefreshCw className="w-4 h-4" />
              Limpar
            </Button>
          </div>
        </div>
      </PreviewArea>

      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
}

export default function App() {
  return (
    <QRProvider>
      <AppContent />
    </QRProvider>
  );
}
