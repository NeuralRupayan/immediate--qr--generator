import { QRContent } from '../types/qr';
import { formatUrl } from './encoding';

export interface ValidationFieldErrors {
  [field: string]: string | undefined;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationFieldErrors;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{6,20}$/;

export function validateQRContent(content: QRContent): ValidationResult {
  const errors: ValidationFieldErrors = {};

  switch (content.type) {
    case 'url': {
      const raw = content.url?.trim() || '';
      if (!raw) {
        errors.url = 'Please enter a URL (e.g. https://example.com)';
      } else {
        try {
          const formatted = formatUrl(raw);
          const parsed = new URL(formatted);
          if (!parsed.hostname || !parsed.hostname.includes('.')) {
            errors.url = 'Please enter a valid domain (e.g. example.com)';
          }
        } catch {
          errors.url = 'Invalid URL format';
        }
      }
      break;
    }

    case 'text': {
      const text = content.text?.trim() || '';
      if (!text) {
        errors.text = 'Plain text content cannot be empty';
      } else if (text.length > 2000) {
        errors.text = `Text is too long (${text.length}/2000 chars). Excessive length degrades scannability.`;
      }
      break;
    }

    case 'email': {
      const email = content.email?.email?.trim() || '';
      if (!email) {
        errors.email = 'Email address is required';
      } else if (!EMAIL_REGEX.test(email)) {
        errors.email = 'Please enter a valid email address (e.g. user@domain.com)';
      }
      break;
    }

    case 'phone': {
      const phone = content.phone?.trim() || '';
      if (!phone) {
        errors.phone = 'Phone number is required';
      } else if (!PHONE_REGEX.test(phone)) {
        errors.phone = 'Please enter a valid phone number (e.g. +1 555-123-4567)';
      }
      break;
    }

    case 'wifi': {
      const wifi = content.wifi;
      if (!wifi || !wifi.ssid.trim()) {
        errors.ssid = 'Network name (SSID) is required';
      }
      if (wifi && wifi.encryption !== 'nopass') {
        const pwd = wifi.password || '';
        if (!pwd) {
          errors.password = 'Password is required for encrypted networks';
        } else if (wifi.encryption === 'WPA' && pwd.length < 8) {
          errors.password = 'WPA/WPA2/WPA3 passwords must be at least 8 characters';
        }
      }
      break;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
