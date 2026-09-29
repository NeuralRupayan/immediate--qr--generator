import React from 'react';
import { QrCode, Sun, Moon, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onResetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onResetAll,
}) => {
  return (
    <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                QR Code Studio
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900">
                <Sparkles className="w-3 h-3" /> GDG SRM Task 1
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden xs:block">
              Client-Side QR Code Generator & Designer
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetAll}
            title="Reset to default settings"
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
