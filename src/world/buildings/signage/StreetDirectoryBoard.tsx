import React, { useMemo } from 'react';
import * as THREE from 'three';

interface StreetDirectoryBoardProps {
  title: string;
  subtitle: string;
  department?: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  accentColor?: string;
}

// Memory-cached canvas texture for crisp offline street directory boards
const directoryTextureCache = new Map<string, THREE.CanvasTexture>();

function getDirectoryTexture(
  title: string,
  subtitle: string,
  department: string,
  accentColor: string
): THREE.CanvasTexture {
  const cacheKey = `${title}|${subtitle}|${department}|${accentColor}`;
  if (directoryTextureCache.has(cacheKey)) {
    return directoryTextureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 1. Dark executive brushed titanium panel background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 768);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#1e293b');
    bgGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 768);

    // 2. Outer beveled chamfer border
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, 496, 752);

    // Subtle inner glowing border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, 480, 736);

    // 3. Top Accent Header Banner
    ctx.fillStyle = accentColor;
    ctx.fillRect(20, 20, 472, 10);

    // Top District Badge
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('METROPOLITAN PORTFOLIO DISTRICT', 256, 70);

    // Divider Line
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 95);
    ctx.lineTo(472, 95);
    ctx.stroke();

    // 4. Building Icon / Glyph Frame
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(206, 125, 100, 100, 16);
    ctx.fill();
    ctx.stroke();

    // Stylized Building Landmark Emblem
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(230, 165, 52, 45);
    ctx.fillStyle = accentColor;
    ctx.fillRect(242, 145, 28, 20);
    // Windows on emblem
    ctx.fillStyle = '#090d16';
    ctx.fillRect(236, 175, 10, 10);
    ctx.fillRect(252, 175, 10, 10);
    ctx.fillRect(268, 175, 10, 10);
    ctx.fillRect(236, 192, 10, 10);
    ctx.fillRect(252, 192, 10, 10);
    ctx.fillRect(268, 192, 10, 10);

    // 5. Primary Landmark Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 40px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 12;
    ctx.fillText(title, 256, 285);
    ctx.shadowBlur = 0;

    // 6. Subtitle / Discipline
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
    ctx.fillText(subtitle, 256, 335);

    // 7. Department / Function Tag
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 20px system-ui, -apple-system, sans-serif';
    ctx.fillText(department, 256, 375);

    // Divider
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 410);
    ctx.lineTo(462, 410);
    ctx.stroke();

    // 8. Public Access & Directory Points
    const directoryItems = [
      '• Level 1: Public Reception & Atrium',
      '• Level 2: Engineering & Development Suites',
      '• Level 3: Architecture & Systems Research',
      '• Executive Sky Terrace & Observation Deck',
    ];

    ctx.textAlign = 'left';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '19px system-ui, -apple-system, sans-serif';
    directoryItems.forEach((item, idx) => {
      ctx.fillText(item, 60, 460 + idx * 42);
    });

    // 9. Bottom Footer: Pedestrian Wayfinding Badge
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 650);
    ctx.lineTo(462, 650);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
    ctx.fillText('PEDESTRIAN WAYFINDING • ACCESSIBLE ENTRANCE', 256, 685);

    ctx.fillStyle = accentColor;
    ctx.font = '14px monospace';
    ctx.fillText('PORTFOLIO DOWNTOWN DISTRICT // GPS VERIFIED', 256, 715);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  directoryTextureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Phase 2.2.1 — Reusable Street-Level Building Directory Board
 * Standing physical pedestal pylon placed on the sidewalk near building entrances.
 * Clean modern American urban design with zero network overhead.
 */
export const StreetDirectoryBoard: React.FC<StreetDirectoryBoardProps> = ({
  title,
  subtitle,
  department = 'PORTFOLIO RESEARCH FACILITY',
  position,
  rotation = [0, 0, 0],
  accentColor = '#38bdf8',
}) => {
  const texture = useMemo(
    () => getDirectoryTexture(title, subtitle, department, accentColor),
    [title, subtitle, department, accentColor]
  );

  const materials = useMemo(() => {
    return {
      darkAnodizedMetal: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.35,
        metalness: 0.85,
      }),
      granitePlinth: new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.8,
        metalness: 0.15,
      }),
      stainlessPosts: new THREE.MeshStandardMaterial({
        color: '#94a3b8',
        roughness: 0.25,
        metalness: 0.9,
      }),
      signFace: new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.4,
        metalness: 0.2,
      }),
      acrylicCover: new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        roughness: 0.1,
        transmission: 0.9,
        transparent: true,
        opacity: 0.35,
        ior: 1.49,
      }),
      topLuminaire: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: accentColor,
        emissiveIntensity: 1.5,
      }),
    };
  }, [texture, accentColor]);

  return (
    <group position={position} rotation={rotation}>
      {/* 1. Base Granite Plinth (rests on sidewalk at ground level) */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[0.92, 0.12, 0.36]} />
        <primitive object={materials.granitePlinth} attach="material" />
      </mesh>

      {/* Stainless Base Flange Plate */}
      <mesh position={[0, 0.125, 0]}>
        <boxGeometry args={[0.84, 0.015, 0.28]} />
        <primitive object={materials.stainlessPosts} attach="material" />
      </mesh>

      {/* 2. Twin Structural Vertical Stanchions */}
      <mesh position={[-0.36, 0.75, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.25, 16]} />
        <primitive object={materials.stainlessPosts} attach="material" />
      </mesh>
      <mesh position={[0.36, 0.75, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.25, 16]} />
        <primitive object={materials.stainlessPosts} attach="material" />
      </mesh>

      {/* 3. Main Directory Tablet Frame (Oriented at comfortable reading angle) */}
      <group position={[0, 1.05, 0]}>
        {/* Dark Metal Enclosure Shell */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.76, 1.05, 0.08]} />
          <primitive object={materials.darkAnodizedMetal} attach="material" />
        </mesh>

        {/* Front Information Display Face */}
        <mesh position={[0, 0, 0.042]}>
          <planeGeometry args={[0.70, 0.98]} />
          <primitive object={materials.signFace} attach="material" />
        </mesh>

        {/* Clear Protective Acrylic Glass Face */}
        <mesh position={[0, 0, 0.046]}>
          <planeGeometry args={[0.70, 0.98]} />
          <primitive object={materials.acrylicCover} attach="material" />
        </mesh>

        {/* Top Hood Overhead LED Luminaire Trough */}
        <mesh position={[0, 0.54, 0.04]}>
          <boxGeometry args={[0.78, 0.04, 0.12]} />
          <primitive object={materials.darkAnodizedMetal} attach="material" />
        </mesh>
        {/* Downward LED Emitter Strip */}
        <mesh position={[0, 0.518, 0.06]}>
          <boxGeometry args={[0.68, 0.01, 0.02]} />
          <primitive object={materials.topLuminaire} attach="material" />
        </mesh>
      </group>
    </group>
  );
};
