import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve(process.cwd(), 'public/textures/nexus-city');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Helper: Create raw RGBA buffer
function createBuffer(width, height) {
  return Buffer.alloc(width * height * 4);
}

function setPixel(buf, width, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= width || y < 0 || y >= buf.length / (width * 4)) return;
  const idx = (y * width + x) * 4;
  buf[idx] = r;
  buf[idx + 1] = g;
  buf[idx + 2] = b;
  buf[idx + 3] = a;
}

// 1. Wet Asphalt Road Texture (1024 x 1024)
async function generateAsphaltTexture() {
  const W = 1024;
  const H = 1024;
  const buf = createBuffer(W, H);
  const roughBuf = createBuffer(W, H);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // Noise grain
      const grain = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
      const noise = Math.floor(grain * 18);
      
      // Base dark bitumen
      let r = 16 + noise;
      let g = 20 + noise;
      let b = 28 + noise;
      let rough = 180 + Math.floor(grain * 40); // default rough

      // Wet puddle mask: subtle large organic patches
      const puddleNoise = Math.sin(x * 0.015) * Math.cos(y * 0.015) + Math.sin((x + y) * 0.008);
      if (puddleNoise > 0.4) {
        // Wet puddle reflection: darker and glossy
        r = Math.floor(r * 0.55);
        g = Math.floor(g * 0.65) + 6;
        b = Math.floor(b * 0.75) + 14;
        rough = 35; // very glossy
      }

      // Outer road curb gutter
      if (x < 30 || x > W - 30) {
        r = 10; g = 14; b = 20;
        rough = 210;
      }

      // Dashed lane marking down center (x: 504 - 520)
      if (x >= 506 && x <= 518) {
        const dashPeriod = y % 128;
        if (dashPeriod < 80) {
          // Cyber cyan / amber reflective road paint
          r = 0; g = 220; b = 255;
          rough = 90;
        }
      }

      // Crosswalk stripes at bottom (y: 860 - 980)
      if (y >= 860 && y <= 980) {
        const stripeX = x % 90;
        if (stripeX > 25 && stripeX < 65 && x > 40 && x < W - 40) {
          // White-cyan reflective crosswalk zebra stripes
          r = 210; g = 245; b = 255;
          rough = 100;
        }
      }

      setPixel(buf, W, x, y, r, g, b, 255);
      setPixel(roughBuf, W, x, y, rough, rough, rough, 255);
    }
  }

  await sharp(buf, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 90 })
    .toFile(path.join(OUT_DIR, 'road_asphalt_wet.webp'));

  await sharp(roughBuf, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 85 })
    .toFile(path.join(OUT_DIR, 'road_asphalt_roughness.webp'));

  console.log('✓ Generated road_asphalt_wet.webp & roughness');
}

// 2. High-Tech Sidewalk Pavement Texture (1024 x 1024)
async function generateSidewalkTexture() {
  const W = 1024;
  const H = 1024;
  const buf = createBuffer(W, H);

  const tileSize = 64;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const tileX = x % tileSize;
      const tileY = y % tileSize;
      const grain = (Math.sin(x * 37.1 + y * 91.7) * 43758.5453) % 1;
      const noise = Math.floor(grain * 14);

      // Base pavement tile stone
      let r = 24 + noise;
      let g = 32 + noise;
      let b = 44 + noise;

      // Mortar groove between pavers (2px)
      if (tileX <= 2 || tileY <= 2) {
        r = 10; g = 14; b = 20;
      }

      // Edge bevel lighting
      if (tileX === 3 || tileY === 3) {
        r += 12; g += 14; b = Math.min(255, b + 18);
      }

      // Cyber illuminated guide groove line running along curb edge (x: 990 - 1004)
      if (x >= 994 && x <= 1002) {
        r = 0; g = 240; b = 255; // Neon cyan LED guide strip
      } else if (x >= 990 && x <= 1006) {
        r = 5; g = 30; b = 45; // Dark track recess
      }

      // Tactile pavement indicator dots (yellow warning studs along road border)
      if (x >= 930 && x <= 975) {
        const dotX = (x - 930) % 15;
        const dotY = y % 15;
        const d = Math.hypot(dotX - 7.5, dotY - 7.5);
        if (d < 4.0) {
          r = 230; g = 180; b = 30; // Amber tactile studs
        }
      }

      setPixel(buf, W, x, y, r, g, b, 255);
    }
  }

  await sharp(buf, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 90 })
    .toFile(path.join(OUT_DIR, 'sidewalk_pavement.webp'));

  console.log('✓ Generated sidewalk_pavement.webp');
}

