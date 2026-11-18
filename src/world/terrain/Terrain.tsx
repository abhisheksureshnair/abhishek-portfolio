import React from 'react';
import * as THREE from 'three';
import { IslandTerrain } from '../island/IslandTerrain';

interface TerrainProps {
  onGroundClick?: (point: THREE.Vector3) => void;
}

/**
 * Phase 2.0.5 Island Terrain System
 * 
 * Delegates to IslandTerrain:
 * - Organic island landmass surrounded by ocean
 * - Continuous ground at Y = 0.00m
 * - Preserves the 9 protected central portfolio plot surveyor outlines
 */
export const Terrain: React.FC<TerrainProps> = ({ onGroundClick }) => {
  return <IslandTerrain onGroundClick={onGroundClick} />;
};
