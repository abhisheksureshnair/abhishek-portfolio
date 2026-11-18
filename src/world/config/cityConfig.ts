export interface CityConfig {
  playableArea: {
    boundaryEnabled: boolean;
    bounds: {
      minX: number;
      maxX: number;
      minZ: number;
      maxZ: number;
    };
    avenueXs: number[];   // Central 4 Avenues
    streetZs: number[];   // Central 4 Streets
    roadWidth: number;
    laneOffset: number;
    hasPhysics: boolean;
    hasNavigation: boolean;
  };

  backgroundCity: {
    enabled: boolean;
    visualOnly: boolean;
    worldRadius: number; // 400m radius (800m total width)
    outerAvenues: number[];
    outerStreets: number[];
    rings: {
      nearMaxDist: number;   // 70m - 140m: Detailed mid-rises (18m-42m tall)
      midMaxDist: number;    // 140m - 260m: Commercial & corporate towers (28m-65m)
      farMaxDist: number;    // 260m - 420m: Distant skyline cluster (65m-135m)
    };
    enablePhysics: boolean;
    enableNavigation: boolean;
  };

  rendering: {
    useInstancing: boolean;
    enableShadowsOnNearScenery: boolean;
    groundCoverageRadius: number;
  };
}

export const CITY_CONFIG: CityConfig = {
  playableArea: {
    boundaryEnabled: true,
    // Zone A: The 3x3 Explorable Central Portfolio District
    bounds: {
      minX: -64.0,
      maxX: 64.0,
      minZ: -64.0,
      maxZ: 64.0,
    },
    // The original 4 Avenues and 4 Streets
    avenueXs: [-60, -20, 20, 60],
    streetZs: [-60, -20, 20, 60],
    roadWidth: 10.0,
    laneOffset: 2.3,
    hasPhysics: true,
    hasNavigation: true,
  },

  backgroundCity: {
    enabled: true,
    visualOnly: true,
    worldRadius: 420, // 840m total urban diameter
    // Outer parallel avenues and streets extending in all 4 directions
    outerAvenues: [-340, -260, -190, -125, 125, 190, 260, 340],
    outerStreets: [-340, -260, -190, -125, 125, 190, 260, 340],
    rings: {
      nearMaxDist: 140, // 70m - 140m: Human-scale mid-rises (18m - 42m)
      midMaxDist: 260,  // 140m - 260m: Medium corporate towers (28m - 65m)
      farMaxDist: 420,  // 260m - 420m: Distant skyline skyscrapers (65m - 135m)
    },
    enablePhysics: false,    // Strictly visual scenery
    enableNavigation: false, // No AI graph calculations in background
  },

  rendering: {
    useInstancing: true,
    enableShadowsOnNearScenery: true,
    groundCoverageRadius: 500, // 1000m total terrain
  },
};