// 3. Futuristic Building Facade Panels (1024 x 1024)
async function generateFacadePanelsTexture() {
  const W = 1024;
  const H = 1024;
  const buf = createBuffer(W, H);

  const panelW = 256;
  const panelH = 128;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const px = x % panelW;
      const py = y % panelH;
      const grain = (Math.sin(x * 19.3 + y * 43.1) * 23421.631) % 1;
      const noise = Math.floor(grain * 10);

      // Matte dark sci-fi anodized composite metal
      let r = 18 + noise;
      let g = 22 + noise;
      let b = 32 + noise;

      // Recessed panel seam lines (3px wide dark gap)
      if (px <= 3 || py <= 3) {
        r = 8; g = 10; b = 14;
      } else if (px === 4 || py === 4) {
        // Highlight bevel
        r += 10; g += 12; b += 18;
      }

      // Corner rivets / hex bolts
      const isCorner =
        (px > 12 && px < 20 && py > 12 && py < 20) ||
        (px > panelW - 20 && px < panelW - 12 && py > 12 && py < 20) ||
        (px > 12 && px < 20 && py > panelH - 20 && py < panelH - 12) ||
        (px > panelW - 20 && px < panelW - 12 && py > panelH - 20 && py < panelH - 12);

      if (isCorner) {
        const cx = px < panelW / 2 ? 16 : panelW - 16;
        const cy = py < panelH / 2 ? 16 : panelH - 16;
        const dist = Math.hypot(px - cx, py - cy);
        if (dist < 3.5) {
          r = 70; g = 85; b = 110; // Metallic bolt
        } else if (dist < 5.0) {
          r = 10; g = 12; b = 18; // Recessed socket
        }
      }

      // Horizontal micro-groove ventilation slots on alternate panels
      const panelRow = Math.floor(y / panelH);
      const panelCol = Math.floor(x / panelW);
      if ((panelRow + panelCol) % 3 === 0) {
        if (py > 40 && py < 90 && py % 8 < 3 && px > 40 && px < panelW - 40) {
          r = 6; g = 8; b = 12; // Air intake slit
        }
      }

      setPixel(buf, W, x, y, r, g, b, 255);
    }
  }

  await sharp(buf, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 90 })
    .toFile(path.join(OUT_DIR, 'facade_panels.webp'));

  console.log('✓ Generated facade_panels.webp');
}

