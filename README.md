# ⚡ QR Code Studio — Generator & Designer

> **GDG on Campus SRM Recruitments 2026–27 — Technical Domain (Frontend Task 1)**  
> A high-performance, 100% client-side web application to create, customize, preview, verify, and download scannable QR codes with real-time feedback and local history.

![GDG Task 1 Banner](https://img.shields.io/badge/GDG%20on%20Campus%20SRM-Frontend%20Task%201-4285F4?style=for-the-badge&logo=google)
![React](https://img.shields.io/badge/React%2018-Vite-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss)
![Tests](https://img.shields.io/badge/Tests-20%20Passed-10B981?style=for-the-badge&logo=vitest)

---

## 🚀 Live Demo & Quick Links

- **Local Preview Server**: `http://localhost:4173/` (or `http://localhost:5173/` during dev)
- **Deployment Platform**: Deployable directly on **Vercel** or **Netlify** with zero backend or environment variables required.

---

## 🌟 Key Features

### 1. Multi-Content QR Generation (Sub-10s Workflow)
- **Website URLs**: Automatic `https://` protocol normalization, valid domain validation.
- **Plain Text**: Character counter with 2,000-character safety guard to avoid unscannable density.
- **Email (`mailto:`)**: Email format validation, prefilled subject line, and body message.
- **Phone Numbers (`tel:`)**: E.164-compliant formatting with international dial codes.
- **Wi-Fi Credentials (`WIFI:...`)**: SSID, masked/unmasked password toggle, encryption types (`WPA/WPA2/WPA3`, `WEP`, `nopass`), and hidden network flag.
- **Quick Sample Buttons**: 1-click test button to populate each format with realistic dummy data.

### 2. Real-Time Visual Customization
- **Parity Guarantee**: Single-canvas rendering engine ensuring downloaded output is pixel-identical to what is shown on screen.
- **Colors & Transparency**: Foreground color picker, background color picker, preset palettes, and 1-click transparent background toggle for PNG export.
- **QR Module Shapes**: Square, Rounded, Dots, Classy, and Extra-Rounded modules.
- **Corner Eye Styling**: Square, Rounded, and Circular corner eyes.
- **Error Correction Levels (ECC)**: Full control over L (7%), M (15%), Q (25%), and H (30%) with visual guide.
- **Quiet-Zone & Resolution**: Customizable margin (0 to 8 modules) and export size (200px to 1000px).
- **Logo & Brand Embedding**: Custom logo upload (PNG, SVG, WebP) with size ratio controls and automatic ECC safety elevation.

### 3. Scan-Reliability Safeguards (TRD 2.7)
- **WCAG Contrast Ratio Engine**: Real-time luminance ratio computation (`(L1 + 0.05) / (L2 + 0.05)`). Warns if ratio falls below `3.0:1` or `2.5:1`.
- **Polarity Inversion Warning**: Detects light QR code on dark background and flags potential barcode scanner incompatibility.
- **Dimension & ECC Heuristics**: Flags combinations of small sizes (<150px) with low error correction (Level L).
- **Data Density Safeguard**: Alerts when payload exceeds 300+ characters with low ECC.
- **Logo Area Protection**: Warns if an embedded logo covers >20% of module area without ECC $\ge$ Q.

### 4. Curated Designer Presets
- **Classic Crisp**: High-contrast monochrome, universal legacy compatibility.
- **GDG Tech Blue**: Google Developer Groups blue with rounded corner elements.
- **Emerald Botanic**: Deep forest emerald on crisp ivory with classy modules.
- **Sunset Ruby**: Crimson red with warm accents and soft dot modules.
- **Cyberpunk Violet**: High-tech indigo and violet with maximum error correction (Level H).
- **Nordic Slate**: Matte slate on soft paper background for minimalists.
- *Preserves active user content when switching presets!*

### 5. Local Storage History & 1-Click Reuse (TRD 2.8)
- Automatically stores the last 10 generated codes in browser `localStorage` (`qr_recent_codes`).
- Compact base64 thumbnails for instantaneous loading.
- **1-Click Restore**: Clicking any history card immediately loads both content and custom styling back into the editor.
- Individual item removal and complete history purge controls.
- Hardened with `try / catch` against private browsing and quota limits.

### 6. Export Pipeline & Accessibility
- **PNG Download**: Crisp raster output at exact chosen dimensions (up to 1000px).
- **SVG Download**: High-fidelity vector export for infinite scaling in print or Figma.
- **Copy to Clipboard**: Copies PNG image blob directly to system clipboard.
- **Responsive Layout**: Desktop 2-column view with sticky preview; single-column stacked view on mobile ($\ge 360$px). Min 44px touch targets.
- **Dark / Light Mode**: System-aware with manual toggle and smooth transitions.

---

## 🛠️ Architecture & Tech Stack

```
qr-code-generator/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # App navbar, theme switch, reset action
│   │   ├── InputPanel.tsx       # Dynamic type selector & validated form fields
│   │   ├── CustomizePanel.tsx   # Colors, shapes, ECC, margins, logo upload
│   │   ├── PreviewPanel.tsx     # Canvas rendering, PNG/SVG export, clipboard
│   │   ├── PresetsGallery.tsx   # Pre-configured style cards
│   │   ├── RecentList.tsx       # Local history cards with 1-click restore
│   │   └── SafeguardAlert.tsx   # Contrast & scannability warning banners
│   ├── lib/
│   │   ├── encoding.ts          # Standards-compliant payload encoders (URL, WIFI, etc.)
│   │   ├── validation.ts        # Input validation logic (RFC regex, Wi-Fi checks)
│   │   ├── contrast.ts          # WCAG relative luminance & safeguard heuristics
│   │   ├── presets.ts           # Curated designer style presets
│   │   └── storage.ts           # Safe localStorage wrapper with FIFO cap
│   ├── types/
│   │   └── qr.ts                # TypeScript data contracts & type definitions
│   ├── App.tsx                  # Main state coordinator & responsive grid
│   ├── main.tsx                 # React entry point
│   └── index.css                # Tailwind base, utilities & checkerboard pattern
├── tests/
│   └── verify.ts                # 20 automated unit & edge-case test specs
├── index.html                   # HTML template with typography setup
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## ⚡ Getting Started Locally

### Prerequisites
- Node.js (v18 or v20+)
- npm (v9+)

### Installation
```bash
# Navigate to the project directory
cd qr-code-generator

# Install dependencies
npm install

# Start local development server
npm run dev
```
Open your browser at `http://localhost:5173`.

### Automated Verification Tests
Run the comprehensive 20-test automated suite verifying all encoding, validation, contrast heuristics, and safeguards:
```bash
npm test
```

### Production Build & Preview
```bash
# Build optimized static assets
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deployment Instructions

### Deploy to Vercel
1. Push this repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new) and import your repository.
3. Keep default settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

### Deploy to Netlify
1. Connect your repository on [Netlify](https://app.netlify.com/start).
2. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Click **Deploy site**.

---

## 📋 PRD & TRD Requirement Compliance Matrix

| Requirement | Specification | Status | Implementation Details |
|---|---|:---:|---|
| **Sub-10s Generation** | Fast, reactive creation | ✅ Complete | Debounced ~180ms live rendering as user types |
| **5 Content Types** | URL, Text, Email, Phone, Wi-Fi | ✅ Complete | Dynamic form switching with auto-formatting |
| **Inline Validation** | Clear, human-readable error messages | ✅ Complete | Validated via `validateQRContent()` |
| **Customization** | Size, FG/BG color, ECC, margin | ✅ Complete | Interactive color pickers, sliders, ECC tiles |
| **Presets Gallery** | At least 4–5 presets | ✅ Complete | 6 curated designer presets with 1-click apply |
| **Download Pipeline** | Exact preview-to-export parity | ✅ Complete | Direct canvas blob export (PNG & SVG) |
| **Safeguard Engine** | Low contrast, small size + low ECC | ✅ Complete | Real-time WCAG luminance & ratio checking |
| **Recent History** | Persist last 10 in localStorage | ✅ Complete | Base64 thumbnails, FIFO eviction, 1-click reuse |
| **Mobile Responsiveness**| Usable $\ge 360$px | ✅ Complete | Stacked mobile view, 44px touch targets |
| **Zero Backend** | 100% Client-Side | ✅ Complete | No server or cloud database required |
| **Stretch Goals** | SVG, logos, module patterns, clipboard | ✅ Complete | Vector export, logo embedding, dot patterns, copy |

---

## 👨‍💻 Submission Details
- **Event**: GDG on Campus SRM Recruitments 2026–27
- **Domain**: Technical Domain
- **Task**: Frontend Task 1 (QR Code Generator & Designer)
- **Author**: Candidate Submission
