import { RecentQRItem } from '../types/qr';

const STORAGE_KEY = 'qr_recent_codes';
const MAX_RECENT_ITEMS = 10;

/**
 * Safely loads recent QR items from localStorage
 */
export function getRecentQRCodes(): RecentQRItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, MAX_RECENT_ITEMS);
    }
    return [];
  } catch (err) {
    console.warn('Failed to load recent QR codes from localStorage:', err);
    return [];
  }
}

/**
 * Saves a new item to recent QR codes, keeping only the last N items (FIFO)
 */
export function saveRecentQRCode(item: RecentQRItem): RecentQRItem[] {
  try {
    const existing = getRecentQRCodes();
    // Filter out item with same payload to avoid duplicate spam
    const filtered = existing.filter(
      (i) => i.encodedPayload !== item.encodedPayload
    );
    const updated = [item, ...filtered].slice(0, MAX_RECENT_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save QR code to localStorage:', err);
    return getRecentQRCodes();
  }
}

/**
 * Removes a specific item by ID
 */
export function removeRecentQRCode(id: string): RecentQRItem[] {
  try {
    const existing = getRecentQRCodes();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to remove QR code from localStorage:', err);
    return getRecentQRCodes();
  }
}

/**
 * Clears all recent QR codes
 */
export function clearRecentQRCodes(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear recent QR codes:', err);
  }
}
