# Joywatch • Ambient Cinema Streaming & Discovery

<div align="center">

> **A high-contrast, distraction-free cinematic streaming platform with multi-mirror failover and 60fps kinetic motion.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![License: MIT](https://img.shields.io/badge/License-MIT-white.svg)](LICENSE)
[![Python: 3.9+](https://img.shields.io/badge/Python-3.9+-white.svg)](https://www.python.org/)
[![Frontend: Vanilla ES6+](https://img.shields.io/badge/Frontend-Vanilla%20ES6+-white.svg)](public/)
[![Dependencies: 0](https://img.shields.io/badge/Dependencies-0%20(Zero)-white.svg)](package.json)

</div>

---

## Highlights & Features

- **Obsidian Dark Luxury Aesthetic**  
  High-contrast, distraction-free cinematic interface built on pure Obsidian (`#090A0E`), Charcoal (`#11131A`), and Crisp White typography.
- **Strict Visual Invariants**  
  - **Zero Gradients**: Solid colors and clean alpha tints only.
  - **Zero Purple/Indigo**: Neutral monochrome luxury with subtle warm amber star ratings.
  - **Zero Emojis**: Replaced with delicate, thin-stroke geometric SVGs.
  - **Round Pill Corners**: Consistent `border-radius: 9999px` across all buttons, nav pills, tags, and inputs.
- **Multi-Server 1080p Streaming Failover**  
  Immediate browser playback defaulting to the topmost high-speed server, with a clean server switcher dropdown to jump between mirrors:
  - **Server 1 (VidLink Pro)** • 1080p Ultra HD (Best Audio & Instant Play)
  - **Server 2 (NexStream VIP)** • 1080p Ultra HD (High Bitrate VIP Stream)
  - **Server 3 (AutoEmbed Cloud)** • 1080p HD (Edge CDN)
  - **Server 4 (VidSrc PM)** • 1080p HD (Dedicated Mirror)
  - **Server 5 (VidSrc SU)** • 1080p HD (High-Speed Cloud Mirror)
  - **Server 6 (VidJoy Cinema)** • 1080p HD (Direct Stream)
  - **Server 7 (2Embed Multi-Server)** • 1080p Full HD (Multi-Language Subtitles)
- **GPU-Accelerated Kinetic Physics**  
  Ultra-smooth hardware-accelerated animations (`translateZ(0)`), Apple-inspired quintic easing (`cubic-bezier(0.16, 1, 0.3, 1)`), momentum mouse drag-to-scroll, and fluid modal transitions.
- **Deep Mobile & Responsive Optimization**  
  - Floating bottom navigation pill bar for thumb-friendly navigation on phones.
  - Bottom-sheet cinema modal with gesture handle indicator.
  - Safe-area insets (`viewport-fit=cover`) for notched displays and dynamic islands.
  - Touch swipe snapping on media shelves.
- **Instant Search & Bookmarking**  
  - 240ms debounced search with `/` keyboard shortcut.
  - JoyList personal bookmarking powered by persistent local storage.
- **Zero External Dependencies**  
  No `npm install`, no `node_modules`, no `pip install`. Pure Python 3 standard library backend and pure vanilla modern ES6+ frontend.

---

## Project Structure

```text
joywatch/
├── api/
│   └── index.py             # Vercel Serverless Function entry point
├── public/
│   ├── index.html           # Web semantic structure & player canvas
│   ├── style.css            # Dark luxury kinetic styling
│   ├── app.js               # Web streaming controller & failover logic
│   ├── manifest.json        # PWA Web App Manifest
│   ├── sw.js                # Service Worker for offline caching
│   └── icons/               # Mobile launcher icons
├── scripts/
│   ├── start.bat            # Windows interactive launcher
│   └── start-hidden.vbs     # Windows silent background runner
├── server.py                # Standalone native multi-threaded HTTP server
├── requirements.txt         # Vercel serverless runtime configuration
├── vercel.json              # Vercel deployment & routing configuration
├── agents.md                # Architecture & design system guide
├── LICENSE                  # MIT License
└── README.md                # Project documentation
```

---

## Deploying to Vercel

Joywatch is pre-configured with `vercel.json` and a Python serverless adapter in `api/index.py` for seamless, zero-config Vercel hosting.

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. Push this repository to your GitHub account:
   ```bash
   git push origin main
   ```
2. Open your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New"** > **"Project"**.
3. Import your **`Joywatch`** repository.
4. Keep all default settings:
   - **Framework Preset**: `Other`
   - **Root Directory**: `./`
5. Click **"Deploy"**.
6. Within seconds, your Joywatch web app will be live with an active HTTPS URL!

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy directly from this directory
vercel
```

---

## Quick Start (Local Development)

### Prerequisites
- Python 3.9 or newer (installed with `PATH` enabled).
- Any modern web browser (Chrome, Edge, Firefox, Safari).

### Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/joywatch.git
   cd joywatch
   ```

2. **Start the local server:**
   ```bash
   python server.py
   ```
   *On Windows, you can also double-click `start.bat`.*

3. **Open Joywatch:**
   Navigate to [http://localhost:7680](http://localhost:7680) in your browser.

---

## API Reference

| Endpoint | Method | Description | Parameters |
| :--- | :--- | :--- | :--- |
| `/api/catalog` | `GET` | Curated discovery catalog | `type` (`movie` \| `series`), `genre` (optional) |
| `/api/search` | `GET` | Instant title search | `q` (search query) |
| `/api/meta` | `GET` | Detailed metadata & episode lists | `type`, `id` (IMDb ID) |
| `/api/streams` | `GET` | Multi-server stream resolver | `type`, `id`, `title`, `season`, `episode` |
| `/api/status` | `GET` | System engine health | None |

---

## License

This project is open-source and licensed under the [MIT License](LICENSE).
