import * as THREE from 'three';
import fs from 'fs';
import path from 'path';

// Node.js FileReader polyfill for Three.js GLTFExporter
class NodeFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    });
  }
}
global.FileReader = NodeFileReader;

const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');

const OUT_DIR = path.resolve(process.cwd(), 'public/models/nexus-city');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function exportToGLB(object3D, filename) {
  const exporter = new GLTFExporter();
  const filePath = path.join(OUT_DIR, filename);
  const glbBuffer = await exporter.parseAsync(object3D, { binary: true });
  fs.writeFileSync(filePath, Buffer.from(glbBuffer));
  const stats = fs.statSync(filePath);
  console.log(`✓ Exported ${filename} (${(stats.size / 1024).toFixed(1)} KB)`);
}

// Common Materials
const matDarkMetal = new THREE.MeshStandardMaterial({
  color: 0x111622,
  metalness: 0.85,
  roughness: 0.25,
});

const matDarkSteel = new THREE.MeshStandardMaterial({
  color: 0x181e2b,
  metalness: 0.9,
  roughness: 0.2,
});

const matConcrete = new THREE.MeshStandardMaterial({
  color: 0x1e2638,
  metalness: 0.3,
  roughness: 0.7,
});

const matCyanGlow = new THREE.MeshStandardMaterial({
  color: 0x00f0ff,
  emissive: 0x00f0ff,
  emissiveIntensity: 2.5,
  roughness: 0.1,
});

const matVioletGlow = new THREE.MeshStandardMaterial({
  color: 0x8b5cf6,
  emissive: 0x8b5cf6,
  emissiveIntensity: 2.2,
  roughness: 0.1,
});

const matAmberGlow = new THREE.MeshStandardMaterial({
  color: 0xf59e0b,
  emissive: 0xf59e0b,
  emissiveIntensity: 2.5,
  roughness: 0.1,
});

const matGlass = new THREE.MeshStandardMaterial({
  color: 0x0a1c2e,
  metalness: 0.9,
  roughness: 0.1,
  transparent: true,
  opacity: 0.85,
});

