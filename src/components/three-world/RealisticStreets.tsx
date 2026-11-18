'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import {
  getUrbanAsphaltDetailedTexture,
  getGranitePaverTexture,
  getTactilePavingTexture,
  getStormDrainGrateTexture,
  getManholeCoverTexture,
  getBikeLaneGreenTexture,
  getCafeSignTexture,
  getLobbyShowroomGlassTexture,
  getArchitecturalWoodTexture,
  getMulchSoilTexture,
} from './architecturalTextures';
import { TimeOfDay } from './AtmosphericWeatherSystem';

interface RealisticStreetsProps {
  timeOfDay?: TimeOfDay;
  onRoadClick?: (point: THREE.Vector3) => void;
}

/**
 * Modern LED Streetlamp with Angled Outreach Arm (Reference Image 1 & 2 Style)
 */
function ModernStreetlight({
  position,
  rotationY = 0,
  isNight = false,
}: {
  position: [number, number, number];
  rotationY?: number;
  isNight?: boolean;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Base Flange */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 0.2, 8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.35} metalness={0.8} />
      </mesh>

      {/* Slender Tapered Mast (4.5m) */}
      <mesh position={[0, 2.35, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.08, 4.5, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Angled Modern Outreach Arm */}
      <mesh position={[0.55, 4.55, 0]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[1.2, 0.05, 0.06]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Sleek Aerodynamic LED Luminaire Head */}
      <mesh position={[1.1, 4.4, 0]} castShadow>
        <boxGeometry args={[0.5, 0.07, 0.18]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Luminous LED Emissive Panel */}
      <mesh position={[1.1, 4.35, 0]}>
        <boxGeometry args={[0.44, 0.02, 0.15]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={isNight ? 3.5 : 0.8}
        />
      </mesh>

      {/* Night Street Light Cone */}
      {isNight && (
        <pointLight
          position={[1.1, 4.1, 0]}
          color="#fef08a"
          intensity={3.0}
          distance={15}
          decay={2}
        />
      )}
    </group>
  );
}

/**
 * Modern Trapezoidal Cast-Iron / Stainless Steel Bollard (Reference Image 1 Style)
 */
function ModernStreetBollard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tapered trapezoidal architectural bollard */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.14, 0.76, 6]} />
        <meshStandardMaterial color="#475569" roughness={0.25} metalness={0.9} />
      </mesh>
      {/* Top cap / reflector collar */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.04, 6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.15} metalness={0.95} />
      </mesh>
    </group>
  );
}

/**
 * Stainless Steel Inverted-U Bicycle Rack (Reference Images 1 & 2 Style)
 */
function BikeRack({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Tubular arch */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <torusGeometry args={[0.35, 0.028, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.95} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.35, 0.21, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.028, 0.42, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.95} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.35, 0.21, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.028, 0.42, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.95} />
      </mesh>
    </group>
  );
}

/**
 * Modern Minimalist Timber & Steel Bench (Reference Image 2 Style)
 */
