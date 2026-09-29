import { encodeQRPayload, formatUrl } from '../src/lib/encoding';
import { validateQRContent } from '../src/lib/validation';
import { getContrastRatio, evaluateScanReliability } from '../src/lib/contrast';
import { QRStyle } from '../src/types/qr';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log('=== QR Code Studio: Automated Verification Suite ===\n');

// 1. URL Tests
console.log('--- 1. URL Encoding & Validation ---');
assert(formatUrl('example.com') === 'https://example.com', 'URL auto-prepends https://');
assert(formatUrl('http://my-site.org') === 'http://my-site.org', 'URL preserves http://');
assert(
  encodeQRPayload({ type: 'url', url: 'github.com/gdg-srm' }) ===
    'https://github.com/gdg-srm',
  'Payload encodes formatted URL'
);

const validUrl = validateQRContent({ type: 'url', url: 'srmist.edu.in' });
assert(validUrl.isValid && !validUrl.errors.url, 'Valid domain passes validation');

const invalidUrl = validateQRContent({ type: 'url', url: 'not_a_valid_url' });
assert(!invalidUrl.isValid && Boolean(invalidUrl.errors.url), 'Invalid URL fails validation');

// 2. Plain Text Tests
console.log('\n--- 2. Plain Text Encoding & Validation ---');
assert(
  encodeQRPayload({ type: 'text', text: 'Hello 🌟 SRM!' }) === 'Hello 🌟 SRM!',
  'Plain text preserves UTF-8 & emojis'
);
const emptyText = validateQRContent({ type: 'text', text: '   ' });
assert(!emptyText.isValid && Boolean(emptyText.errors.text), 'Empty text fails validation');

// 3. Email Tests
console.log('\n--- 3. Email Encoding & Validation ---');
const emailPayload = encodeQRPayload({
  type: 'email',
  email: {
    email: 'gdg@srmist.edu.in',
    subject: 'Recruitment 2026',
    body: 'Interested in frontend task',
  },
});
assert(
  emailPayload ===
    'mailto:gdg@srmist.edu.in?subject=Recruitment+2026&body=Interested+in+frontend+task',
  'Email payload correctly encodes mailto with query params'
);

const invalidEmail = validateQRContent({
  type: 'email',
  email: { email: 'bad-email' },
});
assert(!invalidEmail.isValid && Boolean(invalidEmail.errors.email), 'Malformed email fails');

// 4. Phone Tests
console.log('\n--- 4. Phone Number Encoding & Validation ---');
const phonePayload = encodeQRPayload({ type: 'phone', phone: '+91 9876543210' });
assert(phonePayload === 'tel:+91 9876543210', 'Phone payload encodes tel: URI');

const invalidPhone = validateQRContent({ type: 'phone', phone: '12' });
assert(!invalidPhone.isValid && Boolean(invalidPhone.errors.phone), 'Short phone fails validation');

// 5. Wi-Fi Tests
console.log('\n--- 5. Wi-Fi Encoding & Validation ---');
const wifiWpa = encodeQRPayload({
  type: 'wifi',
  wifi: {
    ssid: 'Campus;Net',
    password: 'Pass;word123',
    encryption: 'WPA',
    hidden: true,
  },
});
assert(
  wifiWpa === 'WIFI:T:WPA;S:Campus\\;Net;P:Pass\\;word123;H:true;;',
  'Wi-Fi escapes semicolons and sets hidden flag'
);

const wifiOpen = encodeQRPayload({
  type: 'wifi',
  wifi: {
    ssid: 'OpenNet',
    password: '',
    encryption: 'nopass',
    hidden: false,
  },
});
assert(
  wifiOpen === 'WIFI:T:nopass;S:OpenNet;P:;H:false;;',
  'Open Wi-Fi allows empty password'
);

const wifiShortPass = validateQRContent({
  type: 'wifi',
  wifi: { ssid: 'Net', password: '123', encryption: 'WPA', hidden: false },
});
assert(
  !wifiShortPass.isValid && Boolean(wifiShortPass.errors.password),
  'WPA password < 8 chars fails'
);

// 6. Contrast & Scan-Reliability Tests
console.log('\n--- 6. Contrast Heuristics & Scan Safeguards ---');
const blackWhiteContrast = getContrastRatio('#000000', '#FFFFFF');
assert(blackWhiteContrast > 20, `Black & white contrast is ~21:1 (got ${blackWhiteContrast.toFixed(1)})`);

const lowContrast = getContrastRatio('#777777', '#888888');
assert(lowContrast < 2.0, `Low contrast pair triggers < 2.0 (got ${lowContrast.toFixed(1)})`);

const baseStyle: QRStyle = {
  size: 300,
  fgColor: '#000000',
  bgColor: '#FFFFFF',
  transparentBg: false,
  errorCorrectionLevel: 'M',
  margin: 4,
  dotsType: 'square',
  cornersSquareType: 'square',
  cornersDotType: 'square',
};

const optimalWarnings = evaluateScanReliability(baseStyle, 50, true);
assert(optimalWarnings.length === 0, 'Optimal settings yield 0 warnings');

const lowContrastWarnings = evaluateScanReliability(
  { ...baseStyle, fgColor: '#777777', bgColor: '#888888' },
  50,
  true
);
assert(
  lowContrastWarnings.some((w) => w.id === 'crit-contrast'),
  'Low contrast correctly triggers critical error warning'
);

const invertedWarnings = evaluateScanReliability(
  { ...baseStyle, fgColor: '#FFFFFF', bgColor: '#000000' },
  50,
  true
);
assert(
  invertedWarnings.some((w) => w.id === 'warn-inverted'),
  'Inverted colors (light on dark) trigger warning'
);

const smallSizeEccLWarnings = evaluateScanReliability(
  { ...baseStyle, size: 140, errorCorrectionLevel: 'L' },
  50,
  true
);
assert(
  smallSizeEccLWarnings.some((w) => w.id === 'warn-small-ecc'),
  'Size < 150 with ECC L triggers warning per TRD 2.7'
);

console.log(`\nVerification Summary: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