// ======================================================================
// 1. CENTRAL PLAZA MONUMENT (Spiral & Holographic Dais - Ref B & C)
// ======================================================================
async function createCentralMonument() {
  const root = new THREE.Group();
  root.name = 'CentralPlazaMonument';

  // Tier 1 Base Platform (Octagonal Stepped Dais)
  const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(9.2, 9.8, 0.45, 16), matConcrete);
  tier1.position.y = 0.225;
  root.add(tier1);

  // Tier 1 Glowing Step Trim
  const trim1 = new THREE.Mesh(new THREE.TorusGeometry(9.3, 0.06, 8, 32), matCyanGlow);
  trim1.rotation.x = Math.PI / 2;
  trim1.position.y = 0.45;
  root.add(trim1);

  // Tier 2 Middle Platform
  const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(7.4, 8.0, 0.45, 16), matDarkMetal);
  tier2.position.y = 0.675;
  root.add(tier2);

  // Tier 2 Glowing Trim
  const trim2 = new THREE.Mesh(new THREE.TorusGeometry(7.5, 0.05, 8, 32), matVioletGlow);
  trim2.rotation.x = Math.PI / 2;
  trim2.position.y = 0.9;
  root.add(trim2);

  // Tier 3 Top Pedestal
  const tier3 = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 5.8, 0.5, 12), matDarkSteel);
  tier3.position.y = 1.15;
  root.add(tier3);

  // Central Octagonal Plinth Core
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.6, 1.4, 8), matDarkMetal);
  plinth.position.y = 2.1;
  root.add(plinth);

  // 4 Stepped Radial Access Walkways / Ramps
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const ramp = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 4.2), matConcrete);
    ramp.position.set(Math.sin(angle) * 7.5, 0.2, Math.cos(angle) * 7.5);
    ramp.rotation.y = angle;
    root.add(ramp);

    // Cyan edge guide light on ramps
    const rampLight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 4.2), matCyanGlow);
    rampLight.position.set(Math.sin(angle) * 7.5 + Math.cos(angle) * 1.25, 0.42, Math.cos(angle) * 7.5 - Math.sin(angle) * 1.25);
    rampLight.rotation.y = angle;
    root.add(rampLight);
  }

  // Double-Spiral Helical Kinetic Arms (Ref B)
  const curvePoints1 = [];
  const curvePoints2 = [];
  const height = 9.0;
  const turns = 1.75;
  for (let t = 0; t <= 60; t++) {
    const u = t / 60;
    const theta = u * Math.PI * 2 * turns;
    const r = 2.8 - u * 1.1; // taper inwards
    const y = 2.8 + u * height;
    curvePoints1.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r));
    curvePoints2.push(new THREE.Vector3(Math.cos(theta + Math.PI) * r, y, Math.sin(theta + Math.PI) * r));
  }

  const curve1 = new THREE.CatmullRomCurve3(curvePoints1);
  const curve2 = new THREE.CatmullRomCurve3(curvePoints2);

  const spiralMesh1 = new THREE.Mesh(new THREE.TubeGeometry(curve1, 48, 0.22, 8, false), matDarkSteel);
  const spiralMesh2 = new THREE.Mesh(new THREE.TubeGeometry(curve2, 48, 0.22, 8, false), matDarkSteel);
  root.add(spiralMesh1);
  root.add(spiralMesh2);

  // Luminescent Inset Ribbon on both spirals
  const spiralGlow1 = new THREE.Mesh(new THREE.TubeGeometry(curve1, 48, 0.08, 6, false), matCyanGlow);
  const spiralGlow2 = new THREE.Mesh(new THREE.TubeGeometry(curve2, 48, 0.08, 6, false), matVioletGlow);
  root.add(spiralGlow1);
  root.add(spiralGlow2);

  // Floating Quantum Stabilizer Rings at different elevations (Ref C)
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.08, 8, 32), matCyanGlow);
  ring1.position.y = 5.5;
  ring1.rotation.x = Math.PI / 2;
  root.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.08, 8, 32), matVioletGlow);
  ring2.position.y = 8.2;
  ring2.rotation.x = Math.PI / 2 + 0.15;
  ring2.rotation.z = 0.2;
  root.add(ring2);

  const ring3 = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.07, 8, 24), matCyanGlow);
  ring3.position.y = 11.2;
  ring3.rotation.x = Math.PI / 2;
  root.add(ring3);

  // Central Levitating Polyhedron Core (Ref C Holographic Beacon)
  const corePoly = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), matCyanGlow);
  corePoly.position.y = 7.2;
  root.add(corePoly);

  const outerCage = new THREE.Mesh(new THREE.OctahedronGeometry(1.6, 0), matVioletGlow);
  outerCage.position.y = 7.2;
  root.add(outerCage);

  await exportToGLB(root, 'monument_central.glb');
}