// 4. Illuminated High-Rise Window Matrix (1024 x 1024)
async function generateFacadeWindowsTexture() {
  const W = 1024;
  const H = 1024;
  const buf = createBuffer(W, H);

  const winW = 48;
  const winH = 64;
  const mullionX = 16;
  const mullionY = 24;
  const cellW = winW + mullionX;
  const cellH = winH + mullionY;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const col = Math.floor(x / cellW);
      const row = Math.floor(y / cellH);
      const inX = x % cellW;
      const inY = y % cellH;

      // Dark structural facade mullion frame
      let r = 12;
      let g = 15;
      let b = 22;

      // Is within window glass?
      if (inX >= mullionX && inY >= mullionY) {
        // Window index pseudorandom state
        const hash = ((col * 1973 + row * 9277) ^ 0x5bf03635) >>> 0;
        const isLit = (hash % 100) < 68; // 68% of windows illuminated

        if (isLit) {
          const colorType = hash % 5;
          let baseR = 255, baseG = 240, baseB = 200; // Warm amber/gold interior

          if (colorType === 0) {
            baseR = 0; baseG = 220; baseB = 255; // Cyan tech office
          } else if (colorType === 1) {
            baseR = 140; baseG = 100; baseB = 255; // Violet executive suite
          } else if (colorType === 2) {
            baseR = 255; baseG = 180; baseB = 80; // Amber living room
          } else if (colorType === 3) {
            baseR = 180; baseG = 240; baseB = 255; // Daylight white fluorescent
          }

          // Blinds / louvers / ceiling lights inside the room
          const winLocalY = inY - mullionY;
          const blinds = Math.sin(winLocalY * 0.5) > 0.6;
          const dim = blinds ? 0.65 : 1.0;

          // Gradient from top (ceiling lamp) to floor
          const grad = 1.0 - (winLocalY / winH) * 0.35;

          r = Math.floor(baseR * dim * grad);
          g = Math.floor(baseG * dim * grad);
          b = Math.floor(baseB * dim * grad);
        } else {
          // Dark reflective glass reflecting night sky
          r = 14; g = 20; b = 34;
        }
      }

      setPixel(buf, W, x, y, r, g, b, 255);
    }
  }

  await sharp(buf, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 90 })
    .toFile(path.join(OUT_DIR, 'facade_windows_emissive.webp'));

  console.log('✓ Generated facade_windows_emissive.webp');
}

