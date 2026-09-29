import React, { useState } from 'react';
import {
  Globe,
  FileText,
  Mail,
  Phone,
  Wifi,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { QRContent, QRType } from '../types/qr';
import { ValidationFieldErrors } from '../lib/validation';

interface InputPanelProps {
  content: QRContent;
  onChange: (content: QRContent) => void;
  errors: ValidationFieldErrors;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  content,
  onChange,
  errors,
}) => {
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  const tabs: { type: QRType; label: string; icon: React.ReactNode }[] = [
    { type: 'url', label: 'URL / Link', icon: <Globe className="w-4 h-4" /> },
    { type: 'text', label: 'Text', icon: <FileText className="w-4 h-4" /> },
    { type: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { type: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" /> },
    { type: 'wifi', label: 'Wi-Fi', icon: <Wifi className="w-4 h-4" /> },
  ];

  const handleTypeChange = (newType: QRType) => {
    // Preserve existing content structure while switching active type
    onChange({
      ...content,
      type: newType,
    });
  };

  const loadSample = () => {
    switch (content.type) {
      case 'url':
        onChange({ ...content, url: 'https://gdg.community.dev' });
        break;
      case 'text':
        onChange({
          ...content,
          text: 'Welcome to GDG on Campus SRM! 🚀 Building the future together.',
        });
        break;
      case 'email':
        onChange({
          ...content,
          email: {
            email: 'contact@gdgsrm.org',
            subject: 'SRM Recruitment 2026-27 Inquiry',
            body: 'Hello GDG Team,\n\nI would like to know more about the upcoming hackathons.',
          },
        });
        break;
      case 'phone':
        onChange({ ...content, phone: '+91 98765 43210' });
        break;
      case 'wifi':
        onChange({
          ...content,
          wifi: {
            ssid: 'Campus_Guest_5G',
            password: 'InnovateTogether2026',
            encryption: 'WPA',
            hidden: false,
          },
        });
        break;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all">
      {/* Type Selector Tabs */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          1. Content Type
        </h2>
        <button
          type="button"
          onClick={loadSample}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors py-1 px-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Sample
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl mb-6">
        {tabs.map((tab) => {
          const isActive = content.type === tab.type;
          return (
            <button
              key={tab.type}
              type="button"
              onClick={() => handleTypeChange(tab.type)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Form Content */}
      <div className="space-y-4">
        {/* URL Form */}
        {content.type === 'url' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Website / Destination URL
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="example.com or https://gdg.community.dev"
                value={content.url || ''}
                onChange={(e) => onChange({ ...content, url: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-slate-50/50 dark:bg-slate-800/50 ${
                  errors.url
                    ? 'border-red-400 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-950 text-red-900 dark:text-red-200'
                    : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-950'
                }`}
              />
            </div>
            {errors.url ? (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.url}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                Scheme will be auto-formatted to <code className="text-slate-600 dark:text-slate-300">https://</code> if omitted.
              </p>
            )}
          </div>
        )}

        {/* Plain Text Form */}
        {content.type === 'text' && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Plain Text Message
              </label>
              <span
                className={`text-[11px] font-mono ${
                  (content.text?.length || 0) > 1800
                    ? 'text-amber-500 font-semibold'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {content.text?.length || 0} / 2000 chars
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Type or paste any text, notes, coupon code, or payload..."
              value={content.text || ''}
              maxLength={2000}
              onChange={(e) => onChange({ ...content, text: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-slate-50/50 dark:bg-slate-800/50 ${
                errors.text
                  ? 'border-red-400 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-950'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-950'
              }`}
            />
            {errors.text && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.text}
              </p>
            )}
          </div>
        )}

        {/* Email Form */}
        {content.type === 'email' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Recipient Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="team@domain.com"
                value={content.email?.email || ''}
                onChange={(e) =>
                  onChange({
                    ...content,
                    email: {
                      email: e.target.value,
                      subject: content.email?.subject || '',
                      body: content.email?.body || '',
                    },
                  })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-slate-50/50 dark:bg-slate-800/50 ${
                  errors.email
                    ? 'border-red-400 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-950'
                    : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-950'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Subject Line <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="Meeting Inquiry / RSVP"
                value={content.email?.subject || ''}
                onChange={(e) =>
                  onChange({
                    ...content,
                    email: {
                      email: content.email?.email || '',
                      subject: e.target.value,
                      body: content.email?.body || '',
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950 bg-slate-50/50 dark:bg-slate-800/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Message Body <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Prefilled email content..."
                value={content.email?.body || ''}
                onChange={(e) =>
                  onChange({
                    ...content,
                    email: {
                      email: content.email?.email || '',
                      subject: content.email?.subject || '',
                      body: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950 bg-slate-50/50 dark:bg-slate-800/50"
              />
            </div>
          </div>
        )}

        {/* Phone Form */}
        {content.type === 'phone' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="+1 555-0199 or +91 9876543210"
              value={content.phone || ''}
              onChange={(e) => onChange({ ...content, phone: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-slate-50/50 dark:bg-slate-800/50 ${
                errors.phone
                  ? 'border-red-400 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-950'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-950'
              }`}
            />
            {errors.phone ? (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.phone}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                Include country code (e.g. +91 or +1) for international compatibility.
              </p>
            )}
          </div>
        )}

        {/* Wi-Fi Form */}
        {content.type === 'wifi' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Network SSID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Wi-Fi Network Name"
                value={content.wifi?.ssid || ''}
                onChange={(e) =>
                  onChange({
                    ...content,
                    wifi: {
                      ssid: e.target.value,
                      password: content.wifi?.password || '',
                      encryption: content.wifi?.encryption || 'WPA',
                      hidden: content.wifi?.hidden || false,
                    },
                  })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-slate-50/50 dark:bg-slate-800/50 ${
                  errors.ssid
                    ? 'border-red-400 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-950'
                    : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-950'
                }`}
              />
              {errors.ssid && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.ssid}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Encryption Type
                </label>
                <select
                  value={content.wifi?.encryption || 'WPA'}
                  onChange={(e) =>
                    onChange({
                      ...content,
                      wifi: {
                        ssid: content.wifi?.ssid || '',
                        password: content.wifi?.password || '',
                        encryption: e.target.value as 'WPA' | 'WEP' | 'nopass',
                        hidden: content.wifi?.hidden || false,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950 bg-slate-50/50 dark:bg-slate-800/50"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP (Legacy)</option>
                  <option value="nopass">None (Open Network)</option>
                </select>
              </div>

              {content.wifi?.encryption !== 'nopass' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showWifiPassword ? 'text' : 'password'}
                      placeholder="Network Password"
                      value={content.wifi?.password || ''}
                      onChange={(e) =>
                        onChange({
                          ...content,
                          wifi: {
                            ssid: content.wifi?.ssid || '',
                            password: e.target.value,
                            encryption: content.wifi?.encryption || 'WPA',
                            hidden: content.wifi?.hidden || false,
                          },
                        })
                      }
                      className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-slate-50/50 dark:bg-slate-800/50 ${
                        errors.password
                          ? 'border-red-400 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-950'
                          : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-950'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowWifiPassword(!showWifiPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                      aria-label={showWifiPassword ? 'Hide password' : 'Show password'}
                    >
                      {showWifiPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.password}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="hidden-wifi"
                type="checkbox"
                checked={content.wifi?.hidden || false}
                onChange={(e) =>
                  onChange({
                    ...content,
                    wifi: {
                      ssid: content.wifi?.ssid || '',
                      password: content.wifi?.password || '',
                      encryption: content.wifi?.encryption || 'WPA',
                      hidden: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="hidden-wifi"
                className="text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer"
              >
                Hidden Network (SSID is not broadcasted)
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