function ModernStreetBench({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Dark charcoal steel block supports */}
      <mesh position={[-0.8, 0.22, 0]} castShadow>
        <boxGeometry args={[0.14, 0.44, 0.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[0.8, 0.22, 0]} castShadow>
        <boxGeometry args={[0.14, 0.44, 0.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Hardwood timber seat slats */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.85, 0.06, 0.48]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Low minimalist backrest */}
      <mesh position={[0, 0.66, -0.21]} castShadow>
        <boxGeometry args={[1.85, 0.24, 0.05]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
}

/**
 * Modern Dual-Stream Stainless & Charcoal Waste Receptacle
 */
function StreetTrashBin({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.45, 0.88, 0.45]} />
        <meshStandardMaterial color="#1e293b" roughness={0.35} metalness={0.75} />
      </mesh>
      {/* Stainless steel top opening hood */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.47, 0.06, 0.47]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
}

/**
 * Modern Transit Bus Stop Shelter (Reference Image 2 Style)
 */
function ModernBusShelter({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Steel structural pillars */}
      <mesh position={[-1.7, 1.4, -0.55]} castShadow>
        <boxGeometry args={[0.08, 2.8, 0.08]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[1.7, 1.4, -0.55]} castShadow>
        <boxGeometry args={[0.08, 2.8, 0.08]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Clear tempered glass back panel */}
      <mesh position={[0, 1.4, -0.55]}>
        <boxGeometry args={[3.3, 2.6, 0.03]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transmission={0.85}
          roughness={0.05}
          metalness={0.1}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Modern cantilevered roof canopy */}
      <mesh position={[0, 2.82, 0.1]} castShadow>
        <boxGeometry args={[3.6, 0.08, 1.6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Integrated timber passenger bench */}
      <mesh position={[0, 0.45, -0.32]} castShadow>
        <boxGeometry args={[2.5, 0.06, 0.36]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>

      {/* Digital Transit Timetable Information Pylon */}
      <group position={[1.75, 1.2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 2.4, 0.12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.85} />
        </mesh>
        {/* Glowing Transit Screen */}
        <mesh position={[0.16, 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.08, 0.8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Street Traffic & Pedestrian Wayfinding Signpost (Reference Image 2 Style)
 */
function StreetSignPost({
  position,
  label = 'PRIORIDAD PEATONAL',
}: {
  position: [number, number, number];
  label?: string;
}) {
  return (
    <group position={position}>
      {/* Steel pole */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 2.8, 8]} />
        <meshStandardMaterial color="#64748b" roughness={0.25} metalness={0.9} />
      </mesh>
      {/* Rectangular sign blade */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[0.65, 0.45, 0.02]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Sign border */}
      <mesh position={[0, 2.4, 0.012]}>
        <boxGeometry args={[0.61, 0.41, 0.002]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
    </group>
  );
}

/**
 * Utility Electrical Cabinet / Telecom Fiber Pedestal
 */
function UtilityCabinet({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Main cabinet */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.65, 1.1, 0.38]} />
        <meshStandardMaterial color="#166534" roughness={0.65} metalness={0.2} />
      </mesh>
      {/* Sloped rain roof */}
      <mesh position={[0, 1.12, 0]} castShadow>
        <boxGeometry args={[0.69, 0.04, 0.42]} />
        <meshStandardMaterial color="#14532d" roughness={0.6} />
      </mesh>
    </group>
  );
}

/**
 * Modern Red Fire Hydrant
 */
function FireHydrant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.64, 10]} />
        <meshStandardMaterial color="#dc2626" roughness={0.35} metalness={0.6} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 0.68, 0]}>
        <sphereGeometry args={[0.11, 10, 10]} />
        <meshStandardMaterial color="#dc2626" roughness={0.35} metalness={0.6} />
      </mesh>
      {/* Side connection nozzles */}
      <mesh position={[0.11, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
      <mesh position={[-0.11, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
    </group>
  );
}

/**
 * Artisan Café Barrio Pavilion & Outdoor Dining Terrace (Reference Images 1 & 2 Style)
 */
function CafeBarrioPavilion({ position }: { position: [number, number, number] }) {
  const cafeSignTex = useMemo(() => getCafeSignTexture(), []);
  const showroomGlassTex = useMemo(() => getLobbyShowroomGlassTexture(), []);
  const woodDeckTex = useMemo(() => getArchitecturalWoodTexture(), []);
  const paverTex = useMemo(() => getGranitePaverTexture(), []);
  const mulchSoilTex = useMemo(() => getMulchSoilTexture(), []);

  return (
    <group position={position}>
      {/* Paved Outdoor Dining Patio Terrace */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[8.5, 0.06, 6.0]} />
        <meshStandardMaterial map={paverTex} roughness={0.8} />
      </mesh>

      {/* Café Pavilion Building Volume */}
      <group position={[0, 1.8, -1.6]}>
        {/* Dark architectural structure */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[8.2, 3.4, 2.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.7} />
        </mesh>
        {/* Front Glass Facade */}
        <mesh position={[0, 0, 1.32]}>
          <planeGeometry args={[7.8, 3.1]} />
          <meshStandardMaterial
            map={showroomGlassTex}
            roughness={0.08}
            metalness={0.9}
            emissive="#fde047"
            emissiveIntensity={0.35}
          />
        </mesh>
        {/* Architectural Marquee Sign: "CAFÉ BARRIO" */}
        <mesh position={[0, 1.35, 1.35]}>
          <planeGeometry args={[3.8, 0.7]} />
          <meshBasicMaterial map={cafeSignTex} />
        </mesh>
      </group>

      {/* Linear Manicured Hedge Bed Bordering Street (Image 1 Style) */}
      <group position={[0, 0.35, 2.6]}>
        {/* Precast Planter Box with Beveled Coping */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[8.2, 0.3, 0.5]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
        {/* Recessed Soil Bed */}
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[8.05, 0.04, 0.44]} />
          <meshStandardMaterial map={mulchSoilTex} roughness={0.95} />
        </mesh>
        {/* Dense Lush Boxwood Hedge */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[8.0, 0.44, 0.4]} />
          <meshStandardMaterial color="#15803d" roughness={0.75} />
        </mesh>
      </group>

      {/* Outdoor Bistro Dining Tables & Wireframe Chairs (4 Sets) */}
      {[-2.8, -0.9, 0.9, 2.8].map((tx, idx) => (
        <group key={`bistro-table-${idx}`} position={[tx, 0.04, 0.7]}>
          {/* Round bistro table */}
          <mesh position={[0, 0.72, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.03, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.36, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.72, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.03, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>

          {/* Bistro Chairs (2 per table) */}
          {[-0.5, 0.5].map((cx, cIdx) => (
            <group key={`chair-${cIdx}`} position={[cx, 0, 0]} rotation={[0, cx > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
              <mesh position={[0, 0.42, 0]} castShadow>
                <boxGeometry args={[0.34, 0.03, 0.34]} />
                <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.7} />
              </mesh>
              <mesh position={[0, 0.65, -0.15]} castShadow>
                <boxGeometry args={[0.34, 0.4, 0.03]} />
                <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.7} />
              </mesh>
              <mesh position={[0, 0.21, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.42, 6]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} />
              </mesh>
            </group>
          ))}

          {/* Parasol Umbrella over table 1 and 3 */}
          {(idx === 0 || idx === 3) && (
            <group position={[0, 0, 0]}>
              <mesh position={[0, 1.4, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 2.8, 8]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
              </mesh>
              <mesh position={[0, 2.5, 0]} rotation={[Math.PI, 0, 0]} castShadow>
                <coneGeometry args={[1.1, 0.35, 12, 1, true]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.8} side={THREE.DoubleSide} />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
}

/**
 * Zebra Crosswalk with Tactile Curb Ramps
 */
function ZebraCrossing({
  position,
  isHorizontal = false,
}: {
  position: [number, number, number];
  isHorizontal?: boolean;
}) {
  const stripes = useMemo(() => [-2.0, -1.4, -0.8, -0.2, 0.4, 1.0, 1.6, 2.2], []);

  return (
    <group position={position} rotation={[0, isHorizontal ? Math.PI / 2 : 0, 0]}>
      {/* White thermoplastic zebra stripes */}
      {stripes.map((offset, i) => (
        <mesh key={i} position={[offset, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.42, 2.6]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.3}
            metalness={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}

      {/* Stop bar before crossing */}
      <mesh position={[0, 0.007, 1.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.2, 0.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} emissive="#ffffff" emissiveIntensity={0.1} />
      </mesh>
    </group>
  );
}

/**
 * On-Street Parking Stall Demarcation with Wheel Stop Bumper
 */
function ParkingBayStalls({
  position,
  isHorizontal = false,
}: {
  position: [number, number, number];
  isHorizontal?: boolean;
}) {
  return (
    <group position={position} rotation={[0, isHorizontal ? Math.PI / 2 : 0, 0]}>
      {/* White painted parking stall boundary line */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.4, 4.8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} wireframe />
      </mesh>

      {/* Concrete wheel stop bumper (Reference Image 1 Style) */}
      <mesh position={[0, 0.06, -2.1]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.12, 0.18]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>
    </group>
  );
}

export const RealisticStreets: React.FC<RealisticStreetsProps> = ({
  timeOfDay = 'day',
  onRoadClick,
}) => {
  const isNight = timeOfDay === 'night';

  // Textures
  const asphaltTexture = useMemo(() => getUrbanAsphaltDetailedTexture(), []);
  const sidewalkTexture = useMemo(() => getGranitePaverTexture(), []);
  const tactileTexture = useMemo(() => getTactilePavingTexture(), []);
  const bikeLaneTexture = useMemo(() => getBikeLaneGreenTexture(), []);
  const drainGrateTexture = useMemo(() => getStormDrainGrateTexture(), []);
  const manholeTexture = useMemo(() => getManholeCoverTexture(), []);

  // Shared PBR Materials
  const materials = useMemo(() => {
    return {
      asphalt: new THREE.MeshStandardMaterial({
        map: asphaltTexture,
        roughness: 0.78,
        metalness: 0.12,
      }),
      sidewalk: new THREE.MeshStandardMaterial({
        map: sidewalkTexture,
        roughness: 0.72,
        metalness: 0.12,
      }),
      tactile: new THREE.MeshStandardMaterial({
        map: tactileTexture,
        roughness: 0.6,
        metalness: 0.2,
      }),
      bikeLane: new THREE.MeshStandardMaterial({
        map: bikeLaneTexture,
        roughness: 0.7,
        metalness: 0.1,
      }),
      drainGrate: new THREE.MeshStandardMaterial({
        map: drainGrateTexture,
        roughness: 0.45,
        metalness: 0.85,
      }),
      manhole: new THREE.MeshStandardMaterial({
        map: manholeTexture,
        roughness: 0.45,
        metalness: 0.85,
      }),
      curbStone: new THREE.MeshStandardMaterial({
        color: '#64748b',
        roughness: 0.75,
        metalness: 0.15,
      }),
      whiteMarking: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.35,
        emissive: '#ffffff',
        emissiveIntensity: 0.12,
      }),
      yellowMarking: new THREE.MeshStandardMaterial({
        color: '#facc15',
        roughness: 0.35,
        emissive: '#facc15',
        emissiveIntensity: 0.08,
      }),
    };
  }, [asphaltTexture, sidewalkTexture, tactileTexture, bikeLaneTexture, drainGrateTexture, manholeTexture]);

  return (
    <group name="RealisticCompleteStreets">
      {/* ======================================================== */}
      {/* 1. ASPHALT ROADWAY NETWORK (Multi-Lane Boulevards)       */}
      {/* ======================================================== */}
      
      {/* North-South Main Arterial Avenue (Width: 6.8m, Length: 64m) */}
      <mesh
        position={[0, 0.62, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={materials.asphalt}
        onClick={(e) => {
          e.stopPropagation();
          onRoadClick?.(e.point);
        }}
      >
        <planeGeometry args={[6.8, 64]} />
      </mesh>

      {/* East-West Cross Boulevard (Width: 64m, Depth: 6.8m) */}
      <mesh
        position={[0, 0.62, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={materials.asphalt}
        onClick={(e) => {
          e.stopPropagation();
          onRoadClick?.(e.point);
        }}
      >
        <planeGeometry args={[64, 6.8]} />
      </mesh>

      {/* Double Solid Yellow Centerlines (North-South) */}
      {[-16, 16].map((zPos, idx) => (
        <React.Fragment key={`yellow-ns-${idx}`}>
          <mesh position={[-0.08, 0.625, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, 24]} />
            <primitive object={materials.yellowMarking} attach="material" />
          </mesh>
          <mesh position={[0.08, 0.625, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, 24]} />
            <primitive object={materials.yellowMarking} attach="material" />
          </mesh>
        </React.Fragment>
      ))}

      {/* Double Solid Yellow Centerlines (East-West) */}
      {[-16, 16].map((xPos, idx) => (
        <React.Fragment key={`yellow-ew-${idx}`}>
          <mesh position={[xPos, 0.625, -0.08]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[0.08, 24]} />
            <primitive object={materials.yellowMarking} attach="material" />
          </mesh>
          <mesh position={[xPos, 0.625, 0.08]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[0.08, 24]} />
            <primitive object={materials.yellowMarking} attach="material" />
          </mesh>
        </React.Fragment>
      ))}

      {/* White Dashed Lane Dividers & Solid Edge Lines */}
      {/* North-South Solid White Edge Lines (X = ±3.3) */}
      {[-16, 16].map((zPos, idx) => (
        <React.Fragment key={`edge-ns-${idx}`}>
          <mesh position={[-3.3, 0.625, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.1, 24]} />
            <primitive object={materials.whiteMarking} attach="material" />
          </mesh>
          <mesh position={[3.3, 0.625, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.1, 24]} />
            <primitive object={materials.whiteMarking} attach="material" />
          </mesh>
        </React.Fragment>
      ))}

      {/* East-West Solid White Edge Lines (Z = ±3.3) */}
      {[-16, 16].map((xPos, idx) => (
        <React.Fragment key={`edge-ew-${idx}`}>
          <mesh position={[xPos, 0.625, -3.3]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[0.1, 24]} />
            <primitive object={materials.whiteMarking} attach="material" />
          </mesh>
          <mesh position={[xPos, 0.625, 3.3]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[0.1, 24]} />
            <primitive object={materials.whiteMarking} attach="material" />
          </mesh>
        </React.Fragment>
      ))}

      {/* ======================================================== */}
      {/* 2. PROTECTED GREEN BICYCLE LANES (Reference Image 2)     */}
      {/* ======================================================== */}
      {/* North-South Protected Bicycle Lanes (X = -3.8 and +3.8) */}
      {[-16, 16].map((zPos, idx) => (
        <React.Fragment key={`bike-ns-${idx}`}>
          <mesh position={[-3.9, 0.624, zPos]} rotation={[-Math.PI / 2, 0, 0]} material={materials.bikeLane}>
            <planeGeometry args={[1.0, 24]} />
          </mesh>
          <mesh position={[3.9, 0.624, zPos]} rotation={[-Math.PI / 2, 0, Math.PI]} material={materials.bikeLane}>
            <planeGeometry args={[1.0, 24]} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Rubber Bike Lane Separator Curbs */}
      {[-18, -14, -10, 10, 14, 18].map((zPos, idx) => (
        <React.Fragment key={`bike-sep-${idx}`}>
          <mesh position={[-3.35, 0.64, zPos]} castShadow>
            <boxGeometry args={[0.12, 0.04, 1.2]} />
            <meshStandardMaterial color="#eab308" roughness={0.5} />
          </mesh>
          <mesh position={[3.35, 0.64, zPos]} castShadow>
            <boxGeometry args={[0.12, 0.04, 1.2]} />
            <meshStandardMaterial color="#eab308" roughness={0.5} />
          </mesh>
        </React.Fragment>
      ))}

      {/* ======================================================== */}
      {/* 3. ZEBRA CROSSINGS, MANHOLES & STORM DRAINAGE GRATES    */}
      {/* ======================================================== */}
      <ZebraCrossing position={[0, 0.626, -3.8]} />
      <ZebraCrossing position={[0, 0.626, 3.8]} />
      <ZebraCrossing position={[-3.8, 0.626, 0]} isHorizontal />
      <ZebraCrossing position={[3.8, 0.626, 0]} isHorizontal />

      {/* Cast Iron Storm Drainage Catch-Basins along Gutters */}
      {[
        [-3.2, 0.624, -4.8],
        [3.2, 0.624, -4.8],
        [-3.2, 0.624, 4.8],
        [3.2, 0.624, 4.8],
        [-4.8, 0.624, -3.2],
        [4.8, 0.624, -3.2],
        [-4.8, 0.624, 3.2],
        [4.8, 0.624, 3.2],
      ].map(([dx, dy, dz], idx) => (
        <mesh key={`drain-${idx}`} position={[dx, dy, dz]} rotation={[-Math.PI / 2, 0, 0]} material={materials.drainGrate}>
          <planeGeometry args={[0.4, 0.8]} />
        </mesh>
      ))}

      {/* Cast-Iron Utility Manholes in Roadway & Sidewalks */}
      {[
        [0, 0.626, -10.5],
        [0, 0.626, 10.5],
        [-10.5, 0.626, 0],
        [10.5, 0.626, 0],
      ].map(([mx, my, mz], idx) => (
        <mesh key={`manhole-${idx}`} position={[mx, my, mz]} rotation={[-Math.PI / 2, 0, 0]} material={materials.manhole}>
          <circleGeometry args={[0.42, 24]} />
        </mesh>
      ))}

      {/* ======================================================== */}
      {/* 4. ON-STREET PARKING STALLS & VEHICULAR BAYS             */}
      {/* ======================================================== */}
      <ParkingBayStalls position={[-4.4, 0.623, -16]} />
      <ParkingBayStalls position={[-4.4, 0.623, 16]} />
      <ParkingBayStalls position={[4.4, 0.623, -16]} />
      <ParkingBayStalls position={[4.4, 0.623, 16]} />

      {/* ======================================================== */}
      {/* 5. RAISED GRANITE CURBS (0.12m Elevation)                */}
      {/* ======================================================== */}
      {/* North-South Curbs */}
      <mesh position={[-4.5, 0.68, 0]} receiveShadow material={materials.curbStone}>
        <boxGeometry args={[0.2, 0.12, 64]} />
      </mesh>
      <mesh position={[4.5, 0.68, 0]} receiveShadow material={materials.curbStone}>
        <boxGeometry args={[0.2, 0.12, 64]} />
      </mesh>

      {/* East-West Curbs */}
      <mesh position={[0, 0.68, -4.5]} receiveShadow material={materials.curbStone}>
        <boxGeometry args={[64, 0.12, 0.2]} />
      </mesh>
      <mesh position={[0, 0.68, 4.5]} receiveShadow material={materials.curbStone}>
        <boxGeometry args={[64, 0.12, 0.2]} />
      </mesh>

      {/* ======================================================== */}
      {/* 6. EXTENSIVE GRANITE-PAVED SIDEWALKS (Y = 0.74m)         */}
      {/* ======================================================== */}
      {/* North-South Primary Pedestrian Sidewalks */}
      <mesh
        position={[-5.8, 0.74, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={materials.sidewalk}
        onClick={(e) => {
          e.stopPropagation();
          onRoadClick?.(e.point);
        }}
      >
        <planeGeometry args={[2.4, 64]} />
      </mesh>
      <mesh
        position={[5.8, 0.74, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={materials.sidewalk}
        onClick={(e) => {
          e.stopPropagation();
          onRoadClick?.(e.point);
        }}
      >
        <planeGeometry args={[2.4, 64]} />
      </mesh>

      {/* East-West Cross Boulevard Pedestrian Sidewalks */}
      <mesh
        position={[0, 0.74, -5.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={materials.sidewalk}
        onClick={(e) => {
          e.stopPropagation();
          onRoadClick?.(e.point);
        }}
      >
        <planeGeometry args={[64, 2.4]} />
      </mesh>
      <mesh
        position={[0, 0.74, 5.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={materials.sidewalk}
        onClick={(e) => {
          e.stopPropagation();
          onRoadClick?.(e.point);
        }}
      >
        <planeGeometry args={[64, 2.4]} />
      </mesh>

      {/* Continuous Tactile Accessibility Paving Routes (Reference Images 1 & 2) */}
      <mesh position={[-5.2, 0.742, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.tactile}>
        <planeGeometry args={[0.36, 60]} />
      </mesh>
      <mesh position={[5.2, 0.742, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.tactile}>
        <planeGeometry args={[0.36, 60]} />
      </mesh>

      {/* ======================================================== */}
      {/* 7. STREETLIGHTS & CONTEMPORARY STREET FURNITURE          */}
      {/* ======================================================== */}
      {/* Modern Angled LED Streetlights along Boulevards */}
      <ModernStreetlight position={[-4.7, 0.74, -20]} rotationY={Math.PI / 2} isNight={isNight} />
      <ModernStreetlight position={[-4.7, 0.74, -12]} rotationY={Math.PI / 2} isNight={isNight} />
      <ModernStreetlight position={[-4.7, 0.74, 12]} rotationY={Math.PI / 2} isNight={isNight} />
      <ModernStreetlight position={[-4.7, 0.74, 20]} rotationY={Math.PI / 2} isNight={isNight} />

      <ModernStreetlight position={[4.7, 0.74, -20]} rotationY={-Math.PI / 2} isNight={isNight} />
      <ModernStreetlight position={[4.7, 0.74, -12]} rotationY={-Math.PI / 2} isNight={isNight} />
      <ModernStreetlight position={[4.7, 0.74, 12]} rotationY={-Math.PI / 2} isNight={isNight} />
      <ModernStreetlight position={[4.7, 0.74, 20]} rotationY={-Math.PI / 2} isNight={isNight} />

      {/* Modern Curb Bollards (Reference Image 1 Style) */}
      {[-24, -20, -16, -12, -8, 8, 12, 16, 20, 24].map((zPos, idx) => (
        <React.Fragment key={`bollard-${idx}`}>
          <ModernStreetBollard position={[-4.45, 0.74, zPos]} />
          <ModernStreetBollard position={[4.45, 0.74, zPos]} />
        </React.Fragment>
      ))}

      {/* Stainless Steel Bike Racks (Reference Images 1 & 2) */}
      <BikeRack position={[-6.2, 0.74, -10]} rotationY={Math.PI / 2} />
      <BikeRack position={[-6.2, 0.74, -11]} rotationY={Math.PI / 2} />
      <BikeRack position={[6.2, 0.74, 10]} rotationY={Math.PI / 2} />
      <BikeRack position={[6.2, 0.74, 11]} rotationY={Math.PI / 2} />

      {/* Minimalist Timber & Steel Street Benches */}
      <ModernStreetBench position={[-6.2, 0.74, -14]} rotationY={Math.PI / 2} />
      <ModernStreetBench position={[-6.2, 0.74, 14]} rotationY={Math.PI / 2} />
      <ModernStreetBench position={[6.2, 0.74, -14]} rotationY={-Math.PI / 2} />
      <ModernStreetBench position={[6.2, 0.74, 14]} rotationY={-Math.PI / 2} />

      {/* Dual Waste / Recycling Receptacles */}
      <StreetTrashBin position={[-4.7, 0.74, -8]} />
      <StreetTrashBin position={[4.7, 0.74, -8]} />
      <StreetTrashBin position={[-4.7, 0.74, 8]} />
      <StreetTrashBin position={[4.7, 0.74, 8]} />

      {/* Modern Glass Transit Bus Shelters (Reference Image 2) */}
      <ModernBusShelter position={[-6.2, 0.74, -22]} rotationY={Math.PI / 2} />
      <ModernBusShelter position={[6.2, 0.74, 22]} rotationY={-Math.PI / 2} />

      {/* Street Wayfinding Signposts */}
      <StreetSignPost position={[-4.8, 0.74, -5.2]} label="PRIORIDAD PEATONAL" />
      <StreetSignPost position={[4.8, 0.74, 5.2]} label="PRIORIDAD PEATONAL" />

      {/* Street Utilities */}
      <UtilityCabinet position={[-6.4, 0.74, -18]} rotationY={Math.PI / 2} />
      <UtilityCabinet position={[6.4, 0.74, 18]} rotationY={-Math.PI / 2} />
      <FireHydrant position={[-4.8, 0.74, -6.5]} />
      <FireHydrant position={[4.8, 0.74, 6.5]} />

      {/* ======================================================== */}
      {/* 8. ARTISAN "CAFÉ BARRIO" STOREFRONT & PATIO              */}
      {/* ======================================================== */}
      <CafeBarrioPavilion position={[14.5, 0.74, -5.5]} />
    </group>
  );
};
