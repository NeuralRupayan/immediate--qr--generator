import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import {
  Download,
  Copy,
  Check,
  FileCode,
  QrCode,
  AlertCircle,
} from 'lucide-react';
import { QRStyle, ReliabilityWarning } from '../types/qr';
import { SafeguardAlert } from './SafeguardAlert';

interface PreviewPanelProps {
  payload: string;
  style: QRStyle;
  isValid: boolean;
  warnings: ReliabilityWarning[];
  contrastRatio: number;
  onGenerationSuccess?: (thumbnailDataUrl: string) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  payload,
  style,
  isValid,
  warnings,
  contrastRatio,
  onGenerationSuccess,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const onGenerationSuccessRef = useRef(onGenerationSuccess);
  onGenerationSuccessRef.current = onGenerationSuccess;

  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Initialize or update QR Code with debounce
  useEffect(() => {
    if (!payload || !isValid) {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      return;
    }

    const timer = setTimeout(() => {
      if (!containerRef.current) return;

      try {
        setRenderError(null);

        const options = {
          width: style.size,
          height: style.size,
          type: 'canvas' as const,
          data: payload,
          image: style.logo?.dataUrl || undefined,
          margin: style.margin * 4, // scale margin to px
          qrOptions: {
            errorCorrectionLevel: style.errorCorrectionLevel,
          },
          imageOptions: {
            hideBackgroundDots: style.logo?.hideBackgroundDots ?? true,
            imageSize: style.logo?.sizeRatio ?? 0.22,
            margin: style.logo?.margin ?? 3,
            crossOrigin: 'anonymous',
          },
          dotsOptions: {
            color: style.fgColor,
            type: style.dotsType,
          },
          backgroundOptions: {
            color: style.transparentBg ? 'transparent' : style.bgColor,
          },
          cornersSquareOptions: {
            color: style.fgColor,
            type: style.cornersSquareType,
          },
          cornersDotOptions: {
            color: style.fgColor,
            type: style.cornersDotType,
          },
        };

        // Always freshly create and append into the active container
        containerRef.current.innerHTML = '';
        const qrCode = new QRCodeStyling(options);
        qrCode.append(containerRef.current);
        qrCodeRef.current = qrCode;

        // Generate small thumbnail for local storage history after canvas draws
        setTimeout(() => {
          if (containerRef.current) {
            const canvas = containerRef.current.querySelector('canvas');
            if (canvas && onGenerationSuccessRef.current) {
              try {
                // Create miniature 90x90 canvas for storage efficiency
                const thumbCanvas = document.createElement('canvas');
                thumbCanvas.width = 90;
                thumbCanvas.height = 90;
                const ctx = thumbCanvas.getContext('2d');
                if (ctx) {
                  ctx.drawImage(canvas, 0, 0, 90, 90);
                  const thumbData = thumbCanvas.toDataURL('image/png', 0.85);
                  onGenerationSuccessRef.current(thumbData);
                }
              } catch (e) {
                console.warn('Thumbnail generation skipped:', e);
              }
            }
          }
        }, 350);
      } catch (err: unknown) {
        console.error('QR Render Error:', err);
        setRenderError(
          err instanceof Error
            ? err.message
            : 'Failed to generate QR code with current parameters.'
        );
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [payload, style, isValid]);

  const handleDownload = async (format: 'png' | 'svg') => {
    if (!qrCodeRef.current || !payload || !isValid) return;
    try {
      setIsDownloading(true);
      const filename = `qrcode-${Date.now()}`;
      await qrCodeRef.current.download({
        name: filename,
        extension: format,
      });
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download QR code image.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!containerRef.current || !payload || !isValid) return;
    const canvas = containerRef.current.querySelector('canvas');
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2500);
        } catch {
          // Fallback: Copy raw payload string to clipboard
          await navigator.clipboard.writeText(payload);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2500);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Clipboard copy error:', err);
    }
  };

  const hasContent = Boolean(payload && isValid);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5 sticky top-6 transition-all">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Live Preview
          </h2>
        </div>
        {hasContent && (
          <span className="text-[11px] font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
            {style.size}×{style.size}px
          </span>
        )}
      </div>

      {/* QR Canvas Display Container */}
      <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 min-h-[340px] overflow-hidden">
        {hasContent ? (
          <div className="flex flex-col items-center">
            {/* Transparent background preview grid */}
            <div
              className={`p-3 rounded-xl shadow-md transition-transform duration-200 ${
                style.transparentBg ? 'bg-checkerboard' : ''
              }`}
              style={{
                backgroundColor: style.transparentBg ? undefined : style.bgColor,
              }}
            >
              <div
                ref={containerRef}
                className="w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] flex items-center justify-center [&>canvas]:w-full [&>canvas]:h-full [&>canvas]:object-contain [&>svg]:w-full [&>svg]:h-full"
              />
            </div>
            <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Real-time vector render • Scan with phone camera
            </p>
          </div>
        ) : (
          <div className="text-center py-10 px-4 space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-200/70 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 dark:text-slate-500">
              <QrCode className="w-7 h-7" />
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Your QR code will appear here
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
              Choose a content type on the left and enter your details to generate an instant scannable code.
            </p>
          </div>
        )}

        {renderError && (
          <div className="absolute inset-x-4 bottom-4 p-3 rounded-xl bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{renderError}</span>
          </div>
        )}
      </div>

      {/* Export & Action Buttons */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* PNG Export */}
          <button
            type="button"
            disabled={!hasContent || isDownloading}
            onClick={() => handleDownload('png')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>

          {/* SVG Vector Export (Stretch Goal) */}
          <button
            type="button"
            disabled={!hasContent || isDownloading}
            onClick={() => handleDownload('svg')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-indigo-500" />
            <span>Export SVG</span>
          </button>
        </div>

        {/* Copy to Clipboard (Stretch Goal) */}
        <button
          type="button"
          disabled={!hasContent}
          onClick={handleCopyToClipboard}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
              <span className="text-emerald-600 dark:text-emerald-400">
                Copied Image to Clipboard!
              </span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-400" />
              <span>Copy Image to Clipboard</span>
            </>
          )}
        </button>
      </div>

      {/* Scan Reliability Safeguards */}
      {hasContent && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <SafeguardAlert
            warnings={warnings}
            contrastRatio={contrastRatio}
          />
        </div>
      )}
    </div>
  );
};