// ======================================================================
// 2. LANDMARK TOWER (Nexus Grand Spire - Height 38m)
// ======================================================================
async function createLandmarkTower() {
  const root = new THREE.Group();
  root.name = 'BuildingLandmarkTower';

  // Base Podium (Ground to 8m, 16m x 16m)
  const podium = new THREE.Mesh(new THREE.BoxGeometry(16, 8, 16), matDarkMetal);
  podium.position.y = 4;
  root.add(podium);

  // Recessed Glass Atrium Entrance (South Face)
  const entranceVoid = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 2.5), matGlass);
  entranceVoid.position.set(0, 2.5, 7.2);
  root.add(entranceVoid);

  // Entrance Illuminated Canopy Cantilever
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 4), matDarkSteel);
  canopy.position.set(0, 5.2, 9.0);
  root.add(canopy);
  const canopyEdge = new THREE.Mesh(new THREE.BoxGeometry(12.2, 0.15, 0.2), matCyanGlow);
  canopyEdge.position.set(0, 5.2, 11.0);
  root.add(canopyEdge);

  // Entrance Columns
  for (let x of [-4.5, 4.5]) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 5.2, 8), matDarkSteel);
    col.position.set(x, 2.6, 9.8);
    root.add(col);
  }

  // Main Shaft (8m to 24m, 13m x 13m)
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(13, 16, 13), matDarkMetal);
  shaft.position.y = 16;
  root.add(shaft);

  // Vertical Architectural Aerodynamic Fins (4 Corners)
  for (let x of [-6.8, 6.8]) {
    for (let z of [-6.8, 6.8]) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 22, 0.8), matDarkSteel);
      fin.position.set(x, 17, z);
      root.add(fin);

      // Vertical neon accent channel running up each corner fin
      const neonChannel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 21.5, 0.85), matCyanGlow);
      neonChannel.position.set(x, 17, z);
      root.add(neonChannel);
    }
  }

  // Upper Shaft Tier 3 (24m to 32m, 10m x 10m)
  const upperShaft = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 10), matDarkMetal);
  upperShaft.position.y = 28;
  root.add(upperShaft);

  // Cantilevered Executive Sky Lounge (Projecting at 27m)
  const skyLounge = new THREE.Mesh(new THREE.BoxGeometry(13.5, 3.2, 6.5), matGlass);
  skyLounge.position.set(0, 27, 3.5);
  root.add(skyLounge);

  // Sky Lounge Roof Band
  const skyRoof = new THREE.Mesh(new THREE.BoxGeometry(13.8, 0.4, 6.8), matDarkSteel);
  skyRoof.position.set(0, 28.7, 3.5);
  root.add(skyRoof);

  // Rooftop Machinery Deck & Equipment (32m to 35m)
  const roofBox = new THREE.Mesh(new THREE.BoxGeometry(7, 3, 7), matDarkSteel);
  roofBox.position.y = 33.5;
  root.add(roofBox);

  // Dual Communications Satellite Dishes
  for (let x of [-2.2, 2.2]) {
    const dishMount = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 1.8, 6), matDarkMetal);
    dishMount.position.set(x, 35.5, -1.8);
    root.add(dishMount);

    const dish = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.45), matDarkSteel);
    dish.position.set(x, 36.4, -1.8);
    dish.rotation.x = -0.5;
    root.add(dish);
  }

  // Central Tower Needle Spire (35m to 42m)
  const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.45, 8.5, 8), matDarkSteel);
  spire.position.y = 38.5;
  root.add(spire);

  const spireBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), matVioletGlow);
  spireBeacon.position.y = 42.8;
  root.add(spireBeacon);

  await exportToGLB(root, 'building_landmark_tower.glb');
}

// ======================================================================
// 3. CURVED MEDIA MID-RISE (Ref B style, with curved screen & balconies)
// ======================================================================
async function createMediaMidRise() {
  const root = new THREE.Group();
  root.name = 'BuildingMediaMidRise';

  // Base building core (22m tall, 14m x 12m)
  const core = new THREE.Mesh(new THREE.BoxGeometry(14, 22, 12), matDarkMetal);
  core.position.y = 11;
  root.add(core);

  // Ground Floor Commercial Recessed Storefront
  const storefront = new THREE.Mesh(new THREE.BoxGeometry(12.5, 4.5, 1.2), matGlass);
  storefront.position.set(0, 2.25, 6.0);
  root.add(storefront);

  // Curved Facade Screen Mount (Ref Image B)
  // Arc cylinder segment
  const screenGeom = new THREE.CylinderGeometry(8.5, 8.5, 8.5, 24, 1, true, Math.PI * 0.25, Math.PI * 0.5);
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x061828,
    emissive: 0x00f0ff,
    emissiveIntensity: 1.8,
    roughness: 0.1,
    side: THREE.DoubleSide,
  });
  const curvedScreen = new THREE.Mesh(screenGeom, screenMat);
  curvedScreen.position.set(0, 10.5, 0);
  root.add(curvedScreen);

  // Curved Top & Bottom Bezel Frames
  const bezelTop = new THREE.Mesh(
    new THREE.CylinderGeometry(8.7, 8.7, 0.4, 24, 1, true, Math.PI * 0.23, Math.PI * 0.54),
    matDarkSteel
  );
  bezelTop.position.set(0, 14.8, 0);
  root.add(bezelTop);

  const bezelBottom = new THREE.Mesh(
    new THREE.CylinderGeometry(8.7, 8.7, 0.4, 24, 1, true, Math.PI * 0.23, Math.PI * 0.54),
    matDarkSteel
  );
  bezelBottom.position.set(0, 6.2, 0);
  root.add(bezelBottom);

  // Upper Windows Ribbon (15m to 20m)
  const ribbonWin = new THREE.Mesh(new THREE.BoxGeometry(13.2, 3.8, 11.5), matGlass);
  ribbonWin.position.y = 17.5;
  root.add(ribbonWin);

  // Rooftop AC Chiller Units & Ducts
  for (let z of [-3, 2]) {
    const chiller = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.2, 2.8), matDarkSteel);
    chiller.position.set(-3.5, 23.1, z);
    root.add(chiller);

    // Fan grille circle
    const fanGrille = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.1, 12), matDarkMetal);
    fanGrille.position.set(-3.5, 24.25, z);
    root.add(fanGrille);
  }

  // Rooftop Maintenance Communications Mast
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 5.5, 6), matDarkSteel);
  mast.position.set(4.5, 24.5, -3.5);
  root.add(mast);

  await exportToGLB(root, 'building_media_midrise.glb');
}

