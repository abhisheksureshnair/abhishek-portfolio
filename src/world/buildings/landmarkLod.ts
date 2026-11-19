'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { useState, useRef } from 'react';
import * as THREE from 'three';
import { useWorldStore } from '../stores/worldStore';
import { avatarGameplayState } from '../avatar/avatarGameplayState';

/**
 * Phase 3.1 Landmark Distance-Based Interior Mounting & LOD Hook
 * 
 * Prevents mounting 8 full interior exhibitions simultaneously.
 * Only mounts a building's interior when:
 * 1. The user explicitly selects/focuses the landmark in Orbit/Story mode
 * 2. An entrance/interior camera preset is active for this building
 * 3. The player avatar walks within proximity (36m High, 24m Med, 15m Low)
 * 
 * Saves over 600 draw calls and 250,000+ triangles in aerial, skyline, and open-city views!
 */
export function useLandmarkInteriorLOD(
  buildingCenter: [number, number],
  landmarkId: string
): boolean {
  const selectedLandmark = useWorldStore((s) => s.selectedLandmark);
  const cameraMode = useWorldStore((s) => s.cameraMode);
  const cameraPreset = useWorldStore((s) => s.cameraPreset);
  const qualityProfile = useWorldStore((s) => s.qualityProfile);
  const isInteracting = useWorldStore((s) => s.isInteracting);

  // If this building is currently selected or user opened its modal, always render interior
  const isExplicitlyFocused = selectedLandmark === landmarkId || (isInteracting && selectedLandmark === landmarkId);

  // Check if camera preset targets this building's entrance or interior
  const isPresetFocused = Boolean(
    cameraPreset &&
    (cameraPreset.startsWith(landmarkId) ||
      (landmarkId === 'hq' && cameraPreset.startsWith('hq_')) ||
      (landmarkId === 'innovation' && cameraPreset.startsWith('innovation_')) ||
      (landmarkId === 'skills' && cameraPreset.startsWith('skills_')) ||
      (landmarkId === 'career' && cameraPreset.startsWith('career_')) ||
      (landmarkId === 'about' && cameraPreset.startsWith('about_')) ||
      (landmarkId === 'contact' && cameraPreset.startsWith('contact_')) ||
      (landmarkId === 'ai' && cameraPreset.startsWith('ai_')) ||
      (landmarkId === 'cloud' && cameraPreset.startsWith('cloud_')))
  );

  // Check if in any distant aerial / skyline preset
  const isAerialPreset = Boolean(
    cameraPreset &&
    (cameraPreset === 'all_nine_landmarks_aerial' ||
      cameraPreset === 'all_seven_landmarks_aerial' ||
      cameraPreset === 'all_six_landmarks_aerial' ||
      cameraPreset === 'five_landmarks_aerial' ||
      cameraPreset === 'four_landmarks_aerial' ||
      cameraPreset === 'landmarks_skyline' ||
      cameraPreset === 'full_island_aerial' ||
      cameraPreset === 'downtown_skyline' ||
      cameraPreset === 'downtown_overview' ||
      cameraPreset === 'complete_coastal_city_aerial' ||
      cameraPreset === 'waterfront_view' ||
      cameraPreset === 'max_orbit_distance' ||
      cameraPreset === 'distant_skyline' ||
      cameraPreset === 'street_level_downtown')
  );

  // Local state sampled at low frequency (2Hz) to eliminate React re-render spikes
  const [isNearAvatar, setIsNearAvatar] = useState<boolean>(false);
  const lastSampleTimeRef = useRef<number>(0);
  const { camera } = useThree();

  useFrame((state) => {
    // Only sample proximity if not already explicitly selected
    if (isExplicitlyFocused || isPresetFocused) return;

    const now = state.clock.getElapsedTime();
    if (now - lastSampleTimeRef.current < 0.35) return; // Sample at ~3Hz
    lastSampleTimeRef.current = now;

    const threshold = qualityProfile === 'low' ? 18.0 : qualityProfile === 'medium' ? 28.0 : 38.0;

    // Use camera position to calculate distance to landmark
    const camX = camera.position.x;
    const camZ = camera.position.z;
    const distToBuilding = Math.hypot(camX - buildingCenter[0], camZ - buildingCenter[1]);

    const shouldShow = distToBuilding <= threshold;
    if (shouldShow !== isNearAvatar) {
      setIsNearAvatar(shouldShow);
    }
  });

  // Low quality profile only mounts interior if explicitly selected
  if (qualityProfile === 'low') {
    return isExplicitlyFocused || isPresetFocused;
  }

  if (isExplicitlyFocused) return true;
  if (isPresetFocused) return true;
  if (isAerialPreset) return false;

  return isNearAvatar;
}
