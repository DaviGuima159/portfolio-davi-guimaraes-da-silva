import React, { useState } from 'react';
import { Accordion } from '../ui/Accordion';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { ColorPickerField } from '../ui/ColorPickerField';
import { FileUploadField } from '../ui/FileUploadField';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { Layout, Palette, Image as ImageIcon, Box, Hammer, Archive, Download, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { useQR } from '../../context/QRContext';
import { VaultSection } from './VaultSection';
import { CustomTemplatesSection } from './CustomTemplatesSection';
import { QR_PRESETS } from '../../constants/presets';
import { cn } from '../../utils/cn';

export function SettingsPanel() {
  const { state, updateData, updateOptions, updateExtension, updateDownloadSize, applyPreset, fetchLogoFromUrl, resetStyling, saveAsTemplate } = useQR();
  const [activeTab, setActiveTab] = useState<'forge' | 'vault'>('forge');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [showSaveNaming, setShowSaveNaming] = useState(false);
  const [newName, setNewName] = useState('');

  const handleQuickSave = async () => {
    if (!newName.trim()) return;
    await saveAsTemplate(newName);
    setNewName('');
    setShowSaveNaming(false);
  };

  const handleAutoDiscovery = async () => {
    if (!state.data.startsWith('http')) return;
    setIsDiscovering(true);
    await fetchLogoFromUrl(state.data);
    setIsDiscovering(false);
  };

  const handleLogoUpload = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateOptions({ image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      updateOptions({ image: '' });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex p-2 bg-white/5 mx-6 mt-4 rounded-xl border border-white/5">
        <button
          onClick={() => setActiveTab('forge')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
            activeTab === 'forge' ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white"
          )}
        >
          <Hammer className="w-3 h-3" />
          Forge
        </button>
        <button
          onClick={() => setActiveTab('vault')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
            activeTab === 'vault' ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white"
          )}
        >
          <Archive className="w-3 h-3" />
          Vault
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'forge' ? (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Configurações</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-[9px] gap-1 px-2 border border-white/5 bg-white/5 hover:bg-white/10"
                onClick={resetStyling}
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Resetar Design
              </Button>
            </div>

            <section>
              <div className="flex justify-between items-end mb-2">
                <Label>Conteúdo do QR Code</Label>
                {state.data.startsWith('http') && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[9px] gap-1 px-2 border border-white/5 bg-white/5"
                    onClick={handleAutoDiscovery}
                    disabled={isDiscovering}
                  >
                    <Wand2 className={cn("w-2.5 h-2.5", isDiscovering && "animate-spin")} />
                    {isDiscovering ? 'Buscando...' : 'Auto-Branding'}
                  </Button>
                )}
              </div>
              <Input 
                value={state.data} 
                onChange={(e) => updateData(e.target.value)} 
                placeholder="https://ais.studio/build" 
              />
            </section>

            <Accordion title="Professional Templates" icon={<Sparkles className="w-4 h-4 text-amber-400" />} defaultOpen>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] text-slate-500 uppercase font-medium">Estilos Curados</span>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[9px] px-2 hover:bg-indigo-500/10 hover:text-indigo-400 border border-transparent hover:border-indigo-500/20"
                    onClick={() => setShowSaveNaming(true)}
                  >
                    Salvar Atual
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[9px] px-2 hover:bg-red-500/10 hover:text-red-400"
                    onClick={resetStyling}
                  >
                    Limpar Estilo
                  </Button>
                </div>
              </div>

              {showSaveNaming && (
                <div className="mb-4 bg-indigo-500/5 border border-indigo-500/20 p-3 rounded-xl space-y-2 animate-in fade-in zoom-in-95">
                  <Input 
                    autoFocus
                    placeholder="Nome do seu estilo..." 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-8 text-[10px]"
                    onKeyDown={(e) => e.key === 'Enter' && handleQuickSave()}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 h-7 text-[9px]" onClick={handleQuickSave}>Confirmar</Button>
                    <Button size="sm" variant="outline" className="flex-1 h-7 text-[9px]" onClick={() => setShowSaveNaming(false)}>Voltar</Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mt-2">
                {QR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.options)}
                    className={cn(
                      "p-3 rounded-xl border transition-all text-left group",
                      preset.id === 'standard' 
                        ? "border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10" 
                        : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-wider">{preset.name}</p>
                      {preset.id === 'standard' && <RefreshCw className="w-2.5 h-2.5 text-indigo-400" />}
                    </div>
                    <div className="flex gap-1 mt-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: (preset.options.dotsOptions as any)?.color }} />
                      <div className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: (preset.options.backgroundOptions as any)?.color }} />
                    </div>
                  </button>
                ))}
              </div>
            </Accordion>

            <Accordion title="Opções Principais" icon={<Layout className="w-4 h-4" />} defaultOpen>
              <div className="space-y-4 mt-2">
                <SectionHeader title="Geometria" description="Tamanho e margens do código" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Lado (px)</Label>
                    <Input 
                      type="number" 
                      value={state.options.width} 
                      onChange={(e) => updateOptions({ 
                        width: Number(e.target.value), 
                        height: Number(e.target.value) 
                      })} 
                    />
                  </div>
                  <div>
                    <Label>Margem</Label>
                    <Input 
                      type="number" 
                      value={state.options.margin} 
                      onChange={(e) => updateOptions({ margin: Number(e.target.value) })} 
                    />
                  </div>
                </div>
              </div>
            </Accordion>

            <Accordion title="Cores e Detalhes" icon={<Palette className="w-4 h-4" />}>
              <div className="space-y-4 mt-2">
                <SectionHeader title="Paleta Principal" description="Cores de fundo e dados" />
                <ColorPickerField 
                  label="Fundo" 
                  value={state.options.backgroundOptions?.color || '#FFFFFF'} 
                  onChange={(color) => updateOptions({ backgroundOptions: { color } })} 
                />
                <ColorPickerField 
                  label="Dots" 
                  value={state.options.dotsOptions?.color || '#000000'} 
                  onChange={(color) => updateOptions({ dotsOptions: { color } })} 
                />
                
                <div className="pt-2 border-t border-white/5">
                  <SectionHeader title="Cantos" description="Cores específicas para os olhos do QR" />
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <ColorPickerField 
                      label="Borda (Square)" 
                      value={state.options.cornersSquareOptions?.color || state.options.dotsOptions?.color || '#000000'} 
                      onChange={(color) => updateOptions({ cornersSquareOptions: { color } })} 
                    />
                    <ColorPickerField 
                      label="Interno (Dot)" 
                      value={state.options.cornersDotOptions?.color || state.options.dotsOptions?.color || '#000000'} 
                      onChange={(color) => updateOptions({ cornersDotOptions: { color } })} 
                    />
                  </div>
                </div>
              </div>
            </Accordion>

            <Accordion title="Estilo dos Pontos" icon={<Box className="w-4 h-4" />}>
              <div className="space-y-4 mt-2">
                <div>
                  <Label>Padrão dos Pontos</Label>
                  <Select 
                    value={state.options.dotsOptions?.type}
                    onChange={(e) => updateOptions({ dotsOptions: { type: e.target.value as any } })}
                    options={[
                      { value: 'square', label: 'Quadrado' },
                      { value: 'rounded', label: 'Arredondado' },
                      { value: 'dots', label: 'Pontos' },
                      { value: 'classy', label: 'Elegante' },
                      { value: 'classy-rounded', label: 'Elegante Arredondado' },
                      { value: 'extra-rounded', label: 'Extra Arredondado' },
                    ]} 
                  />
                </div>
                <div className="pt-2 border-t border-white/5">
                  <SectionHeader title="Olhos (Corners)" description="Estilos das âncoras de busca" />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <Label>Borda (Square)</Label>
                      <Select 
                        value={state.options.cornersSquareOptions?.type}
                        onChange={(e) => updateOptions({ cornersSquareOptions: { type: e.target.value as any } })}
                        options={[
                          { value: 'square', label: 'Quadrado' },
                          { value: 'dot', label: 'Ponto' },
                          { value: 'extra-rounded', label: 'Extra Arredondado' },
                        ]} 
                      />
                    </div>
                    <div>
                      <Label>Interno (Dot)</Label>
                      <Select 
                        value={state.options.cornersDotOptions?.type}
                        onChange={(e) => updateOptions({ cornersDotOptions: { type: e.target.value as any } })}
                        options={[
                          { value: 'square', label: 'Quadrado' },
                          { value: 'dot', label: 'Ponto' },
                        ]} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Accordion>

            <Accordion title="Logo & Marca" icon={<ImageIcon className="w-4 h-4" />}>
              <div className="space-y-4 mt-2">
                <FileUploadField 
                  label="Upload do Logo" 
                  previewUrl={state.options.image}
                  onFileChange={handleLogoUpload} 
                />
                {state.options.image && (
                  <div>
                    <Label>Tamanho do Logo ({Math.round((state.options.imageOptions?.imageSize || 0) * 100)}%)</Label>
                    <input 
                      type="range" 
                      min={0.1} 
                      max={0.5} 
                      step={0.05} 
                      value={state.options.imageOptions?.imageSize}
                      onChange={(e) => updateOptions({ imageOptions: { imageSize: Number(e.target.value) } })}
                      className="w-full accent-indigo-600 cursor-pointer" 
                    />
                  </div>
                )}
              </div>
            </Accordion>

            <Accordion title="Exportação Avançada" icon={<Download className="w-4 h-4" />}>
              <div className="space-y-4 mt-2">
                <div>
                  <Label>Formato</Label>
                  <Select 
                    value={state.extension}
                    onChange={(e) => updateExtension(e.target.value as any)}
                    options={[
                      { value: 'png', label: 'PNG (Raster)' },
                      { value: 'svg', label: 'SVG (Vector)' },
                      { value: 'jpeg', label: 'JPEG' },
                    ]} 
                  />
                </div>
                <div>
                  <Label>Resolução de Download (px)</Label>
                  <Select 
                    value={state.downloadSize}
                    onChange={(e) => updateDownloadSize(Number(e.target.value))}
                    options={[
                      { value: '500', label: '500px (Pequeno)' },
                      { value: '1000', label: '1000px (Padrão)' },
                      { value: '2000', label: '2000px (HD)' },
                      { value: '4000', label: '4000px (Ultra HD)' },
                    ]} 
                  />
                </div>
              </div>
            </Accordion>
          </div>
        ) : (
          <div className="space-y-8 pb-20 mt-6">
             <section className="px-6">
               <CustomTemplatesSection />
             </section>
             
             <div className="h-px bg-white/5 mx-6" />
             
             <section className="px-6">
               <div className="mb-2">
                 <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Favoritos</Label>
               </div>
               <VaultSection type="favorites" />
             </section>

             <div className="h-px bg-white/5 mx-6" />

             <section className="px-6">
               <div className="mb-2">
                 <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Recentes</Label>
               </div>
               <VaultSection type="history" />
             </section>
          </div>
        )}
      </div>
    </div>
  );
}
