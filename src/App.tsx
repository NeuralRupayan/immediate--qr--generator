import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { QRContent, QRStyle, RecentQRItem } from './types/qr';
import { encodeQRPayload } from './lib/encoding';
import { validateQRContent } from './lib/validation';
import { evaluateScanReliability, getContrastRatio } from './lib/contrast';
import {
  getRecentQRCodes,
  saveRecentQRCode,
  removeRecentQRCode,
  clearRecentQRCodes,
} from './lib/storage';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { CustomizePanel } from './components/CustomizePanel';
import { PreviewPanel } from './components/PreviewPanel';
import { RecentList } from './components/RecentList';

const DEFAULT_CONTENT: QRContent = {
  type: 'url',
  url: 'https://gdg.community.dev',
  text: '',
  email: { email: '', subject: '', body: '' },
  phone: '',
  wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false },
};

const DEFAULT_STYLE: QRStyle = {
  size: 320,
  fgColor: '#1A73E8',
  bgColor: '#FFFFFF',
  transparentBg: false,
  errorCorrectionLevel: 'Q',
  margin: 3,
  dotsType: 'rounded',
  cornersSquareType: 'extra-rounded',
  cornersDotType: 'dot',
};

export const App: React.FC = () => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('qr_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('qr_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('qr_theme', 'light');
      }
    } catch (e) {
      console.warn('Theme storage failed:', e);
    }
  }, [isDarkMode]);

  // Main QR state
  const [content, setContent] = useState<QRContent>(DEFAULT_CONTENT);
  const [style, setStyle] = useState<QRStyle>(DEFAULT_STYLE);
  const [recentCodes, setRecentCodes] = useState<RecentQRItem[]>([]);

  // Load recent codes on initial mount
  useEffect(() => {
    setRecentCodes(getRecentQRCodes());
  }, []);

  // Compute derived encoding & validations
  const encodedPayload = useMemo(() => encodeQRPayload(content), [content]);
  const validationResult = useMemo(() => validateQRContent(content), [content]);

  // Scannability heuristics & contrast calculation
  const contrastRatio = useMemo(() => {
    const effectiveBg = style.transparentBg ? '#FFFFFF' : style.bgColor;
    return getContrastRatio(style.fgColor, effectiveBg);
  }, [style.fgColor, style.bgColor, style.transparentBg]);

  const warnings = useMemo(() => {
    return evaluateScanReliability(
      style,
      encodedPayload.length,
      validationResult.isValid && Boolean(encodedPayload)
    );
  }, [style, encodedPayload, validationResult.isValid]);

  // Save to recent codes handler
  const handleSaveToHistory = useCallback(
    (thumbnailDataUrl: string) => {
      if (!validationResult.isValid || !encodedPayload) return;

      const newItem: RecentQRItem = {
        id: `qr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: `${content.type.toUpperCase()} Code`,
        content: JSON.parse(JSON.stringify(content)),
        style: JSON.parse(JSON.stringify(style)),
        createdAt: Date.now(),
        thumbnailDataUrl,
        encodedPayload,
      };

      const updated = saveRecentQRCode(newItem);
      setRecentCodes(updated);
    },
    [content, style, validationResult.isValid, encodedPayload]
  );

  // Restore previous QR Code on click
  const handleSelectRecent = (item: RecentQRItem) => {
    setContent(JSON.parse(JSON.stringify(item.content)));
    setStyle(JSON.parse(JSON.stringify(item.style)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveRecent = (id: string) => {
    const updated = removeRecentQRCode(id);
    setRecentCodes(updated);
  };

  const handleClearRecent = () => {
    if (window.confirm('Are you sure you want to clear your saved QR code history?')) {
      clearRecentQRCodes();
      setRecentCodes([]);
    }
  };

  const handleResetAll = () => {
    if (window.confirm('Reset all fields and custom styling to default?')) {
      setContent(DEFAULT_CONTENT);
      setStyle(DEFAULT_STYLE);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onResetAll={handleResetAll}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro banner */}
        <div className="text-center sm:text-left space-y-1.5 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Design, Customize & Export Scannable QR Codes
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            100% private and client-side. Supports URLs, Plain Text, Email, Phone, and Wi-Fi credentials with live scan reliability safeguards.
          </p>
        </div>

        {/* Two-column layout on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Customization (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            <InputPanel
              content={content}
              onChange={setContent}
              errors={validationResult.errors}
            />

            <CustomizePanel
              style={style}
              onChange={setStyle}
            />
          </div>

          {/* Right Column: Sticky Preview & Download (5 cols on lg) */}
          <div className="lg:col-span-5">
            <PreviewPanel
              payload={encodedPayload}
              style={style}
              isValid={validationResult.isValid}
              warnings={warnings}
              contrastRatio={contrastRatio}
              onGenerationSuccess={handleSaveToHistory}
            />
          </div>
        </div>

        {/* Bottom Section: Recent QR History */}
        <section className="pt-4">
          <RecentList
            items={recentCodes}
            onSelect={handleSelectRecent}
            onRemove={handleRemoveRecent}
            onClear={handleClearRecent}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>
          Prepared for GDG on Campus SRM Recruitments 2026–27 • Frontend Task 1 • 100% In-Browser & Private
        </p>
      </footer>
    </div>
  );
};
