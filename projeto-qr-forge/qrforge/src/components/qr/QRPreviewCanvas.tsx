import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { useQR } from '../../context/QRContext';

export function QRPreviewCanvas() {
  const { state, setDownloadTrigger } = useQR();
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  // Inicialização única da instância da biblioteca
  useEffect(() => {
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling(state.options);
      
      if (containerRef.current) {
        qrCodeRef.current.append(containerRef.current);
      }

      // Registra a função de download no contexto centralizado
      setDownloadTrigger((dlOptions) => {
        if (!qrCodeRef.current) return;
        
        const extension = dlOptions?.extension || state.extension;
        const size = dlOptions?.size || state.downloadSize;

        // Temporarily update options for high res download if needed
        const originalWidth = state.options.width;
        const originalHeight = state.options.height;

        if (size !== originalWidth) {
          qrCodeRef.current.update({ width: size, height: size });
        }

        qrCodeRef.current.download({
          name: 'qr-forge',
          extension: extension
        }).then(() => {
          // Restore original size
          if (size !== originalWidth) {
            qrCodeRef.current?.update({ width: originalWidth, height: originalHeight });
          }
        });
      });
    }
  }, [setDownloadTrigger, state.extension, state.downloadSize, state.options.width, state.options.height]);

  // Atualização reativa e performática via método update()
  useEffect(() => {
    if (qrCodeRef.current) {
      qrCodeRef.current.update(state.options);
    }
  }, [state.options]);

  return (
    <div className="relative group">
      {/* Container onde a biblioteca injetará o Canvas/SVG */}
      <div 
        ref={containerRef} 
        className="bg-white p-4 rounded-xl transition-all duration-500"
      />
      
      {/* Overlay decorativo de preview */}
      <div className="absolute inset-0 border-2 border-indigo-500/0 group-hover:border-indigo-500/20 rounded-xl pointer-events-none transition-all" />
    </div>
  );
}
