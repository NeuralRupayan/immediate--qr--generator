import React, { useRef } from 'react';
import {
  Palette,
  ShieldAlert,
  Sliders,
  Image as ImageIcon,
  Upload,
  X,
  Layers,
} from 'lucide-react';
import {
  QRStyle,
  StylePreset,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
} from '../types/qr';
import { PresetsGallery } from './PresetsGallery';

interface CustomizePanelProps {
  style: QRStyle;
  onChange: (style: QRStyle) => void;
}

const QUICK_COLORS = [
  '#000000',
  '#1E293B',
  '#1A73E8',
  '#0A5C36',
  '#9333EA',
  '#DC2626',
  '#D97706',
  '#0284C7',
];

const BG_QUICK_COLORS = [
  '#FFFFFF',
  '#F8FAFC',
  '#F0FDF4',
  '#EFF6FF',
  '#FAF5FF',
  '#FFF7ED',
];

export const CustomizePanel: React.FC<CustomizePanelProps> = ({
  style,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePresetSelect = (preset: StylePreset) => {
    onChange({
      ...style,
      ...preset.style,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange({
        ...style,
        // Auto-bump ECC to Q if L or M so the logo remains scannable
        errorCorrectionLevel:
          style.errorCorrectionLevel === 'L' || style.errorCorrectionLevel === 'M'
            ? 'Q'
            : style.errorCorrectionLevel,
        logo: {
          dataUrl,
          sizeRatio: 0.22,
          margin: 3,
          hideBackgroundDots: true,
        },
      });
    };
    reader.readAsDataURL(file);
    // Reset file input value
    e.target.value = '';
  };

  const removeLogo = () => {
    onChange({
      ...style,
      logo: undefined,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-6 transition-all">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          2. Customize Style & Branding
        </h2>
      </div>

      {/* Style Presets */}
      <PresetsGallery
        currentStyle={style}
        onSelectPreset={handlePresetSelect}
      />

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* Colors & Transparency */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Palette className="w-3.5 h-3.5 text-blue-500" />
          <span>Colors & Background</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Foreground Color */}
          <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Pattern Color
              </label>
              <span className="font-mono text-xs uppercase font-bold text-slate-500">
                {style.fgColor}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={style.fgColor}
                onChange={(e) => onChange({ ...style, fgColor: e.target.value })}
                className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent p-0"
              />
              <div className="flex-1 flex gap-1 flex-wrap">
                {QUICK_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onChange({ ...style, fgColor: color })}
                    style={{ backgroundColor: color }}
                    className={`w-5 h-5 rounded-md border transition-transform hover:scale-110 ${
                      style.fgColor.toLowerCase() === color.toLowerCase()
                        ? 'ring-2 ring-blue-500 ring-offset-1 border-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Background Color */}
          <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Background Color
              </label>
              <span className="font-mono text-xs uppercase font-bold text-slate-500">
                {style.transparentBg ? 'Transparent' : style.bgColor}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                disabled={style.transparentBg}
                value={style.bgColor}
                onChange={(e) => onChange({ ...style, bgColor: e.target.value })}
                className={`w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent p-0 ${
                  style.transparentBg ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              />
              <div className="flex-1 flex gap-1 flex-wrap">
                {BG_QUICK_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    disabled={style.transparentBg}
                    onClick={() => onChange({ ...style, bgColor: color })}
                    style={{ backgroundColor: color }}
                    className={`w-5 h-5 rounded-md border transition-transform hover:scale-110 ${
                      style.bgColor.toLowerCase() === color.toLowerCase() &&
                      !style.transparentBg
                        ? 'ring-2 ring-blue-500 ring-offset-1 border-slate-400'
                        : 'border-slate-300 dark:border-slate-600'
                    } ${style.transparentBg ? 'opacity-30 cursor-not-allowed' : ''}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
              <label
                htmlFor="transparent-bg"
                className="text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                Transparent Background (PNG export)
              </label>
              <input
                id="transparent-bg"
                type="checkbox"
                checked={style.transparentBg}
                onChange={(e) =>
                  onChange({ ...style, transparentBg: e.target.checked })
                }
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* Module Shapes & Eyes (Stretch Goal) */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          <span>QR Module Shapes & Corners</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Dots Type */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Data Module Pattern
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'square', label: 'Square' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'dots', label: 'Dots' },
                  { id: 'classy', label: 'Classy' },
                  { id: 'extra-rounded', label: 'Soft' },
                ] as { id: DotType; label: string }[]
              ).map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => onChange({ ...style, dotsType: type.id })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                    style.dotsType === type.id
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Corner Square Type */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Corner Eye Frame
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'square', label: 'Square' },
                  { id: 'extra-rounded', label: 'Rounded' },
                  { id: 'dot', label: 'Circle' },
                ] as { id: CornerSquareType; label: string }[]
              ).map((corner) => (
                <button
                  key={corner.id}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...style,
                      cornersSquareType: corner.id,
                      cornersDotType:
                        corner.id === 'square' ? 'square' : 'dot',
                    })
                  }
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                    style.cornersSquareType === corner.id
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {corner.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* Error Correction & Dimensions */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
          <span>Error Correction Level (ECC)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(
            [
              { level: 'L', name: 'Low (7%)', desc: 'Best for clean digital screens' },
              { level: 'M', name: 'Medium (15%)', desc: 'Recommended default standard' },
              { level: 'Q', name: 'Quartile (25%)', desc: 'Ideal for logos or prints' },
              { level: 'H', name: 'High (30%)', desc: 'Maximum damage recovery' },
            ] as { level: ErrorCorrectionLevel; name: string; desc: string }[]
          ).map((item) => (
            <button
              key={item.level}
              type="button"
              onClick={() =>
                onChange({ ...style, errorCorrectionLevel: item.level })
              }
              className={`p-2.5 rounded-xl border text-left transition-all ${
                style.errorCorrectionLevel === item.level
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  {item.level}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.name.split(' ')[1]}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* Sizing & Margins */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Sliders className="w-3.5 h-3.5 text-cyan-500" />
          <span>Dimensions & Quiet-Zone Margin</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Size */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Resolution Size
              </span>
              <span className="font-mono text-xs text-slate-500">
                {style.size}px
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={1000}
              step={20}
              value={style.size}
              onChange={(e) =>
                onChange({ ...style, size: parseInt(e.target.value, 10) })
              }
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>200px (Compact)</span>
              <span>1000px (High-Res Print)</span>
            </div>
          </div>

          {/* Margin */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Quiet-Zone Margin
              </span>
              <span className="font-mono text-xs text-slate-500">
                {style.margin} modules
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={8}
              step={1}
              value={style.margin}
              onChange={(e) =>
                onChange({ ...style, margin: parseInt(e.target.value, 10) })
              }
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0 (Edge-to-Edge)</span>
              <span>4 (Standard)</span>
              <span>8 (Wide)</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* Center Logo Embedding (Stretch Goal) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <ImageIcon className="w-3.5 h-3.5 text-pink-500" />
            <span>Center Logo / Brand Icon</span>
            <span className="text-[10px] bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 px-1.5 py-0.5 rounded-full font-medium">
              Optional
            </span>
          </div>

          {style.logo && (
            <button
              type="button"
              onClick={removeLogo}
              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 font-medium"
            >
              <X className="w-3.5 h-3.5" />
              Remove Logo
            </button>
          )}
        </div>

        {style.logo ? (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <img
              src={style.logo.dataUrl}
              alt="Center logo preview"
              className="w-12 h-12 object-contain bg-white rounded-lg p-1 border shadow-xs"
            />
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Logo Size Ratio
                </span>
                <span className="font-mono text-slate-500">
                  {(style.logo.sizeRatio * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min={0.12}
                max={0.32}
                step={0.02}
                value={style.logo.sizeRatio}
                onChange={(e) =>
                  onChange({
                    ...style,
                    logo: {
                      ...style.logo!,
                      sizeRatio: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        ) : (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-50/50 dark:bg-slate-800/30 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Logo (PNG, SVG, or WebP)
            </button>
            <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500 text-center">
              Error correction will automatically bump to Q (25%) to preserve scannability.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