// ======================================================================
// 4. CYBER COMPLEX (Interlocking volumes, Terraces, Colonnade)
// ======================================================================
async function createCyberComplex() {
  const root = new THREE.Group();
  root.name = 'BuildingCyberComplex';

  // East Volume (Height 24m, 10m x 12m)
  const volEast = new THREE.Mesh(new THREE.BoxGeometry(10, 24, 12), matDarkMetal);
  volEast.position.set(3, 12, 0);
  root.add(volEast);

  // West Stepped Volume (Height 16m, 8m x 10m)
  const volWest = new THREE.Mesh(new THREE.BoxGeometry(8, 16, 10), matConcrete);
  volWest.position.set(-5, 8, 0);
  root.add(volWest);

  // Stepped Rooftop Terrace on West Volume (at 16m height)
  const terraceFloor = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.2, 9.6), matDarkSteel);
  terraceFloor.position.set(-5, 16.1, 0);
  root.add(terraceFloor);

  // Glass Terrace Balustrade
  const balustrade = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.1, 0.1), matGlass);
  balustrade.position.set(-5, 16.7, 4.7);
  root.add(balustrade);

  // External Express Elevator Glass Tube running up East volume
  const elevatorTube = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 22, 12), matGlass);
  elevatorTube.position.set(7.5, 11, 4.5);
  root.add(elevatorTube);

  // Elevator Top Motor House
  const elevatorMotor = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 2.6), matDarkSteel);
  elevatorMotor.position.set(7.5, 22.8, 4.5);
  root.add(elevatorMotor);

  // Ground Pedestrian Colonnade Pillars
  for (let z of [-4, 0, 4]) {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.5, 0.8), matDarkSteel);
    pillar.position.set(-7.5, 2.25, z);
    root.add(pillar);
  }

  // Neon Accent Blade
  const accentBlade = new THREE.Mesh(new THREE.BoxGeometry(0.15, 20, 0.8), matAmberGlow);
  accentBlade.position.set(2.2, 12, 6.1);
  root.add(accentBlade);

  await exportToGLB(root, 'building_cyber_complex.glb');
}

