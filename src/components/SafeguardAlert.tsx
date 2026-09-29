import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { ReliabilityWarning } from '../types/qr';

interface SafeguardAlertProps {
  warnings: ReliabilityWarning[];
  contrastRatio: number;
}

export const SafeguardAlert: React.FC<SafeguardAlertProps> = ({
  warnings,
  contrastRatio,
}) => {
  return (
    <div className="space-y-2.5">
      {/* Overall Scannability Status Banner */}
      <div
        className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
          warnings.some((w) => w.severity === 'error')
            ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-800 dark:text-red-300'
            : warnings.length > 0
            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300'
            : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {warnings.some((w) => w.severity === 'error') ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 dark:text-red-400" />
          ) : warnings.length > 0 ? (
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          )}
          <span className="font-semibold">
            {warnings.some((w) => w.severity === 'error')
              ? 'Scan Issue Detected'
              : warnings.length > 0
              ? 'Scan Reliability Advisory'
              : 'Optimal Scannability Verified'}
          </span>
        </div>

        <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/60 border font-medium">
          Contrast: {contrastRatio.toFixed(1)}:1
        </span>
      </div>

      {/* Specific Safeguard Warnings */}
      {warnings.map((warn) => (
        <div
          key={warn.id}
          className={`p-3 rounded-xl border text-xs space-y-1 ${
            warn.severity === 'error'
              ? 'bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-900/80 text-red-900 dark:text-red-200'
              : warn.severity === 'warning'
              ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/80 text-amber-900 dark:text-amber-200'
              : 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/80 text-blue-900 dark:text-blue-200'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold">
            {warn.severity === 'error' ? (
              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            ) : warn.severity === 'warning' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            ) : (
              <Info className="w-3.5 h-3.5 text-blue-600" />
            )}
            <span>{warn.title}</span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-90 pl-5">
            {warn.message}
          </p>
          {warn.suggestion && (
            <p className="text-[11px] font-medium opacity-95 pl-5 pt-0.5 text-blue-700 dark:text-blue-300">
              Tip: {warn.suggestion}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
