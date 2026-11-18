import { useSyncExternalStore } from 'react';

export type CameraMode = 'orbit' | 'story' | 'avatar';
export type TimeOfDay = 'day' | 'sunset' | 'night';
export type DowntownMode = 'full' | 'reference';
export type CameraPreset =
  | 'orbit'
  | 'street'
  | 'facades'
  | 'skyline'
  | 'boundary'
  | 'ref_block_orbit'
  | 'ref_block_street'
  | 'central_district'
  | 'ref_street_front'
  | 'ref_three_quarter'
  | 'ref_elevated_overview'
  | 'downtown_overview'
  | 'street_downtown'
  | 'street_intersection'
  | 'facade_close_up'
  | 'distant_skyline'
  | 'aerial_overview'
  | 'aerial_transition'
  | 'street_skyline'
  | 'outer_boundary'
  | 'max_orbit'
  | 'full_island_aerial'
  | 'downtown_skyline'
  | 'waterfront_view'
  | 'high_altitude_island'
  | 'street_level_downtown'
  | 'city_to_coast_transition'
  | 'waterfront_street_level'
  | 'harbor_overview'
  | 'ocean_horizon'
  | 'max_orbit_distance'
  | 'cardinal_north'
  | 'cardinal_south'
  | 'cardinal_east'
  | 'cardinal_west'
  | 'ref_block'
  | 'hq_front_entrance'
  | 'hq_three_quarter'
  | 'hq_street_level'
  | 'hq_elevated_overview'
  | 'hq_roof_skyline'
  | 'central_hq_overview'
  | 'innovation_front_entrance'
  | 'innovation_three_quarter'
  | 'innovation_rooftop'
  | 'innovation_interior_atrium'
  | 'innovation_projects_gallery'
  | 'innovation_downtown_overview'
  | 'innovation_side_facade'
  | 'ground_plots_closeup'
  | 'skills_front_entrance'
  | 'skills_three_quarter'
  | 'skills_street_approach'
  | 'skills_elevated_overview'
  | 'skills_lobby'
  | 'landmarks_skyline'
  | 'both_landmarks_elevated'
  | 'hq_roof_cleanup'
  | 'directory_board_hq'
  | 'directory_board_innovation'
  | 'career_front_entrance'
  | 'career_three_quarter'
  | 'career_elevated_overview'
  | 'career_lobby'
  | 'career_street_view'
  | 'four_landmarks_aerial'
  | 'about_front_entrance'
  | 'about_three_quarter'
  | 'about_rooftop_terrace'
  | 'about_developer_journey'
  | 'about_personal_intro'
  | 'about_street_view'
  | 'five_landmarks_aerial'
  | 'contact_front_entrance'
  | 'contact_three_quarter'
  | 'contact_rooftop_terrace'
  | 'contact_interior_globe'
  | 'contact_collaboration_showcase'
  | 'contact_street_view'
  | 'all_six_landmarks_aerial'
  | 'ai_front_entrance'
  | 'ai_three_quarter'
  | 'ai_elevated_exterior'
  | 'ai_atrium_hologram'
  | 'ai_street_view'
  | 'all_seven_landmarks_aerial'
  | 'both_refined_elevated'
  | 'ai_rooftop_refined'
  | 'contact_rooftop_refined'
  | null;

export interface PerformanceStats {
  fps: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  memoryMB: number;
  frameTimeMs: number;
}

export type LandmarkId = 'hq' | 'innovation' | 'skills' | 'career' | 'about' | 'contact' | 'ai' | null;