// ======================================================================
// 5. INDUSTRIAL CYBER BLOCK (Ref A & D: Pipes, ducts, shop, catwalks)
// ======================================================================
async function createIndustrialBlock() {
  const root = new THREE.Group();
  root.name = 'BuildingIndustrialBlock';

  // Main Building Mass (18m tall, 12m x 12m)
  const main = new THREE.Mesh(new THREE.BoxGeometry(12, 18, 12), matDarkMetal);
  main.position.y = 9;
  root.add(main);

  // Ground Floor Storefront Shop Void (Ref A Ramen/Bar)
  const shopRecess = new THREE.Mesh(new THREE.BoxGeometry(9, 3.8, 1.5), matDarkSteel);
  shopRecess.position.set(0, 1.9, 6.0);
  root.add(shopRecess);

  // Shop Awning / Canopy
  const awning = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.25, 2.2), matConcrete);
  awning.position.set(0, 3.9, 6.8);
  awning.rotation.x = 0.12;
  root.add(awning);

  // Hanging Lanterns along Awning (Image 1 Style)
  for (let x of [-3.2, -1.1, 1.1, 3.2]) {
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 4), matDarkMetal);
    wire.position.set(x, 3.5, 7.5);
    root.add(wire);

    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.22, 0.65, 8), matAmberGlow);
    lantern.position.set(x, 3.0, 7.5);
    root.add(lantern);
  }

  // External Heavy Ventilation Duct & Pipes running up facade (Ref A & D)
  const duct = new THREE.Mesh(new THREE.BoxGeometry(1.2, 15, 0.8), matDarkSteel);
  duct.position.set(-4.8, 10.5, 6.2);
  root.add(duct);

  // Round Exhaust Pipe with 90-degree elbows
  const pipeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(4.5, 2.0, 6.2),
    new THREE.Vector3(4.5, 14.0, 6.2),
    new THREE.Vector3(4.5, 16.5, 6.2),
    new THREE.Vector3(4.5, 17.5, 5.0),
    new THREE.Vector3(4.5, 18.2, 3.5),
  ]);
  const pipe = new THREE.Mesh(new THREE.TubeGeometry(pipeCurve, 32, 0.28, 8, false), matDarkSteel);
  root.add(pipe);

  // External Metal Catwalk Fire Escape at 2nd & 3rd Floors
  for (let y of [6.0, 10.5]) {
    const catwalk = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 1.4), matDarkSteel);
    catwalk.position.set(0, y, 6.5);
    root.add(catwalk);

    const rail = new THREE.Mesh(new THREE.BoxGeometry(8, 0.9, 0.05), matDarkSteel);
    rail.position.set(0, y + 0.45, 7.2);
    root.add(rail);
  }

  // AC Condenser Units on wall brackets
  for (let [x, y] of [[2.8, 7.5], [-2.5, 12.0], [3.2, 13.5]]) {
    const ac = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.6), matConcrete);
    ac.position.set(x, y, 6.3);
    root.add(ac);
  }

  // Protruding Neon Signboard Blade
  const signBlade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.5, 1.6), matCyanGlow);
  signBlade.position.set(5.5, 7.0, 6.9);
  root.add(signBlade);

  await exportToGLB(root, 'building_industrial_block.glb');
}

// ======================================================================
// 6. STREETLIGHT (Fluted mast, dual cantilever arms, luminaires)
// ======================================================================
async function createStreetlight() {
  const root = new THREE.Group();
  root.name = 'PropStreetlight';

  // Base Plinth
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 0.8, 8), matDarkSteel);
  base.position.y = 0.4;
  root.add(base);

  // Mast Shaft (6.4m tall)
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 5.8, 8), matDarkSteel);
  mast.position.y = 3.7;
  root.add(mast);

  // Primary Roadway Cantilever Arm
  const roadArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.2, 8), matDarkSteel);
  roadArm.position.set(0.9, 6.9, 0);
  roadArm.rotation.z = -Math.PI / 4;
  root.add(roadArm);

  // Primary Luminaire Head
  const luminaire = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.16, 0.35), matDarkMetal);
  luminaire.position.set(1.8, 7.5, 0);
  root.add(luminaire);

  // Luminaire Emissive Lens (Amber street glow)
  const lens = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.05, 0.26), matAmberGlow);
  lens.position.set(1.8, 7.4, 0);
  root.add(lens);

  // Secondary Sidewalk Arm (shorter, opposite side)
  const sideArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.2, 8), matDarkSteel);
  sideArm.position.set(-0.5, 5.8, 0);
  sideArm.rotation.z = Math.PI / 3;
  root.add(sideArm);

  const sideLuminaire = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.25), matDarkMetal);
  sideLuminaire.position.set(-1.0, 6.2, 0);
  root.add(sideLuminaire);

  const sideLens = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.18), matCyanGlow);
  sideLens.position.set(-1.0, 6.12, 0);
  root.add(sideLens);

  // Street Name Blade
  const streetBlade = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.28, 1.2), matCyanGlow);
  streetBlade.position.set(0.18, 4.8, 0);
  root.add(streetBlade);

  await exportToGLB(root, 'prop_streetlight.glb');
}

