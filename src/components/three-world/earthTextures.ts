'use client';

import * as THREE from 'three';

let cachedEarthAlbedo: THREE.CanvasTexture | null = null;
let cachedEarthSpecular: THREE.CanvasTexture | null = null;
let cachedEarthNight: THREE.CanvasTexture | null = null;
let cachedEarthClouds: THREE.CanvasTexture | null = null;
let cachedEarthBump: THREE.CanvasTexture | null = null;

/**
 * Procedural Photorealistic Earth Texture Suite
 * Uses high-resolution canvas synthesis for zero-network-dependency,
 * guaranteed offline availability, and crisp planetary details.
 */

interface ContinentShape {
  name: string;
  poly: [number, number][]; // normalized [u, v] where u: 0..1 (long -180..180), v: 0..1 (lat 90..-90)
  color: string;
  innerDesert?: [number, number][];
  innerMountain?: [number, number][];
  snowCaps?: [number, number][];
}

// Normalized coordinate helper: lon (-180..180) -> u (0..1), lat (-90..90) -> v (1..0)
function coord(lon: number, lat: number): [number, number] {
  return [(lon + 180) / 360, (90 - lat) / 180];
}

const CONTINENT_SHAPES: ContinentShape[] = [
  // North America
  {
    name: 'North America',
    poly: [
      coord(-168, 65), coord(-140, 70), coord(-125, 71), coord(-85, 70), coord(-80, 60),
      coord(-60, 50), coord(-64, 44), coord(-75, 35), coord(-80, 25), coord(-98, 20),
      coord(-88, 16), coord(-80, 8), coord(-78, 8), coord(-83, 10), coord(-90, 15),
      coord(-105, 22), coord(-110, 30), coord(-122, 37), coord(-125, 48), coord(-135, 56),
      coord(-165, 58), coord(-168, 65)
    ],
    color: '#2d5a27',
    innerDesert: [
      coord(-115, 35), coord(-102, 33), coord(-100, 25), coord(-110, 24), coord(-115, 32)
    ],
    innerMountain: [
      coord(-120, 55), coord(-115, 48), coord(-108, 40), coord(-104, 32), coord(-108, 30),
      coord(-114, 38), coord(-122, 48)
    ]
  },
  // Greenland
  {
    name: 'Greenland',
    poly: [
      coord(-50, 82), coord(-20, 81), coord(-22, 70), coord(-42, 60), coord(-52, 68), coord(-50, 82)
    ],
    color: '#e2e8f0',
  },
  // South America
  {
    name: 'South America',
    poly: [
      coord(-77, 8), coord(-60, 10), coord(-50, 0), coord(-35, -5), coord(-38, -15),
      coord(-45, -23), coord(-53, -33), coord(-65, -45), coord(-70, -54), coord(-75, -50),
      coord(-72, -38), coord(-70, -25), coord(-80, -5), coord(-77, 8)
    ],
    color: '#1e4620',
    innerDesert: [
      coord(-70, -22), coord(-68, -27), coord(-66, -32), coord(-70, -30)
    ],
    innerMountain: [
      coord(-76, 5), coord(-75, -5), coord(-71, -18), coord(-69, -32), coord(-71, -48),
      coord(-74, -45), coord(-75, -20)
    ]
  },
  // Eurasia (Europe + Asia)
  {
    name: 'Eurasia',
    poly: [
      coord(-9, 36), coord(0, 43), coord(-4, 48), coord(5, 53), coord(10, 58), coord(25, 71),
      coord(60, 74), coord(100, 77), coord(140, 73), coord(170, 68), coord(170, 60),
      coord(142, 52), coord(130, 42), coord(122, 38), coord(120, 31), coord(110, 21),
      coord(104, 10), coord(100, 2), coord(96, 17), coord(90, 22), coord(82, 16),
      coord(76, 8), coord(72, 20), coord(67, 24), coord(58, 24), coord(50, 26),
      coord(44, 13), coord(43, 27), coord(35, 31), coord(30, 31), coord(26, 38),
      coord(14, 41), coord(-5, 36), coord(-9, 36)
    ],
    color: '#345e2a',
    innerDesert: [
      // Sahara to Arabia to Gobi
      coord(38, 28), coord(55, 27), coord(58, 22), coord(45, 18), coord(40, 24),
      coord(55, 35), coord(75, 42), coord(95, 44), coord(105, 42), coord(100, 35), coord(80, 30)
    ],
    innerMountain: [
      coord(70, 35), coord(80, 35), coord(90, 32), coord(95, 28), coord(85, 27), coord(75, 30)
    ]
  },
  // United Kingdom & Ireland
  {
    name: 'British Isles',
    poly: [
      coord(-5, 58), coord(-2, 58), coord(1, 52), coord(-5, 50), coord(-5, 58)
    ],
    color: '#22542a',
  },
  // Japan
  {
    name: 'Japan',
    poly: [
      coord(141, 45), coord(143, 42), coord(139, 35), coord(131, 32), coord(130, 34), coord(139, 39), coord(141, 45)
    ],
    color: '#2d6032',
  },
  // Africa
  {
    name: 'Africa',
    poly: [
      coord(-6, 35), coord(11, 37), coord(32, 31), coord(34, 27), coord(43, 12),
      coord(51, 11), coord(44, -1), coord(40, -10), coord(35, -23), coord(28, -33),
      coord(18, -34), coord(12, -20), coord(9, -5), coord(3, 5), coord(-15, 11),
      coord(-17, 15), coord(-12, 28), coord(-6, 35)
    ],
    color: '#556b2f',
    innerDesert: [
      // Vast Sahara
      coord(-12, 30), coord(0, 32), coord(15, 32), coord(32, 28), coord(33, 20),
      coord(25, 18), coord(10, 16), coord(-5, 17), coord(-12, 22)
    ],
    innerMountain: [
      coord(35, 8), coord(38, 2), coord(37, -4), coord(34, 0)
    ]
  },
  // Australia
  {
    name: 'Australia',
    poly: [
      coord(130, -12), coord(136, -12), coord(142, -11), coord(149, -21), coord(153, -28),
      coord(150, -36), coord(144, -38), coord(138, -35), coord(130, -32), coord(116, -34),
      coord(114, -25), coord(122, -18), coord(130, -12)
    ],
    color: '#8b5a2b',
    innerDesert: [
      coord(120, -22), coord(138, -21), coord(142, -26), coord(135, -30), coord(122, -28)
    ]
  },
  // Antarctica
  {
    name: 'Antarctica',
    poly: [
      coord(-180, -70), coord(180, -70), coord(180, -90), coord(-180, -90)
    ],
    color: '#f8fafc',
  }
];

