import React from 'react';
import {
  History,
  Trash2,
  Globe,
  FileText,
  Mail,
  Phone,
  Wifi,
  RotateCcw,
} from 'lucide-react';
import { RecentQRItem, QRType } from '../types/qr';

interface RecentListProps {
  items: RecentQRItem[];
  onSelect: (item: RecentQRItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const TYPE_ICONS: Record<QRType, React.ReactNode> = {
  url: <Globe className="w-3.5 h-3.5 text-blue-500" />,
  text: <FileText className="w-3.5 h-3.5 text-slate-500" />,
  email: <Mail className="w-3.5 h-3.5 text-emerald-500" />,
  phone: <Phone className="w-3.5 h-3.5 text-purple-500" />,
  wifi: <Wifi className="w-3.5 h-3.5 text-amber-500" />,
};

export const RecentList: React.FC<RecentListProps> = ({
  items,
  onSelect,
  onRemove,
  onClear,
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Recent QR Codes
          </h3>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 py-3 text-center">
          No recently generated codes yet. Your saved codes will persist here automatically.
        </p>
      </div>
    );
  }

  const formatTimestamp = (ts: number): string => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(ts).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Recent QR Codes ({items.length}/10)
          </h3>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-[11px] text-red-500 hover:text-red-700 dark:hover:text-red-400 font-semibold transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center gap-3 shadow-xs"
          >
            {/* Miniature Thumbnail */}
            <div
              onClick={() => onSelect(item)}
              className="w-14 h-14 rounded-lg bg-white border border-slate-200 dark:border-slate-700 p-1 flex-shrink-0 cursor-pointer flex items-center justify-center overflow-hidden"
            >
              {item.thumbnailDataUrl ? (
                <img
                  src={item.thumbnailDataUrl}
                  alt="QR thumbnail"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                  {TYPE_ICONS[item.content.type]}
                </div>
              )}
            </div>

            {/* Content Details & One-Click Reload */}
            <div
              onClick={() => onSelect(item)}
              className="flex-1 min-w-0 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                {TYPE_ICONS[item.content.type]}
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                  {item.content.type}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  • {formatTimestamp(item.createdAt)}
                </span>
              </div>

              <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate mt-0.5">
                {item.encodedPayload}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-600"
                  style={{ backgroundColor: item.style.fgColor }}
                  title={`Color: ${item.style.fgColor}`}
                />
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold group-hover:underline flex items-center gap-0.5">
                  <RotateCcw className="w-2.5 h-2.5" />
                  Restore
                </span>
              </div>
            </div>

            {/* Remove item button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
              aria-label="Remove item"
              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-opacity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
