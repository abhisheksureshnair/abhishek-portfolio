import { getCityRoadNetwork, CityBlockData, GridIntersectionData, GridRoadData } from './navigation/cityGridBuilder';

export interface WorldConfigType {
  units: string;
  worldSize: number;
  terrainSize: number;
  roadElevation: number;
  curbElevation: number;
  sidewalkElevation: number;
  markingsElevation: number;
  camera: {
    orbitSpawn: [number, number, number];
    orbitTarget: [number, number, number];
    storySpawn: [number, number, number];
    storyTarget: [number, number, number];
    near: number;
    far: number;
    fov: number;
  };
}

export const WORLD_CONFIG: WorldConfigType = {
  units: 'meters (1 unit = 1m)',
  worldSize: 260,
  terrainSize: 1400, // Expansive terrain covering 1.4km x 1.4km, eliminating empty ground and horizon gaps
  roadElevation: 0.02,
  curbElevation: 0.20,
  sidewalkElevation: 0.20,
  markingsElevation: 0.025,
  camera: {
    orbitSpawn: [0, 155, 205], // Cinematic high-altitude skyline panorama
    orbitTarget: [0, 0, 0],
    storySpawn: [-20, 1.72, -45], // 1st Avenue ground level in central Zone A
    storyTarget: [-20, 1.72, 0],
    near: 0.5,
    far: 2500,
    fov: 48,
  },
};

export { getCityRoadNetwork };
export type { CityBlockData, GridIntersectionData, GridRoadData };