// Major global city light clusters (lat, lon, radius, intensity)
const CITY_LIGHTS = [
  // North America
  { lat: 40.71, lon: -74.00, r: 18, pwr: 1.0 }, // New York Megalopolis
  { lat: 34.05, lon: -118.24, r: 16, pwr: 0.95 }, // Los Angeles
  { lat: 37.77, lon: -122.42, r: 14, pwr: 0.98 }, // San Francisco / Silicon Valley
  { lat: 41.87, lon: -87.62, r: 14, pwr: 0.9 }, // Chicago
  { lat: 29.76, lon: -95.36, r: 13, pwr: 0.85 }, // Houston
  { lat: 43.65, lon: -79.38, r: 11, pwr: 0.85 }, // Toronto
  { lat: 19.43, lon: -99.13, r: 15, pwr: 0.9 }, // Mexico City

  // Europe
  { lat: 51.50, lon: -0.12, r: 18, pwr: 1.0 }, // London
  { lat: 48.85, lon: 2.35, r: 16, pwr: 0.98 }, // Paris
  { lat: 52.52, lon: 13.40, r: 15, pwr: 0.92 }, // Berlin
  { lat: 50.85, lon: 4.35, r: 17, pwr: 0.95 }, // Benelux / Ruhr Valley
  { lat: 41.90, lon: 12.49, r: 12, pwr: 0.88 }, // Rome
  { lat: 40.41, lon: -3.70, r: 12, pwr: 0.85 }, // Madrid
  { lat: 55.75, lon: 37.61, r: 14, pwr: 0.9 }, // Moscow

  // Asia & India
  { lat: 28.61, lon: 77.20, r: 16, pwr: 1.0 }, // New Delhi
  { lat: 19.07, lon: 72.87, r: 16, pwr: 1.0 }, // Mumbai
  { lat: 12.97, lon: 77.59, r: 15, pwr: 0.98 }, // Bengaluru (Tech Hub)
  { lat: 13.08, lon: 80.27, r: 13, pwr: 0.9 }, // Chennai
  { lat: 22.57, lon: 88.36, r: 14, pwr: 0.92 }, // Kolkata
  { lat: 15.00, lon: 75.00, r: 18, pwr: 1.0 }, // Portfolio Metropolis (HQ)
  { lat: 31.23, lon: 121.47, r: 18, pwr: 1.0 }, // Shanghai
  { lat: 39.90, lon: 116.40, r: 16, pwr: 0.95 }, // Beijing
  { lat: 22.31, lon: 114.16, r: 17, pwr: 0.98 }, // Hong Kong / Pearl River Delta
  { lat: 35.67, lon: 139.65, r: 20, pwr: 1.0 }, // Tokyo Kanto Megalopolis
  { lat: 37.56, lon: 126.97, r: 16, pwr: 0.95 }, // Seoul
  { lat: 1.35, lon: 103.81, r: 14, pwr: 0.95 }, // Singapore
  { lat: 25.20, lon: 55.27, r: 15, pwr: 0.95 }, // Dubai

  // South America & Africa & Oceania
  { lat: -23.55, lon: -46.63, r: 16, pwr: 0.95 }, // Sao Paulo
  { lat: -34.60, lon: -58.38, r: 14, pwr: 0.9 }, // Buenos Aires
  { lat: 30.04, lon: 31.23, r: 15, pwr: 0.92 }, // Cairo / Nile Delta
  { lat: 6.52, lon: 3.37, r: 12, pwr: 0.8 }, // Lagos
  { lat: -26.20, lon: 28.04, r: 12, pwr: 0.85 }, // Johannesburg
  { lat: -33.86, lon: 151.20, r: 14, pwr: 0.92 }, // Sydney
  { lat: -37.81, lon: 144.96, r: 13, pwr: 0.88 }, // Melbourne
];