// 5. Sci-Fi Cyber Signage & Commercial Shop Graphics (1024 x 1024)
async function generateCyberSignageTexture() {
  const W = 1024;
  const H = 1024;

  // Render using SVG overlay with sharp
  const svg = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#070b14"/>

    <!-- Sign 1: NEXUS CYBERNETICS Banner -->
    <rect x="40" y="40" width="460" height="120" rx="8" fill="#0d1424" stroke="#00f0ff" stroke-width="4"/>
    <text x="70" y="105" font-family="Arial, sans-serif" font-weight="900" font-size="34" fill="#00f0ff" letter-spacing="4">NEXUS // CORP</text>
    <text x="72" y="135" font-family="monospace" font-size="16" fill="#38bdf8" letter-spacing="3">QUANTUM SYSTEMS LAB v4.2</text>
    <circle cx="450" cy="100" r="22" fill="none" stroke="#00f0ff" stroke-width="4"/>
    <circle cx="450" cy="100" r="10" fill="#00f0ff"/>

    <!-- Sign 2: NEON RAMEN BAR (Image 1 Cyberpunk Style) -->
    <rect x="540" y="40" width="440" height="160" rx="10" fill="#180a14" stroke="#ff2a6d" stroke-width="5"/>
    <text x="570" y="115" font-family="sans-serif" font-weight="900" font-size="44" fill="#ff2a6d" letter-spacing="6">ラーメン 2088</text>
    <text x="572" y="160" font-family="sans-serif" font-weight="700" font-size="22" fill="#ffb703" letter-spacing="4">CYBER RAMEN • OPEN 24H</text>

    <!-- Sign 3: THE DRIFTER BAR (Reference Image 1) -->
    <rect x="40" y="200" width="460" height="140" rx="6" fill="#110d06" stroke="#f59e0b" stroke-width="4"/>
    <text x="70" y="270" font-family="Impact, sans-serif" font-size="52" fill="#fbbf24" letter-spacing="4">THE DRIFTER</text>
    <rect x="70" y="290" width="90" height="30" rx="4" fill="#ef4444"/>
    <text x="80" y="312" font-family="sans-serif" font-weight="900" font-size="16" fill="#ffffff">OPEN</text>
    <text x="180" y="312" font-family="monospace" font-size="15" fill="#fef08a">LEVEL 01 // SUB-SECTOR</text>

    <!-- Sign 4: NEURAL FLOWSYNC AI -->
    <rect x="540" y="230" width="440" height="140" rx="8" fill="#0b0e24" stroke="#818cf8" stroke-width="4"/>
    <text x="570" y="295" font-family="Arial, sans-serif" font-weight="800" font-size="36" fill="#818cf8" letter-spacing="3">FLOWSYNC HQ</text>
    <text x="572" y="335" font-family="monospace" font-size="16" fill="#c084fc">REAL-TIME INTELLIGENCE MATRIX</text>

    <!-- Sign 5: MATRIX CAPSULE HOTEL (Vertical Japanese) -->
    <rect x="40" y="370" width="160" height="420" rx="8" fill="#08101a" stroke="#00f0ff" stroke-width="4"/>
    <text x="120" y="440" font-family="sans-serif" font-weight="900" font-size="48" fill="#00f0ff" text-anchor="middle">カ</text>
    <text x="120" y="505" font-family="sans-serif" font-weight="900" font-size="48" fill="#00f0ff" text-anchor="middle">プ</text>
    <text x="120" y="570" font-family="sans-serif" font-weight="900" font-size="48" fill="#00f0ff" text-anchor="middle">セ</text>
    <text x="120" y="635" font-family="sans-serif" font-weight="900" font-size="48" fill="#00f0ff" text-anchor="middle">ル</text>
    <text x="120" y="700" font-family="sans-serif" font-weight="900" font-size="34" fill="#fbbf24" text-anchor="middle">HOTEL</text>
    <text x="120" y="745" font-family="monospace" font-size="18" fill="#38bdf8" text-anchor="middle">★ ★ ★</text>

    <!-- Sign 6: BIO-IMPLANTS & CYBER PHARMA -->
    <rect x="230" y="370" width="380" height="180" rx="8" fill="#061814" stroke="#10b981" stroke-width="4"/>
    <text x="260" y="435" font-family="Arial, sans-serif" font-weight="800" font-size="32" fill="#10b981">BIO-SYNTHETICS</text>
    <text x="262" y="475" font-family="monospace" font-size="16" fill="#34d399">NEURAL AUGMENTATIONS</text>
    <path d="M 540 405 L 560 405 L 560 425 L 580 425 L 580 445 L 560 445 L 560 465 L 540 465 L 540 445 L 520 445 L 520 425 L 540 425 Z" fill="#10b981"/>

    <!-- Sign 7: TRAFFIC GANTRY ROADWAY GUIDE -->
    <rect x="230" y="580" width="750" height="140" rx="6" fill="#090d18" stroke="#38bdf8" stroke-width="4"/>
    <text x="260" y="640" font-family="monospace" font-weight="900" font-size="32" fill="#38bdf8" letter-spacing="2">▲ NORTH: CODE NEXUS CITADEL</text>
    <text x="260" y="685" font-family="monospace" font-size="20" fill="#94a3b8">◄ FLOWSYNC DISTRICT   |   ECHO AI LAB ►</text>

    <!-- Sign 8: GLITCH WARNING & HAZARD STRIPES -->
    <g transform="translate(40, 820)">
      <rect width="940" height="80" fill="#111827" stroke="#f59e0b" stroke-width="3"/>
      <path d="M 0 80 L 40 0 L 80 0 L 40 80 Z M 100 80 L 140 0 L 180 0 L 140 80 Z M 200 80 L 240 0 L 280 0 L 240 80 Z M 300 80 L 340 0 L 380 0 L 340 80 Z M 400 80 L 440 0 L 480 0 L 440 80 Z M 500 80 L 540 0 L 580 0 L 540 80 Z M 600 80 L 640 0 L 680 0 L 640 80 Z M 700 80 L 740 0 L 780 0 L 740 80 Z M 800 80 L 840 0 L 880 0 L 840 80 Z" fill="#f59e0b"/>
      <rect x="360" y="16" width="220" height="48" fill="#000000"/>
      <text x="470" y="48" font-family="monospace" font-weight="900" font-size="22" fill="#f59e0b" text-anchor="middle">RESTRICTED ZONE</text>
    </g>

    <!-- Sign 9: KINETIC TELEMETRY -->
    <rect x="40" y="920" width="940" height="70" rx="4" fill="#0f172a" stroke="#6366f1" stroke-width="2"/>
    <text x="70" y="964" font-family="monospace" font-size="20" fill="#a5b4fc">GRID POWER: 99.8%  •  AIR QUALITY: MODERATE  •  DRONE PATROL: ACTIVE</text>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .webp({ quality: 90 })
    .toFile(path.join(OUT_DIR, 'sign_cyber_commercial.webp'));

  console.log('✓ Generated sign_cyber_commercial.webp');
}

