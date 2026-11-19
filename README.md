# Abhishek S Nair — Interactive 3D Developer Universe

**Software Developer** · Web · Mobile · AI Applications · Systems

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

---

## 🚀 Interactive Experiences

This portfolio features three seamlessly connected interactive experiences:

### 1. 🌆 3D Open World: "ABHISHEK // DEVELOPER UNIVERSE" (`/world` or `/experience?view=world`)
An explorable futuristic cyberpunk city built with **Three.js** and **React Three Fiber**:
- **Atmospheric Night City:** Dark volumetric fog, neon highways with animated traffic data pulses, dynamic lighting in cyan, violet, and amber.
- **Cinematic Introduction:** Smooth camera sweep from high vantage point down to player spawn with title reveal and instant "Skip Intro" option.
- **3D Developer Avatar:** Stylized futuristic humanoid character with cyan neon visor, jetpack thrusters, walking locomotion cycle, and smooth heading rotation.
- **Zero-Rerender Controls:** Physics and coordinates kept in animation loop refs for silky 60 FPS performance without frame-by-frame React state thrashing.
- **9 Interactive Architectural Districts:**
  1. **GitHub Code Nexus Citadel** `(0, 0)`: Monumental portal citadel connecting to the animated GitHub universe.
  2. **FlowSync HQ** `(-24, -22)`: Real-time collaborative workspace with floating task boards and NVIDIA NIM AI nodes.
  3. **Echo AI Lab** `(24, -22)`: Neural network laboratory with browser extension integration.
  4. **Mobile Network** `(-26, 18)`: Floating mobile devices and pulsing Bluetooth Low Energy (BLE) beacons.
  5. **AI Analytics** `(26, 18)`: High-frequency candlestick telemetry and FastAPI Python nodes.
  6. **Logistics Garage** `(0, -34)`: Commercial fleet command dock with live GPS vehicle models.
  7. **InnSpark HQ** `(0, 32)`: Enterprise software development tower detailing 3+ years of commercial production deliveries.
  8. **About Hub** `(-34, 0)`: Interactive biography dome with personal philosophy and credentials.
  9. **Contact Center** `(34, 0)`: High-speed communications terminal array with working direct links.
- **Collision Prevention & Radar MiniMap:** Prevents walking through buildings, live radar tracking all 9 locations, and mobile on-screen D-pad.

---

### 2. ⚡ GitHub Code Nexus Universe (`/github-universe`)
An animated developer profile-building sequence where an automated terminal cursor constructs the engineer's profile from quantum code:
- **Stage 1 (Environment Initialization):** Holographic grid lines and particle fields appear.
- **Stage 2 (Animated Terminal Cursor):** Real-time typing sequence executing developer initialization commands.
- **Stage 3 (Profile Assembly):** Verified avatar, bio, and primary language telemetry assemble dynamically.
- **Stage 4 (Neural Architecture Network):** SVG animated lines map technology categories to production repositories.
- **Stage 5 (Interactive Finished Dashboard):** Category filtering, real GitHub repository links, star/fork indicators, language telemetry breakdown, and replay controls.
- **Server-Side Safe API:** Next.js route handler (`/api/github`) with safe caching and verified static fallback.

---

### 3. 👤 Interactive 3D Developer Portrait
Featured prominently on the homepage hero and about sections:
- **Physics-Based Cursor Tracking:** Spring-damped 3D perspective tilt reacting to mouse position.
- **Multi-Plane Layered Depth:** Background cyber-rings, glow aura, authentic photo silhouette (100% facial identity preserved), specular highlight sheen, and floating HUD satellite badges.
- **Reduced Motion & Touch Fallback:** Respects `prefers-reduced-motion` and provides seamless fallback on mobile devices.

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Framework** | Next.js 16 (App Router with Webpack/Turbopack) |
| **3D & Graphics** | Three.js, React Three Fiber, Drei |
| **UI & Styling** | React 19, TypeScript 5, Tailwind CSS 4 |
| **Motion** | Framer Motion, GSAP |
| **Data & APIs** | Server-side GitHub API with ISR cache, verified portfolio data |

---

## 📁 Architecture Overview

```
src/
├── app/
│   ├── api/
│   │   ├── github/        # Server-side cached GitHub profile API
│   │   ├── contact/       # Contact form endpoint
│   │   └── resume/        # Secure resume delivery
│   ├── experience/        # Cinematic experience & 3D world hub
│   ├── github-universe/   # Standalone animated GitHub profile builder
│   ├── world/             # Direct route to 3D Developer Universe
│   └── page.tsx           # Modernized professional portfolio
├── components/
│   ├── three-world/       # Modular 3D Open World Simulation
│   │   ├── WorldScene.tsx
│   │   ├── DeveloperAvatar3D.tsx
│   │   ├── CityEnvironment.tsx
│   │   ├── DistrictBuildings.tsx
│   │   ├── CinematicCameraController.tsx
│   │   ├── WorldHUD.tsx
│   │   └── WorldConfig.ts
│   ├── portrait-3d/       # Interactive layered 3D portrait
│   │   └── InteractivePortrait.tsx
│   ├── github-universe/   # Staged GitHub profile constructor
│   │   └── GithubUniverseView.tsx
│   ├── experience/        # Scrollytelling canvas & overlays
│   └── ...                # Core portfolio sections
├── lib/
│   └── github/            # Safe GitHub types and client service
└── data/
    └── portfolioData.ts   # Centralized verified project data
```

---

## 🏃 Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run TypeScript validation
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Build for production
npm run build
```