/**
 * 1. Generates High-Resolution Photorealistic Earth Albedo Map (2048 x 1024)
 * Shows deep sapphire oceans, shallow coastal shelves, green forests, golden deserts, snow caps.
 */
export function getEarthAlbedoTexture(): THREE.CanvasTexture {
  if (cachedEarthAlbedo) return cachedEarthAlbedo;

  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }

  const w = 2048;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 1. Deep Ocean Base with realistic latitudinal gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
    oceanGrad.addColorStop(0.0, '#0a1d37'); // Arctic deep blue
    oceanGrad.addColorStop(0.2, '#0f2b48');
    oceanGrad.addColorStop(0.5, '#0b2545'); // Tropical deep sapphire
    oceanGrad.addColorStop(0.8, '#0f2b48');
    oceanGrad.addColorStop(1.0, '#0a1d37'); // Antarctic
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Coastal Shelves & Shallow Waters (Cyan/Turquoise glow around coastlines)
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const cont of CONTINENT_SHAPES) {
      if (cont.name === 'Antarctica') continue;
      ctx.beginPath();
      for (let i = 0; i < cont.poly.length; i++) {
        const [u, v] = cont.poly[i];
        const x = u * w;
        const y = v * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.lineWidth = 18;
      ctx.strokeStyle = 'rgba(20, 95, 130, 0.45)';
      ctx.stroke();

      ctx.lineWidth = 8;
      ctx.strokeStyle = 'rgba(38, 145, 175, 0.65)';
      ctx.stroke();
    }

    // 3. Landmass Solid Fill & Base Biomes
    for (const cont of CONTINENT_SHAPES) {
      ctx.beginPath();
      for (let i = 0; i < cont.poly.length; i++) {
        const [u, v] = cont.poly[i];
        const x = u * w;
        const y = v * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = cont.color;
      ctx.fill();

      // Deserts & Arid Plateaus
      if (cont.innerDesert) {
        ctx.beginPath();
        for (let i = 0; i < cont.innerDesert.length; i++) {
          const [u, v] = cont.innerDesert[i];
          const x = u * w;
          const y = v * h;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = '#c29b62'; // Sahara / Outback golden sand
        ctx.fill();
      }

      // Mountain Ranges (Rocky elevation)
      if (cont.innerMountain) {
        ctx.beginPath();
        for (let i = 0; i < cont.innerMountain.length; i++) {
          const [u, v] = cont.innerMountain[i];
          const x = u * w;
          const y = v * h;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#4a4036';
        ctx.stroke();
        ctx.fillStyle = '#655648';
        ctx.fill();
      }
    }

    // 4. Polar Ice Caps & Glaciers
    // North Pole Arctic Ice Pack
    const northIce = ctx.createLinearGradient(0, 0, 0, h * 0.12);
    northIce.addColorStop(0, 'rgba(240, 248, 255, 0.95)');
    northIce.addColorStop(0.7, 'rgba(224, 242, 254, 0.8)');
    northIce.addColorStop(1, 'rgba(224, 242, 254, 0)');
    ctx.fillStyle = northIce;
    ctx.fillRect(0, 0, w, h * 0.12);

    // Antarctica Ice Sheet
    const southIce = ctx.createLinearGradient(0, h * 0.85, 0, h);
    southIce.addColorStop(0, 'rgba(224, 242, 254, 0)');
    southIce.addColorStop(0.3, 'rgba(235, 245, 255, 0.85)');
    southIce.addColorStop(1, 'rgba(248, 250, 252, 1)');
    ctx.fillStyle = southIce;
    ctx.fillRect(0, h * 0.85, w, h * 0.15);

    // 5. Procedural Texture Noise for terrain realism (micro-relief)
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 16) {
      const n = (Math.random() - 0.5) * 14;
      data[i] = Math.max(0, Math.min(255, data[i] + n));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);
  }

  cachedEarthAlbedo = new THREE.CanvasTexture(canvas);
  cachedEarthAlbedo.generateMipmaps = true;
  cachedEarthAlbedo.minFilter = THREE.LinearMipmapLinearFilter;
  cachedEarthAlbedo.magFilter = THREE.LinearFilter;
  return cachedEarthAlbedo;
}

/**
 * 2. Generates Specular Map (High gloss on oceans, matte on land)
 */
export function getEarthSpecularTexture(): THREE.CanvasTexture {
  if (cachedEarthSpecular) return cachedEarthSpecular;

  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }

  const w = 1024;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Water is highly reflective white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Land is non-reflective black/dark gray
    for (const cont of CONTINENT_SHAPES) {
      ctx.beginPath();
      for (let i = 0; i < cont.poly.length; i++) {
        const [u, v] = cont.poly[i];
        const x = u * w;
        const y = v * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      // Polar ice has slight specular sheen
      if (cont.name === 'Antarctica' || cont.name === 'Greenland') {
        ctx.fillStyle = '#555555';
      } else {
        ctx.fillStyle = '#111111';
      }
      ctx.fill();
    }
  }

  cachedEarthSpecular = new THREE.CanvasTexture(canvas);
  cachedEarthSpecular.generateMipmaps = true;
  return cachedEarthSpecular;
}

