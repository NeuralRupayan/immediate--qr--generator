export type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi';

export interface WifiContent {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface EmailContent {
  email: string;
  subject?: string;
  body?: string;
}

export interface QRContent {
  type: QRType;
  url?: string;
  text?: string;
  email?: EmailContent;
  phone?: string;
  wifi?: WifiContent;
}

export type DotType = 'square' | 'dots' | 'rounded' | 'classy' | 'extra-rounded';
export type CornerSquareType = 'square' | 'dot' | 'extra-rounded';
export type CornerDotType = 'square' | 'dot';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface GradientConfig {
  enabled: boolean;
  type: 'linear' | 'radial';
  colorStops: { offset: number; color: string }[];
  rotation?: number; // degrees for linear
}

export interface QRStyle {
  size: number; // px, 150 - 1200
  fgColor: string; // hex
  bgColor: string; // hex
  transparentBg: boolean;
  errorCorrectionLevel: ErrorCorrectionLevel;
  margin: number; // quiet zone modules
  dotsType: DotType;
  cornersSquareType: CornerSquareType;
  cornersDotType: CornerDotType;
  gradient?: GradientConfig;
  logo?: {
    dataUrl: string;
    sizeRatio: number; // 0.1 to 0.35
    margin: number;
    hideBackgroundDots: boolean;
  };
}

export interface RecentQRItem {
  id: string;
  name: string;
  content: QRContent;
  style: QRStyle;
  createdAt: number;
  thumbnailDataUrl: string;
  encodedPayload: string;
}

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  previewBg: string;
  previewFg: string;
  style: Partial<QRStyle>;
}

export interface ReliabilityWarning {
  id: string;
  severity: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  suggestion?: string;
}
