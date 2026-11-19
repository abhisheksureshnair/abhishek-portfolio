import React, { useState } from 'react';
import * as THREE from 'three';
import { INNOVATION_CENTER_METADATA, InnovationProjectKioskMeta } from './innovationMetadata';
import { getSharedInnovationMaterials } from './InnovationMaterials';

interface InnovationKiosksProps {
  onSelectProject?: (projectId: string) => void;
}

export const InnovationKiosks: React.FC<InnovationKiosksProps> = ({ onSelectProject }) => {
  const materials = getSharedInnovationMaterials();
  const [hoveredKiosk, setHoveredKiosk] = useState<string | null>(null);

  const getScreenMaterial = (projectId: string) => {
    switch (projectId) {
      case 'vts-gps-tracking':
        return materials.kioskVTS;
      case 'telemedicine-platform':
        return materials.kioskTelemed;
      case 'echo-desktop-ai':
        return materials.kioskEcho;
      case 'flowsync':
      default:
        return materials.kioskFlowSync;
    }
  };

  return (
    <group name="innovation_kiosks">
      {INNOVATION_CENTER_METADATA.kiosks.map((kiosk: InnovationProjectKioskMeta) => {
        const isHovered = hoveredKiosk === kiosk.id;
        const screenMat = getScreenMaterial(kiosk.projectId);

        return (
          <group
            key={kiosk.id}
            position={kiosk.relativePosition}
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectProject) {
                onSelectProject(kiosk.projectId);
              }
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredKiosk(kiosk.id);
              if (typeof document !== 'undefined') {
                document.body.style.cursor = 'pointer';
              }
            }}
            onPointerOut={() => {
              setHoveredKiosk(null);
              if (typeof document !== 'undefined') {
                document.body.style.cursor = 'auto';
              }
            }}
          >
            {/* 1. Kiosk Base Plinth */}
            <mesh position={[0, 0.04, 0]} receiveShadow>
              <cylinderGeometry args={[1.2, 1.3, 0.08, 24]} />
              <primitive object={materials.structuralFraming} attach="material" />
            </mesh>

            {/* Glowing Floor Halo Ring */}
            <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.15, 1.25, 24]} />
              <meshBasicMaterial
                color={kiosk.accentColor}
                transparent
                opacity={isHovered ? 0.9 : 0.5}
              />
            </mesh>

            {/* 2. Sleek Architectural Pedestal Stem */}
            <mesh position={[0, 0.55, 0]} receiveShadow>
              <boxGeometry args={[0.7, 0.95, 0.35]} />
              <primitive object={materials.stainlessSteel} attach="material" />
            </mesh>

            {/* 3. Angled Interactive Touch Screen Console */}
            <group position={[0, 1.05, 0]} rotation={[-Math.PI / 6, 0, 0]}>
              {/* Screen Bezel Housing */}
              <mesh receiveShadow>
                <boxGeometry args={[1.5, 1.1, 0.08]} />
                <primitive object={materials.structuralFraming} attach="material" />
              </mesh>

              {/* High-Resolution Project Screen Surface */}
              <mesh position={[0, 0, 0.045]}>
                <planeGeometry args={[1.42, 1.02]} />
                <primitive object={screenMat} attach="material" />
              </mesh>

              {/* Glowing Interactive Edge Frame on Hover */}
              {isHovered && (
                <mesh position={[0, 0, 0.048]}>
                  <planeGeometry args={[1.44, 1.04]} />
                  <meshBasicMaterial
                    color={kiosk.accentColor}
                    wireframe
                    transparent
                    opacity={0.8}
                  />
                </mesh>
              )}
            </group>

            {/* 4. Floating Holographic Badge / Project Marker */}
            <group position={[0, 1.95, 0]}>
              {/* Beacon Sphere */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color={kiosk.accentColor} />
              </mesh>

              {/* Vertical Laser Projection Line */}
              <mesh position={[0, -0.22, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.44, 8]} />
                <meshBasicMaterial
                  color={kiosk.accentColor}
                  transparent
                  opacity={0.6}
                />
              </mesh>

              {/* Holographic Project Name Plaque */}
              <mesh position={[0, 0.22, 0]}>
                <boxGeometry args={[1.3, 0.26, 0.02]} />
                <meshStandardMaterial
                  color="#0f172a"
                  emissive={kiosk.accentColor}
                  emissiveIntensity={isHovered ? 0.9 : 0.4}
                  roughness={0.2}
                />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
};