/**
 * 3. Generates Night-Side City Lights Map
 * Golden and amber luminous dots for urban centers on Earth's night side.
 */
export function getEarthNightLightsTexture(): THREE.CanvasTexture {
  if (cachedEarthNight) return cachedEarthNight;

  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }

  const w = 2048;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Pure black night background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    // Draw major urban clusters with soft radial glows
    for (const city of CITY_LIGHTS) {
      const [u, v] = coord(city.lon, city.lat);
      const cx = u * w;
      const cy = v * h;

      // Soft ambient light plume around metropolitan area
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, city.r * 2.5);
      grad.addColorStop(0, `rgba(255, 214, 138, ${0.95 * city.pwr})`);
      grad.addColorStop(0.35, `rgba(245, 158, 11, ${0.55 * city.pwr})`);
      grad.addColorStop(0.7, `rgba(56, 189, 248, ${0.2 * city.pwr})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, city.r * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Sharp bright city center core
      ctx.fillStyle = `rgba(255, 253, 240, ${city.pwr})`;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(1.8, city.r * 0.3), 0, Math.PI * 2);
      ctx.fill();

      // Highway corridors & satellite towns branching out
      for (let j = 0; j < 5; j++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = (0.5 + Math.random() * 1.5) * city.r;
        const sx = cx + Math.cos(angle) * dist;
        const sy = cy + Math.sin(angle) * dist;
        ctx.fillStyle = 'rgba(251, 191, 36, 0.7)';
        ctx.beginPath();
        ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  cachedEarthNight = new THREE.CanvasTexture(canvas);
  cachedEarthNight.generateMipmaps = true;
  return cachedEarthNight;
}

/**
 * 4. Generates Realistic Planetary Cloud Cover Texture
 * Swirling weather fronts, cyclones, and tropical cloud belts.
 */
export function getEarthCloudsTexture(): THREE.CanvasTexture {
  if (cachedEarthClouds) return cachedEarthClouds;

  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }

  const w = 2048;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Transparent base
    ctx.clearRect(0, 0, w, h);

    // Equatorial Intertropical Convergence Zone (ITCZ) cloud bands
    for (let i = 0; i < 40; i++) {
      const cx = Math.random() * w;
      const cy = h * 0.48 + (Math.random() - 0.5) * h * 0.15;
      const rx = 80 + Math.random() * 180;
      const ry = 15 + Math.random() * 40;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
      grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.scale(1, ry / rx);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Mid-Latitude Cyclones and Spiraling Weather Fronts
    for (let c = 0; c < 12; c++) {
      const cx = (c / 12) * w + (Math.random() - 0.5) * 100;
      const hemisphere = c % 2 === 0 ? 0.28 : 0.72;
      const cy = h * hemisphere + (Math.random() - 0.5) * h * 0.12;

      ctx.save();
      ctx.translate(cx, cy);
      // Spiral arms
      for (let arm = 0; arm < 3; arm++) {
        ctx.beginPath();
        const baseAngle = (arm * Math.PI * 2) / 3;
        for (let t = 0; t < 30; t++) {
          const r = t * 3.5;
          const a = baseAngle + t * 0.14;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r * 0.6;
          if (t === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.lineWidth = 14;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  cachedEarthClouds = new THREE.CanvasTexture(canvas);
  cachedEarthClouds.wrapS = THREE.RepeatWrapping;
  cachedEarthClouds.generateMipmaps = true;
  return cachedEarthClouds;
}

