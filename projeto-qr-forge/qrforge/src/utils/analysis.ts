export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrast(rgb1: {r: number, g: number, b: number}, rgb2: {r: number, g: number, b: number}) {
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export interface AnalysisResult {
  score: number; // 0 to 100
  status: 'excellent' | 'good' | 'warning' | 'critical';
  suggestions: string[];
}

export function analyzeQR(options: any): AnalysisResult {
  const suggestions: string[] = [];
  let score = 100;

  const dotColor = options.dotsOptions?.color || '#000000';
  const bgColor = options.backgroundOptions?.color || '#FFFFFF';

  const rgbDot = hexToRgb(dotColor);
  const rgbBg = hexToRgb(bgColor);

  if (rgbDot && rgbBg) {
    const contrast = getContrast(rgbDot, rgbBg);
    if (contrast < 3) {
      score -= 40;
      suggestions.push('Aumente o contraste entre os pontos e o fundo.');
    } else if (contrast < 4.5) {
      score -= 15;
      suggestions.push('O contraste está bom, mas poderia ser melhor para ambientes escuros.');
    }
  }

  if (options.dotsOptions?.type === 'dots') {
    score -= 10;
    suggestions.push('Pontos circulares podem ser mais difíceis de escanear em resoluções baixas.');
  }

  if (options.image) {
    score -= 5;
    suggestions.push('Logos grandes podem cobrir dados críticos. Verifique o tamanho.');
  }

  let status: AnalysisResult['status'] = 'excellent';
  if (score < 50) status = 'critical';
  else if (score < 75) status = 'warning';
  else if (score < 90) status = 'good';

  return { score, status, suggestions };
}
