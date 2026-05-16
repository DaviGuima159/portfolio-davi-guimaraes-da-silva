import { QRState } from '../types/qr';

export interface QRPreset {
  id: string;
  name: string;
  options: Partial<QRState['options']>;
}

export const QR_PRESETS: QRPreset[] = [
  {
    id: 'standard',
    name: 'Qr Forge Std',
    options: {
      dotsOptions: { color: '#FFFFFF', type: 'rounded' },
      backgroundOptions: { color: '#0A0A0B' },
      cornersSquareOptions: { color: '#FFFFFF', type: 'extra-rounded' },
      cornersDotOptions: { color: '#FFFFFF', type: 'dot' },
      image: '',
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    options: {
      dotsOptions: { color: '#00f2ff', type: 'classy' },
      backgroundOptions: { color: '#0A0A0B' },
      cornersSquareOptions: { color: '#ff007b', type: 'extra-rounded' },
      cornersDotOptions: { color: '#00f2ff', type: 'dot' },
    }
  },
  {
    id: 'minimal-glass',
    name: 'Glass Minimalism',
    options: {
      dotsOptions: { color: '#0A0A0B', type: 'dots' },
      backgroundOptions: { color: '#FFFFFF' },
      cornersSquareOptions: { color: '#0A0A0B', type: 'dot' },
      cornersDotOptions: { color: '#0A0A0B', type: 'square' },
    }
  },
  {
    id: 'golden-luxury',
    name: 'Golden Luxury',
    options: {
      dotsOptions: { 
        type: 'classy-rounded',
        color: '#D4AF37',
      },
      backgroundOptions: { color: '#0A0A0B' },
      cornersSquareOptions: { color: '#FFD700', type: 'extra-rounded' },
      cornersDotOptions: { color: '#D4AF37', type: 'dot' },
    }
  },
  {
    id: 'emerald-eco',
    name: 'Organic Emerald',
    options: {
      dotsOptions: { color: '#10b981', type: 'rounded' },
      backgroundOptions: { color: '#f0fdf4' },
      cornersSquareOptions: { color: '#064e3b', type: 'extra-rounded' },
      cornersDotOptions: { color: '#10b981', type: 'dot' },
    }
  }
];
