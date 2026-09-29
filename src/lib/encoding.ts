import { QRContent } from '../types/qr';

/**
 * Escapes special characters for Wi-Fi QR code strings
 * Special chars per ZXing spec: \, ;, ,, :
 */
function escapeWifi(str: string): string {
  return str.replace(/([\\;,:"'])/g, '\\$1');
}

/**
 * Formats a given URL ensuring it has a valid protocol
 */
export function formatUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Encodes QRContent into standard QR payload string per TRD 2.4
 */
export function encodeQRPayload(content: QRContent): string {
  switch (content.type) {
    case 'url': {
      if (!content.url || !content.url.trim()) return '';
      return formatUrl(content.url);
    }

    case 'text': {
      return content.text || '';
    }

    case 'email': {
      if (!content.email || !content.email.email) return '';
      const { email, subject, body } = content.email;
      const params = new URLSearchParams();
      if (subject) params.append('subject', subject);
      if (body) params.append('body', body);
      const query = params.toString();
      return `mailto:${email.trim()}${query ? `?${query}` : ''}`;
    }

    case 'phone': {
      if (!content.phone) return '';
      // Strip spaces/parentheses for raw tel URI while retaining + and digits
      const sanitized = content.phone.trim();
      return `tel:${sanitized}`;
    }

    case 'wifi': {
      if (!content.wifi || !content.wifi.ssid) return '';
      const { ssid, password, encryption, hidden } = content.wifi;
      const enc = encryption === 'nopass' ? 'nopass' : encryption;
      const pwd = enc === 'nopass' ? '' : escapeWifi(password || '');
      const isHidden = hidden ? 'true' : 'false';
      return `WIFI:T:${enc};S:${escapeWifi(ssid)};P:${pwd};H:${isHidden};;`;
    }

    default:
      return '';
  }
}