// 6. Curved LED Media Billboard Screen (1024 x 512, Reference Image B)
async function generateCurvedBillboardTexture() {
  const W = 1024;
  const H = 512;

  const svg = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#020617"/>
        <stop offset="50%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
      <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="50%" stop-color="#c084fc"/>
        <stop offset="100%" stop-color="#f43f5e"/>
      </linearGradient>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg)"/>

    <!-- Subtle LED Dot Matrix Grid -->
    <pattern id="dotgrid" width="8" height="8" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="4" r="1.2" fill="rgba(255,255,255,0.08)"/>
    </pattern>
    <rect width="100%" height="100%" fill="url(#dotgrid)"/>

    <!-- Curved Graphic Shapes & Glowing Ribbon (Ref Image B style) -->
    <path d="M 0 380 Q 300 120 600 320 T 1024 160" fill="none" stroke="url(#glow)" stroke-width="18" opacity="0.9"/>
    <path d="M 0 420 Q 350 200 650 380 T 1024 220" fill="none" stroke="#00f0ff" stroke-width="6" opacity="0.8"/>

    <!-- 3D Mascot / Robotic Icon Accent (Reference Image B) -->
    <rect x="720" y="70" width="220" height="280" rx="20" fill="#0f172a" stroke="#38bdf8" stroke-width="6"/>
    <!-- Cyber Robot Face -->
    <rect x="760" y="110" width="140" height="110" rx="14" fill="#0284c7"/>
    <rect x="780" y="140" width="30" height="20" rx="4" fill="#ffffff"/>
    <rect x="850" y="140" width="30" height="20" rx="4" fill="#ffffff"/>
    <rect x="795" y="180" width="70" height="12" rx="3" fill="#38bdf8"/>
    <!-- Antennas -->
    <line x1="830" y1="110" x2="830" y2="85" stroke="#38bdf8" stroke-width="8"/>
    <circle cx="830" cy="80" r="10" fill="#f43f5e"/>
    <text x="830" y="275" font-family="Impact, sans-serif" font-size="28" fill="#38bdf8" text-anchor="middle">BOT-X // 01</text>

    <!-- Main Commercial Typography (Ref Image B "CARBON FIBER / LEON") -->
    <text x="60" y="130" font-family="Impact, sans-serif" font-size="80" fill="#ffffff" letter-spacing="4">NEXUS PRIME</text>
    <text x="64" y="180" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#38bdf8" letter-spacing="6">QUANTUM NEURAL INTERFACE</text>

    <rect x="64" y="220" width="380" height="6" fill="#38bdf8"/>

    <text x="64" y="270" font-family="monospace" font-size="18" fill="#94a3b8">
      EXPAND CONSCIOUSNESS • 120 FPS STREAMING
    </text>
    <text x="64" y="305" font-family="monospace" font-size="18" fill="#94a3b8">
      LOW LATENCY SYNAPTIC CONNECTIVITY
    </text>

    <!-- Bottom Stock Ticker / Telemetry Bar -->
    <rect x="0" y="440" width="1024" height="72" fill="#020617"/>
    <text x="30" y="485" font-family="monospace" font-weight="bold" font-size="20" fill="#00f0ff">
      ▲ FLOW +4.2%   ▲ ECHO +12.8%   ▼ AIX -0.4%   ▲ INNP +8.6%   ★ NEXUS VERIFIED
    </text>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .webp({ quality: 90 })
    .toFile(path.join(OUT_DIR, 'billboard_curved_screen.webp'));

  console.log('✓ Generated billboard_curved_screen.webp');
}

