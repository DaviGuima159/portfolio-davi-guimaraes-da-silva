import { Options } from 'qr-code-styling';

export type QRStyleOptions = Options;

export interface QRUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface QRHistoryItem {
  id: string;
  timestamp: number;
  data: string;
  options: QRStyleOptions;
  isFavorite?: boolean;
}

export interface QRTemplate {
  id: string;
  name: string;
  options: QRStyleOptions;
  timestamp: number;
}

export interface QRState {
  data: string;
  extension: 'png' | 'svg' | 'jpeg';
  downloadSize: number;
  options: QRStyleOptions;
  history: QRHistoryItem[];
  customTemplates: QRTemplate[];
  user: QRUser | null;
}

export const INITIAL_QR_STATE: QRState = {
  data: 'https://ais.studio/build',
  extension: 'png',
  downloadSize: 1000,
  history: [],
  customTemplates: [],
  user: null,
  options: {
    width: 300,
    height: 300,
    margin: 20,
    type: 'canvas',
    data: 'https://ais.studio/build',
    image: '',
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'Q'
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 5
    },
    dotsOptions: {
      color: '#FFFFFF',
      type: 'rounded'
    },
    backgroundOptions: {
      color: '#0A0A0B'
    },
    cornersSquareOptions: {
      color: '#FFFFFF',
      type: 'extra-rounded'
    },
    cornersDotOptions: {
      color: '#FFFFFF',
      type: 'dot'
    }
  }
};
