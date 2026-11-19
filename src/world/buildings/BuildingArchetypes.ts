import * as THREE from 'three';

const textureCache = new Map<string, THREE.Texture>();

function createOffscreenCanvas(width: number, height: number): HTMLCanvasElement | null {
  if (typeof window === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * 1. Modern High-Rise Glass Curtain Wall Texture
 * Deep architectural solar-tinted glass (sky-reflecting azure) with anodized aluminum mullions,
 * horizontal spandrels, warm office interior lighting, and venetian blinds.
 * Realistic daytime appearance matching corporate office towers.
 */
export function getCurtainWallGlassTexture(): THREE.CanvasTexture {
  const key = 'arch_curtain_wall_glass_v4';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Clear daylight architectural tinted glass foundation (slate / charcoal #1e293b)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 512, 512);

  const floors = 6;
  const bays = 6;
  const floorH = 512 / floors;
  const bayW = 512 / bays;
  const spandrelH = floorH * 0.24; // Opaque floor spandrel band

  for (let r = 0; r < floors; r++) {
    const yTop = r * floorH;
    const yWindow = yTop + spandrelH;
    const windowH = floorH - spandrelH;

    // Crisp spandrel glass panel (structural floor slab cover)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, yTop, 512, spandrelH);

    // Aluminum spandrel dividing reveal line
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, yWindow);
    ctx.lineTo(512, yWindow);
    ctx.stroke();

    for (let c = 0; c < bays; c++) {
      const xLeft = c * bayW;

      // Realistic office interior lighting: ~35% warm illuminated offices, rest daylight sky reflection
      const isLit = (r * 7 + c * 11) % 3 === 0;
      const isWarm = (r + c) % 2 === 0;

      if (isLit) {
        // Soft warm incandescent office ceiling lighting
        ctx.fillStyle = isWarm ? '#fef3c7' : '#e0f2fe';
        ctx.fillRect(xLeft + 2, yWindow + 2, bayW - 4, windowH - 4);

        // Horizontal venetian blinds at varying heights
        const blindDrop = ((r * 3 + c * 5) % 5) * 0.16 + 0.15;
        ctx.fillStyle = 'rgba(71, 85, 105, 0.7)';
        ctx.fillRect(xLeft + 2, yWindow + 2, bayW - 4, (windowH - 4) * blindDrop);

        // Soft glow gradient down into office
        const grad = ctx.createLinearGradient(0, yWindow, 0, yWindow + windowH);
        grad.addColorStop(0, 'rgba(254, 243, 199, 0.45)');
        grad.addColorStop(1, 'rgba(30, 41, 59, 0.7)');
        ctx.fillStyle = grad;
        ctx.fillRect(xLeft + 2, yWindow + 2, bayW - 4, windowH - 4);
      } else {
        // Daytime neutral sky reflection gradient on reflective glazing
        const grad = ctx.createLinearGradient(0, yWindow, 0, yWindow + windowH);
        grad.addColorStop(0, '#475569'); // Upper sky reflection
        grad.addColorStop(1, '#1e293b'); // Lower reflection
        ctx.fillStyle = grad;
        ctx.fillRect(xLeft + 2, yWindow + 2, bayW - 4, windowH - 4);

        // Occasional partly drawn blinds
        if ((r * 2 + c) % 3 === 0) {
          ctx.fillStyle = 'rgba(100, 116, 139, 0.45)';
          ctx.fillRect(xLeft + 2, yWindow + 2, bayW - 4, (windowH - 4) * 0.35);
        }
      }
    }
  }

  // Anodized Silver Aluminum Structural Mullions
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.0;
  for (let x = 0; x <= 512; x += bayW) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += floorH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1); // Exact 1:1 floor mapping (~3.5m per floor)
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

/**
 * 2. Bronze / Slate Commercial Tower Glazing Texture
 * Rich dark bronze anodized framing with deep solar tinted glass
 */
export function getBronzeCurtainGlassTexture(): THREE.CanvasTexture {
  const key = 'arch_bronze_curtain_v3';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1c1917';
  ctx.fillRect(0, 0, 512, 512);

  const floors = 6;
  const bays = 8;
  const floorH = 512 / floors;
  const bayW = 512 / bays;

  for (let r = 0; r < floors; r++) {
    for (let c = 0; c < bays; c++) {
      const isLit = (r * 5 + c * 3) % 4 === 0;
      if (isLit) {
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(c * bayW + 2, r * floorH + 3, bayW - 4, floorH - 6);
        ctx.fillStyle = 'rgba(41, 37, 36, 0.65)';
        ctx.fillRect(c * bayW + 2, r * floorH + 3, bayW - 4, (floorH - 6) * 0.45);
      } else {
        ctx.fillStyle = '#292524';
        ctx.fillRect(c * bayW + 2, r * floorH + 3, bayW - 4, floorH - 6);
      }
    }
  }

  // Dark Bronze Aluminum Mullions
  ctx.strokeStyle = '#78716c';
  ctx.lineWidth = 2.5;
  for (let x = 0; x <= 512; x += bayW) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += floorH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1); // Real-world floor spacing
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

/**
 * 3. Authentic Chicago / American Urban Red-Brown Brick Texture
 * Staggered running bond with natural tone variations, white limestone lintels/sills,
 * and punched double-hung windows with dark frames and subtle reflections.
 */
export function getUrbanBrickTexture(): THREE.CanvasTexture {
  const key = 'arch_urban_brick_v3';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Rich American red-brown masonry foundation
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(0, 0, 512, 512);

  // Staggered brick courses
  const rowH = 16;
  const brickW = 32;

  ctx.strokeStyle = '#d6d3d1'; // Sand mortar
  ctx.lineWidth = 1.0;

  for (let y = 0; y <= 512; y += rowH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    const isStaggered = (y / rowH) % 2 === 1;
    const startX = isStaggered ? brickW / 2 : 0;

    for (let x = startX; x <= 512; x += brickW) {
      // Natural color variance across individual bricks
      const rand = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const frac = rand - Math.floor(rand);
      if (frac < 0.3) {
        ctx.fillStyle = '#852b1b'; // Dark burgundy
        ctx.fillRect(x + 1, y + 1, brickW - 2, rowH - 2);
      } else if (frac < 0.6) {
        ctx.fillStyle = '#b45309'; // Warm amber/orange
        ctx.fillRect(x + 1, y + 1, brickW - 2, rowH - 2);
      } else if (frac < 0.8) {
        ctx.fillStyle = '#78350f'; // Earthy burnt umber
        ctx.fillRect(x + 1, y + 1, brickW - 2, rowH - 2);
      }

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + rowH);
      ctx.stroke();
    }
  }

  // Punched architectural windows with limestone headers & sills
  const winCols = 8;
  const winRows = 8;
  const colW = 512 / winCols;
  const rowStep = 512 / winRows;

  for (let r = 0; r < winRows; r++) {
    for (let c = 0; c < winCols; c++) {
      const wx = c * colW + 14;
      const wy = r * rowStep + 12;
      const ww = colW - 28;
      const wh = rowStep - 24;

      // White limestone header / lintel
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(wx - 2, wy - 4, ww + 4, 4);

      // White limestone sill
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(wx - 3, wy + wh, ww + 6, 4);

      // Dark bronze window frame
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(wx, wy, ww, wh);

      // Deep glass pane with soft reflection
      const isLit = (r * 3 + c * 5) % 4 === 0;
      if (isLit) {
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(wx + 2, wy + 2, ww - 4, wh - 4);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
        ctx.fillRect(wx + 2, wy + 2, ww - 4, (wh - 4) * 0.5);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(wx + 2, wy + 2, ww - 4, wh - 4);
        // Glazing diagonal highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.fillRect(wx + 3, wy + 3, (ww - 6) * 0.65, (wh - 6) * 0.35);
      }

      // Center sash dividing bar
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(wx, wy + wh / 2);
      ctx.lineTo(wx + ww, wy + wh / 2);
      ctx.stroke();
    }
  }

  // Horizontal stone belt courses / cornices
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, 0, 512, 6);
  ctx.fillRect(0, 252, 512, 6);
  ctx.fillRect(0, 506, 512, 6);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2); // Realistic masonry scale
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

