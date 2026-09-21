# Tax & Profit Calculator (PKR)

A mobile-first, high-precision progressive web application (PWA) designed for Pakistani businesses and contractors to calculate Sales Tax, Withholding Tax, SRB deductions, Cheque Amounts, Take-home amounts, and Net Profit/Loss.

Built using **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## 🚀 Features

- **Mobile-First Responsive Design**:
  - **Mobile (< 768px)**: Clean touch-friendly cards, sticky action bar, quick presets, collapsible tax settings, and zero horizontal scrolling.
  - **Desktop (≥ 768px)**: Side-by-side view with a full Excel-like ledger table showing all 3 invoice types simultaneously.
- **Three Supported Invoice Types**:
  1. **Sales Tax Invoice**: Standard 18% Sales Tax, 7% Withholding Tax on Gross, 20% Sales Tax Deduction.
  2. **7% Invoice**: 7% Sales Tax, 7% Withholding Tax on Gross, 20% Sales Tax Deduction.
  3. **Punjab Sales Tax Invoice**: 16% Sales Tax, 7% Withholding Tax on Gross, 20% Sales Tax Deduction.
- **Real-Time Instant Calculations**:
  - Total Invoice Amount = Selling + Sales Tax
  - Withholding Tax (WHT) = Total Invoice × WHT Rate
  - Sales Tax Deduction = Sales Tax × ST Deduction Rate
  - Cheque Amount = Total Invoice - WHT - Sales Tax Deduction
  - Take-Home Amount = Cheque Amount - SRB Payable
  - Profit / Loss = Take-Home Amount - Buying Amount
  - Profit Margin % = (Profit / Buying) × 100
- **Editable Tax Rates**: Customize Sales Tax %, Withholding Tax %, and Sales Tax Deduction % per invoice type with one-click restore to official defaults.
- **Offline & PWA Ready**: Installable to home screen / desktop, service worker caching with workbox, functions 100% offline.
- **Persistence**: All inputs and customized tax rates are persisted locally via `localStorage`.
- **Export & Share**:
  - One-click copy formatted breakdown to clipboard.
  - Native Web Share API integration for sharing breakdowns via WhatsApp, SMS, or Email.
- **Unit Tested**: Comprehensive test suite with 26 unit tests covering all formula edge cases and calculations using Vitest.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS custom design system
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- **Testing**: [Vitest](https://vitest.dev/)

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository and navigate into the folder
cd "Tax calculator"

# Install dependencies
npm install
```

### Running Locally

```bash
# Start local development server with HMR
npm run dev
```

Open your browser at `http://localhost:5173`.

### Running Tests

```bash
# Run all unit tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Production Build

```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📊 Calculation Logic & Formulas

| Metric | Formula |
|---|---|
| **Sales Tax** | `Selling × Sales Tax Rate` |
| **Total Invoice** | `Selling + Sales Tax` |
| **Withholding Tax** | `Total Invoice × WHT Rate` |
| **Sales Tax Deduction** | `Sales Tax × Sales Tax Deduction Rate` |
| **Cheque Amount** | `Total Invoice - Withholding Tax - Sales Tax Deduction` |
| **Take-Home Amount** | `Cheque Amount - SRB Payable` |
| **Profit / Loss** | `Take-Home Amount - Buying Amount` |
| **Profit Percentage** | `(Profit / Buying) × 100` |

---

## 📱 PWA Installation

- **On Android (Chrome)**: Tap the 3 dots menu -> "Add to Home screen" or tap the install prompt.
- **On iOS (Safari)**: Tap the Share button -> "Add to Home Screen".
- **On Desktop (Chrome/Edge)**: Click the Install icon in the address bar.
