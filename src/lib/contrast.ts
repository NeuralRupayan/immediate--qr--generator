import { QRStyle, ReliabilityWarning } from '../types/qr';

/**
 * Parses hex color string into RGB numbers [r, g, b] in range 0..255
 */
export function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Calculates WCAG sRGB relative luminance
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates contrast ratio between two hex colors (1:1 to 21:1)
 */
export function getContrastRatio(fgHex: string, bgHex: string): number {
  const [r1, g1, b1] = hexToRgb(fgHex);
  const [r2, g2, b2] = hexToRgb(bgHex);
  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Evaluates scan-reliability safeguards per TRD 2.7
 */
export function evaluateScanReliability(
  style: QRStyle,
  payloadLength: number,
  hasContent: boolean
): ReliabilityWarning[] {
  if (!hasContent) return [];
  const warnings: ReliabilityWarning[] = [];

  // 1. Contrast ratio check (TRD 2.7)
  const effectiveBg = style.transparentBg ? '#FFFFFF' : style.bgColor;
  const contrast = getContrastRatio(style.fgColor, effectiveBg);

  if (contrast < 2.5) {
    warnings.push({
      id: 'crit-contrast',
      severity: 'error',
      title: 'Critically Low Contrast',
      message: `Contrast ratio is ${contrast.toFixed(1)}:1 (minimum recommended is 3.0:1). Camera scanners will fail to read this code.`,
      suggestion: 'Darken foreground or lighten background color.',
    });
  } else if (contrast < 3.5) {
    warnings.push({
      id: 'warn-contrast',
      severity: 'warning',
      title: 'Suboptimal Contrast',
      message: `Contrast ratio is ${contrast.toFixed(1)}:1. May scan poorly in dim environments or older mobile cameras.`,
      suggestion: 'Increase color contrast between foreground and background.',
    });
  }

  // 2. Inverted QR Check (Light FG on Dark BG)
  const [fgR, fgG, fgB] = hexToRgb(style.fgColor);
  const [bgR, bgG, bgB] = hexToRgb(effectiveBg);
  const fgLum = getLuminance(fgR, fgG, fgB);
  const bgLum = getLuminance(bgR, bgG, bgB);
  if (fgLum > bgLum) {
    warnings.push({
      id: 'warn-inverted',
      severity: 'warning',
      title: 'Inverted Color Polarity',
      message: 'Foreground is lighter than background. Some legacy barcode scanners cannot read inverted QR codes.',
      suggestion: 'Use a darker foreground color on a lighter background for maximum compatibility.',
    });
  }

  // 3. Small size + Low ECC Check (TRD 2.7)
  if (style.size < 180 && style.errorCorrectionLevel === 'L') {
    warnings.push({
      id: 'warn-small-ecc',
      severity: 'warning',
      title: 'Low Error Correction for Small Size',
      message: 'Small output dimensions with Level L (7%) error correction risk data loss when printed or scaled.',
      suggestion: 'Increase Error Correction to M (15%) or Q (25%).',
    });
  }

  // 4. Heavy payload text density check
  if (payloadLength > 400 && (style.errorCorrectionLevel === 'L' || style.errorCorrectionLevel === 'M')) {
    warnings.push({
      id: 'warn-dense-payload',
      severity: 'info',
      title: 'Dense Data Grid',
      message: `Payload is relatively large (${payloadLength} chars). Modules will be compact.`,
      suggestion: 'Set Error Correction to Q or H to prevent scanning read errors.',
    });
  }

  // 5. Logo overlay check (TRD 2.7)
  if (style.logo?.dataUrl) {
    const ratio = style.logo.sizeRatio;
    if (ratio > 0.25 && (style.errorCorrectionLevel === 'L' || style.errorCorrectionLevel === 'M')) {
      warnings.push({
        id: 'warn-logo-ecc',
        severity: 'error',
        title: 'Logo Risk: Low Error Correction',
        message: `Center logo covers ${(ratio * 100).toFixed(0)}% of the QR area. Level ${style.errorCorrectionLevel} error correction cannot reliably restore obscured modules.`,
        suggestion: 'Switch Error Correction Level to Q (25%) or H (30%) to guarantee readability.',
      });
    }
  }

  return warnings;
}