// 7. Holographic Monument Core Display (512 x 512, Reference C)
async function generateHoloMonumentCoreTexture() {
  const W = 512;
  const H = 512;

  const svg = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#050812"/>

    <g transform="translate(256, 256)">
      <!-- Outer Rotating Rings -->
      <circle cx="0" cy="0" r="220" fill="none" stroke="#00f0ff" stroke-width="3" stroke-dasharray="16, 8" opacity="0.8"/>
      <circle cx="0" cy="0" r="190" fill="none" stroke="#818cf8" stroke-width="4" stroke-dasharray="32, 12" opacity="0.9"/>
      <circle cx="0" cy="0" r="150" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8, 8"/>
      <circle cx="0" cy="0" r="110" fill="none" stroke="#00f0ff" stroke-width="5"/>
      <circle cx="0" cy="0" r="70" fill="none" stroke="#c084fc" stroke-width="3" stroke-dasharray="24, 6"/>
      <circle cx="0" cy="0" r="30" fill="#00f0ff" opacity="0.9"/>

      <!-- Radials -->
      <line x1="-220" y1="0" x2="220" y2="0" stroke="#00f0ff" stroke-width="2" opacity="0.5"/>
      <line x1="0" y1="-220" x2="0" y2="220" stroke="#00f0ff" stroke-width="2" opacity="0.5"/>
      <line x1="-155" y1="-155" x2="155" y2="155" stroke="#38bdf8" stroke-width="1.5" opacity="0.4"/>
      <line x1="-155" y1="155" x2="155" y2="-155" stroke="#38bdf8" stroke-width="1.5" opacity="0.4"/>

      <!-- Hexagonal Frame -->
      <polygon points="0,-130 112,-65 112,65 0,130 -112,65 -112,-65" fill="none" stroke="#00f0ff" stroke-width="2.5" opacity="0.75"/>
      <polygon points="0,-90 78,-45 78,45 0,90 -78,45 -78,-45" fill="none" stroke="#c084fc" stroke-width="2" opacity="0.75"/>

      <!-- Digital Telemetry Labels -->
      <text x="0" y="-165" font-family="monospace" font-size="12" fill="#00f0ff" text-anchor="middle">CITADEL CORE // ONLINE</text>
      <text x="0" y="175" font-family="monospace" font-size="12" fill="#c084fc" text-anchor="middle">FREQ: 840.2 GHZ</text>
    </g>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .webp({ quality: 90 })
    .toFile(path.join(OUT_DIR, 'hologram_monument_core.webp'));

  console.log('✓ Generated hologram_monument_core.webp');
}

// 8. Metal Grate & Industrial Conduit Ventilation (512 x 512, Reference D)
async function generateMetalGrateTexture() {
  const W = 512;
  const H = 512;
  const buf = createBuffer(W, H);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const grain = (Math.sin(x * 47.3 + y * 61.9) * 12345.67) % 1;
      const noise = Math.floor(grain * 12);

      // Dark steel metal base
      let r = 28 + noise;
      let g = 32 + noise;
      let b = 38 + noise;

      // Ventilation louvers: angled horizontal slats
      const slatY = y % 24;
      if (slatY < 4) {
        // Deep shadow gap
        r = 6; g = 8; b = 10;
      } else if (slatY === 4) {
        // Top highlight lip
        r = 85; g = 95; b = 110;
      } else if (slatY > 18) {
        // Under-slat shadow
        r = 14; g = 18; b = 22;
      }

      // Vertical support ribs every 128px
      const ribX = x % 128;
      if (ribX < 8) {
        r = 45 + noise; g = 50 + noise; b = 60 + noise;
      }

      setPixel(buf, W, x, y, r, g, b, 255);
    }
  }

  await sharp(buf, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 90 })
    .toFile(path.join(OUT_DIR, 'metal_grate_duct.webp'));

  console.log('✓ Generated metal_grate_duct.webp');
}

async function main() {
  console.log('Generating high-performance Nexus City textures in WebP format...');
  await generateAsphaltTexture();
  await generateSidewalkTexture();
  await generateFacadePanelsTexture();
  await generateFacadeWindowsTexture();
  await generateCyberSignageTexture();
  await generateCurvedBillboardTexture();
  await generateHoloMonumentCoreTexture();
  await generateMetalGrateTexture();
  console.log('All textures successfully generated in:', OUT_DIR);
}

main().catch(console.error);

