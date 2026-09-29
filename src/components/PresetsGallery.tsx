import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { QRStyle, StylePreset } from '../types/qr';
import { STYLE_PRESETS } from '../lib/presets';

interface PresetsGalleryProps {
  currentStyle: QRStyle;
  onSelectPreset: (preset: StylePreset) => void;
}

export const PresetsGallery: React.FC<PresetsGalleryProps> = ({
  currentStyle,
  onSelectPreset,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Curated Designer Presets</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {STYLE_PRESETS.map((preset) => {
          const isSelected =
            currentStyle.fgColor.toLowerCase() ===
              (preset.style.fgColor?.toLowerCase() || '') &&
            currentStyle.dotsType === (preset.style.dotsType || 'square');

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`group text-left p-2.5 rounded-xl border text-xs transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                {/* Visual miniature swatch */}
                <div
                  className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: preset.previewBg }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-xs"
                    style={{ backgroundColor: preset.previewFg }}
                  />
                </div>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>

              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 truncate text-[12px]">
                  {preset.name}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                  {preset.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
