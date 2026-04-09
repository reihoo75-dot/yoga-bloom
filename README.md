# 🌸 Yoga Bloom

> 你的每日回歸自我的瑜伽旅程

A production-ready Progressive Web App (PWA) for mindful yoga tracking. Not a data logger — a daily return-to-self experience.

---

## ✨ Features

- **6 Companion Avatars** — each with unique personality and emotional tone
- **Quick Log** — tap-based, fast, intuitive practice recording
- **Growth System** — XP, stages (種子→光亮), badges, resources
- **Insights Engine** — rule-based pattern recognition with human-language feedback
- **Timeline** — memory-card style log history with filters
- **Avatar Garden** — track your growth journey visually
- **PWA** — installable, offline-capable
- **No backend** — fully local (IndexedDB + localStorage)

---

## 🚀 Run Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open: http://localhost:5173

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| UI | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| State | Zustand |
| Database | Dexie (IndexedDB) |
| Charts | Recharts |
| Animation | Framer Motion |
| PWA | vite-plugin-pwa |

---

## 🌐 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo at vercel.com — it auto-detects Vite.

**vercel.json** (optional, for SPA routing):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Shared UI (Button, Card, TagButton, etc.)
│   └── avatar/       # Avatar SVG + display components
├── pages/            # All 7 pages + completion screen
├── store/            # Zustand stores (app + logs)
├── db/               # Dexie IndexedDB layer
├── data/             # Avatars, messages, options data
├── utils/            # XP calc, insights engine, date helpers
└── types/            # TypeScript types
```

---

## 🎨 Design System

- **Background**: Cream `#FBF7F0`
- **Primary**: Sage green `#8FAF8F`
- **Accent**: Soft blush `#EDB0B8`
- **Warm**: Beige `#D4B896`
- **Font**: Noto Serif TC (Traditional Chinese)

---

## 📲 PWA Installation

On mobile: tap "Add to Home Screen" from your browser menu.
On desktop: click the install icon in the address bar.

---

## 🔒 Privacy

All data stays on your device. No servers, no analytics, no accounts.