/**
 * 4. Architectural Limestone Precast Concrete Panels Texture
 * Light warm limestone tone with grooved expansion joints and ribbon windows.
 */
export function getFlutedStoneTexture(): THREE.CanvasTexture {
  const key = 'arch_fluted_stone_v3';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Warm limestone base
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, 256, 256);

  // Vertical fluted architectural ribs
  const ribW = 16;
  for (let x = 0; x < 256; x += ribW) {
    // Rib shadow
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x + ribW - 3, 0, 3, 256);
    // Rib highlight
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 1, 0, 2, 256);
  }

  // Horizontal stone joint reveals
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  for (let y = 0; y <= 256; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

/**
 * 4b. Architectural Limestone Precast Concrete Panels Texture
 * Light warm limestone tone with grooved expansion joints and ribbon windows.
 */
export function getPrecastConcreteTexture(): THREE.CanvasTexture {
  const key = 'arch_precast_concrete_v4';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Warm architectural limestone / concrete tone (#e2e8f0)
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, 0, 512, 512);

  // Micro-texture grain
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 8;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  // Architectural panel joint reveals
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  for (let x = 0; x <= 512; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Recessed ribbon window bands with dark bronze frames
  for (let py = 24; py < 512; py += 128) {
    for (let px = 16; px < 512; px += 128) {
      // Dark frame
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px, py, 96, 80);

      // Glass pane
      const isLit = (py + px) % 256 === 0;
      if (isLit) {
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(px + 3, py + 3, 90, 74);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
        ctx.fillRect(px + 3, py + 3, 90, 32);
      } else {
        ctx.fillStyle = '#334155';
        ctx.fillRect(px + 3, py + 3, 90, 74);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(px + 5, py + 5, 80, 24);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

/**
 * 5. Ground-Floor Commercial Storefront Texture Atlas
 * Authentic American street-level retail with glass storefronts, illuminated interiors,
 * commercial signboards with fictional business names, doors, and kickplates.
 */
export function getStorefrontTexture(): THREE.CanvasTexture {
  const key = 'arch_storefront_atlas_v3';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(1024, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Dark granite / bronze ground-floor framing
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 1024, 256);

  const shops = [
    { name: 'ARC INNOVATION LOBBY', type: 'corporate', color: '#0f172a', light: '#fef3c7' },
    { name: 'METRO COFFEE ROASTERS', type: 'cafe', color: '#166534', light: '#fef08a' },
    { name: 'STATE STREET BOOKS', type: 'bookstore', color: '#854d0e', light: '#fed7aa' },
    { name: 'BEACON PHARMACY & DELI', type: 'pharmacy', color: '#991b1b', light: '#fef9c3' },
  ];

  const shopW = 1024 / shops.length;

  shops.forEach((shop, idx) => {
    const sx = idx * shopW;

    // 1. Signboard Fascia (Top 48px)
    ctx.fillStyle = shop.color;
    ctx.fillRect(sx + 8, 10, shopW - 16, 44);
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx + 10, 12, shopW - 20, 40);

    // Business Name Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(shop.name, sx + shopW / 2, 32);

    // 2. Large Glazed Display Windows
    const winTop = 60;
    const winH = 168;
    const winW = shopW - 24;

    // Display window interior warmth
    ctx.fillStyle = shop.light;
    ctx.fillRect(sx + 12, winTop, winW, winH);

    if (shop.type === 'corporate') {
      // Warm vertical oak wood slats on back wall (matching reference photo 2)
      ctx.fillStyle = '#b45309';
      for (let wx = sx + 20; wx < sx + winW - 20; wx += 8) {
        ctx.fillRect(wx, winTop + 10, 4, winH - 20);
      }
      // Illuminated corporate reception desk & logo
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(sx + shopW / 2 - 36, winTop + winH - 45, 72, 30);
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 14px "Segoe UI", sans-serif';
      ctx.fillText('RECEPTION', sx + shopW / 2, winTop + winH - 28);
    } else {
      // Interior display silhouettes (shelves, tables, displays)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(sx + 24, winTop + winH - 45, winW - 80, 40);
      // Interior warm ceiling lights
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(sx + 60, winTop + 24, 7, 0, Math.PI * 2);
      ctx.arc(sx + shopW - 60, winTop + 24, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Double Glass Commercial Entrance Door / Revolving Door
    const doorW = 58;
    const doorX = sx + shopW - 74;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(doorX, winTop, doorW, winH + 18);
    // Door glass pane
    ctx.fillStyle = shop.light;
    ctx.fillRect(doorX + 4, winTop + 6, doorW - 8, winH - 10);
    // Stainless steel push bars
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(doorX + 8, winTop + winH / 2, doorW - 16, 4);

    // 4. Aluminum storefront mullion dividers
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(sx + 12, winTop, winW, winH);
    ctx.beginPath();
    ctx.moveTo(sx + shopW / 2 - 10, winTop);
    ctx.lineTo(sx + shopW / 2 - 10, winTop + winH);
    ctx.stroke();

    // 5. Polished Stone Base Kickplate
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(sx + 12, 232, shopW - 24, 20);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

/**
 * 6. Residential Balconies & Apartment Windows Texture
 */
export function getResidentialApartmentTexture(): THREE.CanvasTexture {
  const key = 'arch_residential_apt_v4';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Warm residential brown/buff brick base
  ctx.fillStyle = '#78350f';
  ctx.fillRect(0, 0, 512, 512);

  const floors = 6;
  const bays = 6;
  const floorH = 512 / floors;
  const bayW = 512 / bays;

  for (let r = 0; r < floors; r++) {
    for (let c = 0; c < bays; c++) {
      const bx = c * bayW + 8;
      const by = r * floorH + 8;
      const bw = bayW - 16;
      const bh = floorH - 16;

      // Stone window frame
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(bx, by, bw, bh);

      // Window glass
      const isLit = (r * 2 + c * 3) % 3 === 0;
      ctx.fillStyle = isLit ? '#fef08a' : '#1e293b';
      ctx.fillRect(bx + 2, by + 2, bw - 4, bh - 4);

      // Curtains / blinds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.fillRect(bx + 2, by + 2, 8, bh - 4);
      ctx.fillRect(bx + bw - 10, by + 2, 8, bh - 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

/**
 * 7. Rooftop Mechanical Equipment (HVAC louvers, chiller coils)
 */
export function getRooftopMechanicalTexture(): THREE.CanvasTexture {
  const key = 'arch_rooftop_mechanical_v3';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Galvanized steel gray
  ctx.fillStyle = '#475569';
  ctx.fillRect(0, 0, 256, 256);

  // Horizontal ventilation louver grates
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  for (let y = 6; y < 256; y += 10) {
    ctx.beginPath();
    ctx.moveTo(6, y);
    ctx.lineTo(250, y);
    ctx.stroke();
  }

  // Vertical support ribs
  ctx.fillStyle = '#64748b';
  ctx.fillRect(64, 0, 8, 256);
  ctx.fillRect(128, 0, 8, 256);
  ctx.fillRect(192, 0, 8, 256);

  // Access door outline
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 40, 40, 180);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

/**
 * 8. Traditional Cedar Stave Rooftop Water Tower Texture
 * Classic American wooden rooftop water tank with black steel bands.
 */
export function getWaterTowerWoodTexture(): THREE.CanvasTexture {
  const key = 'arch_water_tower_wood_v3';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Weathered cedar wood base
  ctx.fillStyle = '#78553d';
  ctx.fillRect(0, 0, 256, 256);

  // Vertical wood staves
  const staveW = 8;
  for (let x = 0; x < 256; x += staveW) {
    ctx.fillStyle = (x / staveW) % 2 === 0 ? '#63442f' : '#8a6246';
    ctx.fillRect(x, 0, staveW - 1, 256);
    ctx.strokeStyle = '#3d281a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }

  // Black iron cinch hoops
  const hoopYs = [28, 72, 120, 168, 216];
  hoopYs.forEach((hy) => {
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, hy, 256, 6);
    // Hoop turnbuckles
    ctx.fillStyle = '#71717a';
    ctx.fillRect(60, hy - 2, 10, 10);
    ctx.fillRect(180, hy - 2, 10, 10);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(4, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

/**
 * 9. Parking Lot Surface Texture with Painted White Stalls & Yellow Stalls
 */
export function getParkingLotTexture(): THREE.CanvasTexture {
  const key = 'arch_parking_lot_v3';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Dark weathered asphalt surface
  ctx.fillStyle = '#262626';
  ctx.fillRect(0, 0, 512, 512);

  // Aggregate specks
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 16;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  // White parking stall lines
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 3.5;
  const stallW = 48;

  // Row 1 (North bays)
  for (let x = 32; x < 480; x += stallW) {
    ctx.beginPath();
    ctx.moveTo(x, 24);
    ctx.lineTo(x, 180);
    ctx.stroke();
  }

  // Row 2 (South bays)
  for (let x = 32; x < 480; x += stallW) {
    ctx.beginPath();
    ctx.moveTo(x, 332);
    ctx.lineTo(x, 488);
    ctx.stroke();
  }

  // Accessible handicap stall in yellow
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(32, 24);
  ctx.lineTo(32, 180);
  ctx.moveTo(32 + stallW, 24);
  ctx.lineTo(32 + stallW, 180);
  ctx.stroke();

  // White directional lane arrows
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(256, 230);
  ctx.lineTo(240, 270);
  ctx.lineTo(250, 270);
  ctx.lineTo(250, 300);
  ctx.lineTo(262, 300);
  ctx.lineTo(262, 270);
  ctx.lineTo(272, 270);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

/**
 * 10. Street Sign Atlas Texture (American Street Name Blades & Warning Signs)
 */
export function getStreetSignAtlasTexture(): THREE.CanvasTexture {
  const key = 'arch_street_sign_atlas_v3';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 256);

  // Sign 1: Green MUTCD Street Name Blade "GRAND AVE"
  ctx.fillStyle = '#15803d'; // Highway green
  ctx.fillRect(10, 10, 240, 50);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, 236, 46);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GRAND AVE', 130, 35);

  // Sign 2: Green MUTCD Street Name Blade "BROADWAY"
  ctx.fillStyle = '#15803d';
  ctx.fillRect(262, 10, 240, 50);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(264, 12, 236, 46);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
  ctx.fillText('BROADWAY', 382, 35);

  // Sign 3: Standard White "SPEED LIMIT 25"
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(20, 80, 80, 110);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(22, 82, 76, 106);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 11px "Segoe UI", Arial, sans-serif';
  ctx.fillText('SPEED', 60, 100);
  ctx.fillText('LIMIT', 60, 115);
  ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif';
  ctx.fillText('25', 60, 155);

  // Sign 4: Red Octagonal "STOP"
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  const ox = 180;
  const oy = 135;
  const r = 48;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 + Math.PI / 8;
    const px = ox + r * Math.cos(angle);
    const py = oy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
  ctx.fillText('STOP', ox, oy);

  // Sign 5: Black & White "ONE WAY" Arrow
  ctx.fillStyle = '#000000';
  ctx.fillRect(270, 90, 150, 45);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(280, 112);
  ctx.lineTo(390, 112);
  ctx.lineTo(390, 100);
  ctx.lineTo(412, 112);
  ctx.lineTo(390, 125);
  ctx.lineTo(390, 116);
  ctx.lineTo(280, 116);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
  ctx.fillText('ONE WAY', 335, 113);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

/**
 * PBR City Shared Materials Container
 */
export interface CityMaterials {
  curtainGlass: THREE.MeshPhysicalMaterial;
  corporateGlass: THREE.MeshPhysicalMaterial;
  precastConcrete: THREE.MeshStandardMaterial;
  urbanBrick: THREE.MeshStandardMaterial;
  flutedStone: THREE.MeshStandardMaterial;
  storefront: THREE.MeshStandardMaterial;
  residentialApartment: THREE.MeshStandardMaterial;
  structuralMetal: THREE.MeshStandardMaterial;
  rooftopEquipment: THREE.MeshStandardMaterial;
  waterTowerWood: THREE.MeshStandardMaterial;
  parkingLot: THREE.MeshStandardMaterial;
  parkGrass: THREE.MeshStandardMaterial;
  awningNavy: THREE.MeshStandardMaterial;
  awningBurgundy: THREE.MeshStandardMaterial;
  awningGreen: THREE.MeshStandardMaterial;
  streetSign: THREE.MeshStandardMaterial;
  trafficSignalYellow: THREE.MeshStandardMaterial;
  fireHydrantRed: THREE.MeshStandardMaterial;
  castIronBlack: THREE.MeshStandardMaterial;
  windowFrameDark: THREE.MeshStandardMaterial;
  windowGlassReflective: THREE.MeshPhysicalMaterial;
  stoneSill: THREE.MeshStandardMaterial;
  corniceMolding: THREE.MeshStandardMaterial;
  balconyRailing: THREE.MeshStandardMaterial;
  parkingLouver: THREE.MeshStandardMaterial;
  hvacChillerBody: THREE.MeshStandardMaterial;
  hvacFanGrill: THREE.MeshStandardMaterial;
}

let sharedCityMaterials: CityMaterials | null = null;

export function getSharedCityMaterials(): CityMaterials {
  if (sharedCityMaterials) return sharedCityMaterials;

  const curtainGlassTex = getCurtainWallGlassTexture();
  const bronzeGlassTex = getBronzeCurtainGlassTexture();
  const brickTex = getUrbanBrickTexture();
  const concreteTex = getPrecastConcreteTexture();
  const storefrontTex = getStorefrontTexture();
  const residentialTex = getResidentialApartmentTexture();
  const rooftopTex = getRooftopMechanicalTexture();
  const woodTankTex = getWaterTowerWoodTexture();
  const parkingTex = getParkingLotTexture();
  const signTex = getStreetSignAtlasTexture();
  const flutedTex = getFlutedStoneTexture();

  sharedCityMaterials = {
    // 1. Clear daytime sky-reflecting curtain wall glass (PBR physical glass with restrained neutral slate reflection)
    curtainGlass: new THREE.MeshPhysicalMaterial({
      color: '#475569',
      map: curtainGlassTex,
      roughness: 0.12,
      metalness: 0.20,
      reflectivity: 0.92,
      clearcoat: 0.85,
      clearcoatRoughness: 0.06,
    }),

    // 2. Tinted deep bronze/charcoal corporate glass
    corporateGlass: new THREE.MeshPhysicalMaterial({
      color: '#334155',
      map: bronzeGlassTex,
      roughness: 0.15,
      metalness: 0.25,
      reflectivity: 0.90,
      clearcoat: 0.80,
      clearcoatRoughness: 0.08,
    }),

    // 3. Warm architectural limestone precast concrete (dignified warm stone, zero overexposure)
    precastConcrete: new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      map: concreteTex,
      roughness: 0.82,
      metalness: 0.02,
    }),

    // 4. Authentic Chicago terracotta red/brown brick
    urbanBrick: new THREE.MeshStandardMaterial({
      color: '#9a3412',
      map: brickTex,
      roughness: 0.85,
      metalness: 0.02,
    }),

    // 5. White architectural stone / fluted trim
    flutedStone: new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      map: flutedTex,
      roughness: 0.75,
      metalness: 0.04,
    }),

    // 6. Ground-floor commercial storefront display bays
    storefront: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      map: storefrontTex,
      roughness: 0.22,
      metalness: 0.20,
    }),

    // 7. Residential apartment facade
    residentialApartment: new THREE.MeshStandardMaterial({
      color: '#a8a29e',
      map: residentialTex,
      roughness: 0.82,
      metalness: 0.02,
    }),

    // 8. Anodized aluminum & architectural structural steel
    structuralMetal: new THREE.MeshStandardMaterial({
      color: '#475569',
      roughness: 0.35,
      metalness: 0.85,
    }),

    // 9. Galvanized steel rooftop HVAC & elevator bulkheads
    rooftopEquipment: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      map: rooftopTex,
      roughness: 0.65,
      metalness: 0.55,
    }),

    // 10. Rooftop cedar water tower wood
    waterTowerWood: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      map: woodTankTex,
      roughness: 0.88,
      metalness: 0.08,
    }),

    // 11. Parking lot asphalt with stall lines
    parkingLot: new THREE.MeshStandardMaterial({
      map: parkingTex,
      roughness: 0.9,
      metalness: 0.03,
    }),

    // 12. Natural park lawn turf
    parkGrass: new THREE.MeshStandardMaterial({
      color: '#365314', // Natural rich forest-olive green
      roughness: 0.94,
      metalness: 0.02,
    }),

    // 13. Fabric Awnings (Navy Blue, Burgundy, Hunter Green)
    awningNavy: new THREE.MeshStandardMaterial({
      color: '#1e3a8a',
      roughness: 0.82,
      metalness: 0.05,
    }),
    awningBurgundy: new THREE.MeshStandardMaterial({
      color: '#831843',
      roughness: 0.82,
      metalness: 0.05,
    }),
    awningGreen: new THREE.MeshStandardMaterial({
      color: '#14532d',
      roughness: 0.82,
      metalness: 0.05,
    }),

    // 14. Street Signs & Traffic Infrastructure
    streetSign: new THREE.MeshStandardMaterial({
      map: signTex,
      roughness: 0.45,
      metalness: 0.4,
    }),
    trafficSignalYellow: new THREE.MeshStandardMaterial({
      color: '#eab308', // Highway traffic yellow
      roughness: 0.4,
      metalness: 0.2,
    }),
    fireHydrantRed: new THREE.MeshStandardMaterial({
      color: '#dc2626', // Safety red
      roughness: 0.35,
      metalness: 0.3,
    }),
    castIronBlack: new THREE.MeshStandardMaterial({
      color: '#18181b', // Matte black cast iron
      roughness: 0.6,
      metalness: 0.65,
    }),
    windowFrameDark: new THREE.MeshStandardMaterial({
      color: '#1e293b', // Dark bronze/charcoal aluminum frame
      roughness: 0.38,
      metalness: 0.72,
    }),
    windowGlassReflective: new THREE.MeshPhysicalMaterial({
      color: '#1e293b', // Deep reflective solar tint (neutral PBR reflections, zero artificial cyan)
      roughness: 0.10,
      metalness: 0.15,
      reflectivity: 0.95,
      clearcoat: 0.90,
      clearcoatRoughness: 0.05,
    }),
    stoneSill: new THREE.MeshStandardMaterial({
      color: '#cbd5e1', // Projecting limestone sill & belt course
      roughness: 0.75,
      metalness: 0.05,
    }),
    corniceMolding: new THREE.MeshStandardMaterial({
      color: '#e2e8f0', // Projecting roof cornice molding
      roughness: 0.68,
      metalness: 0.05,
    }),
    balconyRailing: new THREE.MeshStandardMaterial({
      color: '#0f172a', // Architectural painted steel / wrought iron railing
      roughness: 0.45,
      metalness: 0.85,
    }),
    parkingLouver: new THREE.MeshStandardMaterial({
      color: '#64748b', // Aluminum ventilation louvers for parking structure
      roughness: 0.35,
      metalness: 0.80,
    }),
    hvacChillerBody: new THREE.MeshStandardMaterial({
      color: '#94a3b8', // Galvanized commercial sheet metal
      roughness: 0.52,
      metalness: 0.75,
    }),
    hvacFanGrill: new THREE.MeshStandardMaterial({
      color: '#090d16', // Dark recessed fan grill
      roughness: 0.65,
      metalness: 0.40,
    }),
  };

  return sharedCityMaterials;
}