export interface WorldState {
  cameraMode: CameraMode;
  cameraPreset: CameraPreset;
  downtownMode: DowntownMode;
  timeOfDay: TimeOfDay;
  selectedPlotId: string | null;
  selectedLandmark: LandmarkId;
  hoveredLandmark: LandmarkId;
  showPerfMonitor: boolean;
  showNavDebug: boolean;
  activeLandmarkPrompt: { id: string; name: string; subtitle: string } | null;
  isInteracting: boolean;
  isPointerLocked: boolean;
  savedAvatarState: { x: number; y: number; z: number; heading: number } | null;
  performanceStats: PerformanceStats;
  isSceneReady: boolean;
  setCameraMode: (mode: CameraMode) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  setCameraView: (mode: CameraMode, preset: CameraPreset) => void;
  setDowntownMode: (mode: DowntownMode) => void;
  toggleDowntownMode: () => void;
  toggleCameraMode: () => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  setSelectedPlotId: (id: string | null) => void;
  setSelectedLandmark: (landmark: LandmarkId) => void;
  setHoveredLandmark: (landmark: LandmarkId) => void;
  setActiveLandmarkPrompt: (prompt: { id: string; name: string; subtitle: string } | null) => void;
  setIsInteracting: (interacting: boolean) => void;
  setIsPointerLocked: (locked: boolean) => void;
  setSavedAvatarState: (state: { x: number; y: number; z: number; heading: number } | null) => void;
  setShowPerfMonitor: (show: boolean) => void;
  togglePerfMonitor: () => void;
  toggleNavDebug: () => void;
  setPerformanceStats: (stats: Partial<PerformanceStats>) => void;
  setIsSceneReady: (ready: boolean) => void;
}

type Listener = () => void;

let state: WorldState = {
  cameraMode: 'orbit',
  cameraPreset: null,
  downtownMode: 'full', // Default to FULL DOWNTOWN for Phase 2.0.2!
  timeOfDay: 'day',
  selectedPlotId: null,
  selectedLandmark: null,
  hoveredLandmark: null,
  showPerfMonitor: true,
  showNavDebug: false,
  activeLandmarkPrompt: null,
  isInteracting: false,
  isPointerLocked: false,
  savedAvatarState: null,
  isSceneReady: false,
  performanceStats: {
    fps: 60,
    drawCalls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
    memoryMB: 0,
    frameTimeMs: 16.6,
  },
  setCameraMode: (mode) => update({ cameraMode: mode }),
  setCameraPreset: (preset) => update({ cameraPreset: preset }),
  setCameraView: (mode, preset) => update({ cameraMode: mode, cameraPreset: preset }),
  setDowntownMode: (downtownMode) => update({ downtownMode }),
  toggleDowntownMode: () =>
    update({ downtownMode: state.downtownMode === 'full' ? 'reference' : 'full' }),
  toggleCameraMode: () =>
    update({
      cameraMode:
        state.cameraMode === 'orbit'
          ? 'avatar'
          : state.cameraMode === 'avatar'
          ? 'story'
          : 'orbit',
    }),
  setTimeOfDay: (timeOfDay) => update({ timeOfDay }),
  setSelectedPlotId: (selectedPlotId) => update({ selectedPlotId }),
  setSelectedLandmark: (selectedLandmark) => update({ selectedLandmark }),
  setHoveredLandmark: (hoveredLandmark) => update({ hoveredLandmark }),
  setActiveLandmarkPrompt: (activeLandmarkPrompt) => update({ activeLandmarkPrompt }),
  setIsInteracting: (isInteracting) => update({ isInteracting }),
  setIsPointerLocked: (isPointerLocked) => update({ isPointerLocked }),
  setSavedAvatarState: (savedAvatarState) => update({ savedAvatarState }),
  setShowPerfMonitor: (showPerfMonitor) => update({ showPerfMonitor }),
  togglePerfMonitor: () => update({ showPerfMonitor: !state.showPerfMonitor }),
  toggleNavDebug: () => update({ showNavDebug: !state.showNavDebug }),
  setPerformanceStats: (partial) =>
    update({ performanceStats: { ...state.performanceStats, ...partial } }),
  setIsSceneReady: (isSceneReady) => update({ isSceneReady }),
};

const listeners = new Set<Listener>();

function update(partial: Partial<WorldState>) {
  state = { ...state, ...partial };
  listeners.forEach((listener) => listener());
}

export function useWorldStore<T>(selector?: (state: WorldState) => T): T {
  const slice = useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => (selector ? selector(state) : (state as unknown as T)),
    () => (selector ? selector(state) : (state as unknown as T))
  );
  return slice;
}

export const worldStore = {
  getState: () => state,
  setState: update,
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

if (typeof window !== 'undefined') {
  (window as any).__worldStore = worldStore;
}

