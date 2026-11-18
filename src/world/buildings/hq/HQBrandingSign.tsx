import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getHQMonumentSignTexture, getSharedHQMaterials } from './HQMaterials';

interface HQBrandingSignProps {
  primaryName?: string;
  secondaryTitle?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  type?: 'monument' | 'canopy';
}

/**
 * Dedicated architectural branding component for Abhishek S Nair Developer HQ.
 * Highly optimized, crisp CanvasTexture signage.
 */
export const HQBrandingSign: React.FC<HQBrandingSignProps> = ({
  primaryName = 'ABHISHEK S NAIR',
  secondaryTitle = 'SOFTWARE ENGINEER | FULL STACK DEVELOPER',
  position = [7.5, 0.20, 10.6],
  rotation = [0, 0, 0],
  type = 'monument',
}) => {
  const materials = useMemo(() => getSharedHQMaterials(), []);
  const monumentTexture = useMemo(
    () => getHQMonumentSignTexture(primaryName, secondaryTitle),
    [primaryName, secondaryTitle]
  );

  const customMonumentMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#ffffff',
      map: monumentTexture,
      roughness: 0.35,
      metalness: 0.15,
    });
  }, [monumentTexture]);

  if (type === 'monument') {
    // Freestanding corporate monument sign plinth in the south forecourt
    return (
      <group position={position} rotation={rotation}>
        {/* Polished Black Granite Foundation Base */}
        <mesh position={[0, 0.10, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.20, 0.70]} />
          <primitive object={materials.granitePavers} attach="material" />
        </mesh>

        {/* Brushed Charcoal Aluminum Pylon Monolith Body */}
        <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 1.30, 0.36]} />
          <primitive object={materials.structuralFraming} attach="material" />
        </mesh>

        {/* Front Architectural Inscribed Sign Panel */}
        <mesh position={[0, 0.85, 0.185]}>
          <planeGeometry args={[2.85, 1.15]} />
          <primitive object={customMonumentMat} attach="material" />
        </mesh>

        {/* Back Architectural Sign Panel */}
        <mesh position={[0, 0.85, -0.185]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.85, 1.15]} />
          <primitive object={customMonumentMat} attach="material" />
        </mesh>

        {/* Ground Uplight Spot Fixture */}
        <mesh position={[0, 0.05, 0.32]}>
          <cylinderGeometry args={[0.08, 0.10, 0.10, 12]} />
          <primitive object={materials.stainlessSteel} attach="material" />
        </mesh>
      </group>
    );
  }

  // Canopy Fascia Architectural Lettering Plaque
  return (
    <group position={position} rotation={rotation}>
      {/* Dark Charcoal Fascia Mounting Bar */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[7.2, 0.48, 0.08]} />
        <primitive object={materials.structuralFraming} attach="material" />
      </mesh>

      {/* Primary Brand Text Plaque */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[7.0, 0.42]} />
        <primitive object={customMonumentMat} attach="material" />
      </mesh>
    </group>
  );
};
