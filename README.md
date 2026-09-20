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
- **Multi-Server Streaming Failover**  
  Immediate browser playback defaulting to the topmost high-speed server, with a clean right-side switcher to jump between mirrors if a server doesn't host specific regional content:
  - **Server 1 (VidLink Fast Cloud)** • 1080p Ultra HD
  - **Server 2 (2Embed Multi-Server)** • 1080p Full HD
  - **Server 3 (AutoEmbed Cloud)** • 1080p HD
  - **Server 4 (VidSrc Mirror)** • Fast HD Mirror
- **GPU-Accelerated Kinetic Physics**  
  Ultra-smooth hardware-accelerated animations (`translateZ(0)`), Apple-inspired quintic easing (`cubic-bezier(0.16, 1, 0.3, 1)`), momentum mouse drag-to-scroll, and fluid modal transitions.
- **Deep Mobile Optimization**  
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
├── android/                 # 100% Pure Native Android App (Kotlin + Compose + ExoPlayer)
│   ├── app/src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── java/com/joywatch/app/
│   │   │   ├── JoywatchApp.kt           # Navigation root & bottom nav pill scaffold
│   │   │   ├── MainActivity.kt          # Compose entrypoint activity
│   │   │   ├── data/
│   │   │   │   ├── model/Models.kt      # MediaItem, MetaDetails, StreamSource
│   │   │   │   └── repository/          # Cinemeta API & JoyList persistent storage
│   │   │   └── ui/
│   │   │       ├── theme/               # Obsidian luxury design tokens
│   │   │       ├── components/          # Billboard, MediaCard, Shelf, DetailBottomSheet
│   │   │       └── screens/             # HomeScreen, SearchScreen, PlayerScreen (ExoPlayer)
│   │   └── res/                         # Native launcher icons, strings, styles
│   └── build.gradle
├── api/
│   └── index.py             # Vercel Serverless Function entry point
├── public/
│   ├── index.html           # Web semantic structure
│   ├── style.css            # Dark luxury kinetic styling
│   ├── app.js               # Web streaming controller
│   ├── manifest.json        # PWA Web App Manifest
│   ├── sw.js                # Service Worker for offline caching
│   └── icons/               # Mobile launcher icons
├── scripts/
│   ├── start.bat            # Windows interactive launcher
│   ├── start-hidden.vbs     # Windows silent background runner
│   └── create-shortcut.ps1  # Desktop shortcut creator
├── server.py                # Standalone native multi-threaded HTTP server
├── requirements.txt         # Vercel serverless runtime configuration
├── vercel.json              # Vercel deployment & routing configuration
├── agents.md                # Agent & architecture field guide
├── LICENSE                  # MIT License
└── README.md                # Project documentation
```

---

## Native Android App (Kotlin + Jetpack Compose + ExoPlayer)

Joywatch includes a **100% pure native Android mobile app** built with modern Android standards (zero WebViews, zero web wrappers):

### Key Native Highlights:
- **Jetpack Compose 120fps UI**: Declarative native composables with fluid hardware rendering.
- **AndroidX Media3 / ExoPlayer**: Native hardware-accelerated video playback engine with cinema controls (scrubber slider, 10s skip/rewind, time indicators).
- **Multi-Server Failover Switcher**: Right-side server switching modal (`Server 1`, `Server 2`, `Server 3`, `Server 4`).
- **Dynamic Orientation**: Auto-rotates into landscape mode during video playback and restores portrait when closing the player.
- **Native Draggable BottomSheet**: Full movie/series detail modal with synopsis, genre tags, and season/episode picker.
- **Reactive JoyList Bookmarks**: Persistent offline watchlist powered by Kotlin Coroutines StateFlow.
- **Obsidian Dark Aesthetic**: Strict design rules preserved (Obsidian `#090A0E`, charcoal surfaces, round pill buttons, zero gradients, zero purple, zero emojis).

### How to Build & Run:
1. Open **Android Studio** (Hedgehog 2023.1 or newer).
2. Click **Open** and select the `android/` directory inside this repository.
3. Android Studio will automatically sync the Gradle project.
4. Connect your Android device (or launch an Android Virtual Device emulator) and click **Run** (`Shift + F10`), or build the APK via **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

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

2. **Start the server:**
   ```bash
   python server.py
   ```
   *On Windows, you can also simply double-click `start.bat`.*

3. **Open Joywatch:**
   Navigate to [http://localhost:7700](http://localhost:7700) (or `http://localhost:7680`).

---

## Deploying to Vercel

Joywatch is pre-configured with `vercel.json` and a Python serverless adapter in `api/index.py` for seamless one-click Vercel hosting.

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. Push this repository to your GitHub account (see instructions below).
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New"** > **"Project"**.
3. Select your **`joywatch`** GitHub repository.
4. Leave all build settings at their defaults:
   - **Framework Preset**: `Other`
   - **Root Directory**: `./`
5. Click **"Deploy"**.
6. Within seconds, your Joywatch app will be live with an active HTTPS URL!

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI (optional)
npm install -g vercel

# Deploy directly from the project directory
vercel
```

---

## API Reference

| Endpoint | Method | Description | Parameters |
| :--- | :--- | :--- | :--- |
| `/api/catalog` | `GET` | Curated discovery catalog | `type` (`movie` \| `series`), `genre` (optional), `page` |
| `/api/search` | `GET` | Instant title search | `q` (search query) |
| `/api/meta` | `GET` | Detailed metadata & episode lists | `type`, `id` (IMDb ID) |
| `/api/streams` | `GET` | Multi-server stream resolver | `type`, `id`, `title`, `season`, `episode` |
| `/api/status` | `GET` | System engine health | None |

---

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request!

---

## License

This project is open-source and licensed under the [MIT License](LICENSE).
