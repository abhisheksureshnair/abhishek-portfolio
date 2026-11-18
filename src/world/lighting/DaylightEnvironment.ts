import * as THREE from 'three';

let cachedEnvironmentTexture: THREE.Texture | null = null;

/**
 * Procedural PBR Daylight Environment Map
 * Creates an equirectangular sky canvas depicting a natural American daylight sky:
 * - Deep azure zenith (#0284c7)
 * - Clean atmospheric horizon haze (#bae6fd to #e0f2fe)
 * - Soft volumetric white cumulus clouds
 * - Radiant warm sun disc (#fffbeb)
 * - Urban ground reflection bounce (#64748b to #475569)
 * 
 * Provides physically based image-based lighting (IBL) for all PBR glass,
 * metals, stone, and brick materials with zero external network downloads.
 */
export function getDaylightEquirectangularTexture(): THREE.CanvasTexture {
  if (cachedEnvironmentTexture) return cachedEnvironmentTexture as THREE.CanvasTexture;

  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Sky Gradient (Zenith down to Horizon)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.52);
  skyGrad.addColorStop(0.0, '#0369a1'); // Deep zenith blue
  skyGrad.addColorStop(0.35, '#0284c7'); // Natural azure sky
  skyGrad.addColorStop(0.70, '#38bdf8'); // Clear sky
  skyGrad.addColorStop(0.92, '#bae6fd'); // Atmospheric sky haze
  skyGrad.addColorStop(1.0, '#e0f2fe'); // Horizon boundary
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height * 0.52);

  // 2. Soft Realistic Cumulus Clouds
  ctx.save();
  for (let c = 0; c < 24; c++) {
    const cx = (c * 73 + 37) % width;
    const cy = 60 + ((c * 47) % 140);
    const radX = 40 + ((c * 19) % 60);
    const radY = 14 + ((c * 11) % 22);

    const cloudGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radX);
    cloudGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    cloudGrad.addColorStop(0.6, 'rgba(240, 249, 255, 0.25)');
    cloudGrad.addColorStop(1, 'rgba(224, 242, 254, 0.0)');
    ctx.fillStyle = cloudGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radX, radY, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Radiant Sun Disc (South Sky, azimuth ~210 deg, elevation ~45 deg)
  const sunX = width * 0.62;
  const sunY = height * 0.22;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 70);
  sunGrad.addColorStop(0, '#ffffff');
  sunGrad.addColorStop(0.15, '#fffbeb');
  sunGrad.addColorStop(0.4, 'rgba(254, 243, 199, 0.65)');
  sunGrad.addColorStop(0.7, 'rgba(253, 230, 138, 0.25)');
  sunGrad.addColorStop(1, 'rgba(253, 230, 138, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
  ctx.fill();

  // 4. Ground Reflection Bounce (Lower Hemisphere, Horizon to Nadir)
  const groundGrad = ctx.createLinearGradient(0, height * 0.52, 0, height);
  groundGrad.addColorStop(0.0, '#cbd5e1'); // Horizon haze blend
  groundGrad.addColorStop(0.15, '#94a3b8'); // Soft ambient ground reflection
  groundGrad.addColorStop(0.55, '#64748b'); // Urban asphalt & stone bounce
  groundGrad.addColorStop(1.0, '#475569'); // Nadir
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, height * 0.52, width, height * 0.48);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  cachedEnvironmentTexture = texture;
  return texture;
}

/**
 * Attaches the procedural environment map to the Three.js scene
 * using PMREMGenerator for high-quality PBR radiance convolutions.
 */
export function applyDaylightEnvironment(gl: THREE.WebGLRenderer, scene: THREE.Scene): void {
  const equirect = getDaylightEquirectangularTexture();
  const pmremGenerator = new THREE.PMREMGenerator(gl);
  pmremGenerator.compileEquirectangularShader();
  const envMap = pmremGenerator.fromEquirectangular(equirect).texture;
  scene.environment = envMap;
  pmremGenerator.dispose();
}