// ======================================================================
// 7. BENCH & MODULAR PLANTER
// ======================================================================
async function createBenchPlanter() {
  const root = new THREE.Group();
  root.name = 'PropBenchPlanter';

  // Planter Trough Body
  const planter = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.75, 1.6), matConcrete);
  planter.position.y = 0.375;
  root.add(planter);

  // Planter Top Rim
  const rim = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.1, 1.7), matDarkSteel);
  rim.position.y = 0.75;
  root.add(rim);

  // Planter Foliage (Stylized Cyber Shrub)
  const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65, 1), new THREE.MeshStandardMaterial({
    color: 0x059669,
    roughness: 0.8,
  }));
  foliage.position.y = 1.25;
  root.add(foliage);

  // Connected Cantilever Bench (Length 2.4m)
  const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.14, 0.65), matDarkSteel);
  seat.position.set(2.0, 0.48, 0);
  root.add(seat);

  // Bench Underglow Strip
  const underglow = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.04, 0.08), matCyanGlow);
  underglow.position.set(2.0, 0.38, 0);
  root.add(underglow);

  // Bench Steel Leg Stanchion
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.48, 0.55), matDarkMetal);
  leg.position.set(2.8, 0.24, 0);
  root.add(leg);

  await exportToGLB(root, 'prop_bench_planter.glb');
}

// ======================================================================
// 8. HOLOGRAPHIC INFORMATION KIOSK
// ======================================================================
async function createHoloKiosk() {
  const root = new THREE.Group();
  root.name = 'PropHoloKiosk';

  // Angled Base Pedestal
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.6), matDarkMetal);
  base.position.y = 0.55;
  root.add(base);

  // Glowing Base Perimeter
  const baseGlow = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.06, 0.65), matCyanGlow);
  baseGlow.position.y = 0.05;
  root.add(baseGlow);

  // Angled Hologram Display Surface
  const display = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.08), matCyanGlow);
  display.position.set(0, 1.45, 0.1);
  display.rotation.x = -Math.PI / 6;
  root.add(display);

  // Overhead Hologram Emitter Fin
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.9, 0.4), matDarkSteel);
  fin.position.set(0, 1.8, -0.2);
  root.add(fin);

  const emitterLens = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), matVioletGlow);
  emitterLens.position.set(0, 2.2, -0.05);
  root.add(emitterLens);

  await exportToGLB(root, 'prop_holo_kiosk.glb');
}

// ======================================================================
// 9. OVERHEAD STREET TRUSS GANTRY (Ref A & D)
// ======================================================================
async function createOverheadGantry() {
  const root = new THREE.Group();
  root.name = 'PropOverheadGantry';

  // Span Width: 18m, Height: 9.5m
  // Support Columns on Sidewalks
  for (let x of [-8.5, 8.5]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.7, 9.5, 0.7), matDarkSteel);
    col.position.set(x, 4.75, 0);
    root.add(col);

    // Maintenance Ladder
    const ladder = new THREE.Mesh(new THREE.BoxGeometry(0.4, 8.5, 0.1), matDarkMetal);
    ladder.position.set(x, 4.5, 0.4);
    root.add(ladder);
  }

  // Heavy Horizontal Steel Box Truss Span (crossing roadway)
  const span = new THREE.Mesh(new THREE.BoxGeometry(18, 0.9, 1.4), matDarkSteel);
  span.position.set(0, 9.5, 0);
  root.add(span);

  // Overhead Traffic Guidance Display Panel (10m wide)
  const guideSign = new THREE.Mesh(new THREE.BoxGeometry(10, 1.4, 0.12), matCyanGlow);
  guideSign.position.set(0, 9.5, 0.75);
  root.add(guideSign);

  // Directional Arrow Beacons
  for (let x of [-3.5, 0, 3.5]) {
    const beacon = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.4, 4), matAmberGlow);
    beacon.position.set(x, 8.7, 0.75);
    beacon.rotation.z = Math.PI;
    root.add(beacon);
  }

  await exportToGLB(root, 'prop_overhead_gantry.glb');
}

async function main() {
  console.log('Generating real, high-detail GLB models for Nexus City V1...');
  await createCentralMonument();
  await createLandmarkTower();
  await createMediaMidRise();
  await createCyberComplex();
  await createIndustrialBlock();
  await createStreetlight();
  await createBenchPlanter();
  await createHoloKiosk();
  await createOverheadGantry();
  console.log('All GLB models successfully generated in:', OUT_DIR);
}

main().catch(console.error);

