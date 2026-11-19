import { FullCityRoadNetwork } from '../navigation/cityGridBuilder';

export interface DistrictBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface BuildingCollider {
  id: string;
  name: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface LandmarkPortal {
  id: string;
  name: string;
  subtitle: string;
  portalX: number;
  portalZ: number;
  interactionRadius: number;
}

export class DistrictFreeRoamNavigator {
  public bounds: DistrictBounds;
  public colliders: BuildingCollider[] = [];
  public portals: LandmarkPortal[] = [];
  public avatarRadius = 0.35; // 35cm character collision radius

  constructor(network: FullCityRoadNetwork) {
    const config = network.config;
    const minAvenueX = Math.min(...config.avenueXs); // -60.0
    const maxAvenueX = Math.max(...config.avenueXs); // +60.0
    const minStreetZ = Math.min(...config.streetZs); // -60.0
    const maxStreetZ = Math.max(...config.streetZs); // +60.0
    const halfRoad = config.roadWidth / 2; // 5.0m
    const sidewalkWidth = 2.4; // 2.4m

    // Calculate outer boundary enclosing all 9 central blocks, internal roads, and outer perimeter roads & sidewalks
    this.bounds = {
      minX: minAvenueX - halfRoad - sidewalkWidth + this.avatarRadius, // -67.05m
      maxX: maxAvenueX + halfRoad + sidewalkWidth - this.avatarRadius, // +67.05m
      minZ: minStreetZ - halfRoad - sidewalkWidth + this.avatarRadius, // -67.05m
      maxZ: maxStreetZ + halfRoad + sidewalkWidth - this.avatarRadius, // +67.05m
    };

    this.initBuildingColliders();
    this.initLandmarkPortals();
  }

  /**
   * Initialize lightweight 2D AABB bounding colliders for landmark structures.
   * Allows full walking around buildings and entrance canopies while preventing passing through solid cores.
   */
  private initBuildingColliders() {
    this.colliders = [
      // 1. Developer HQ (block-1-1, center [0, 0])
      // Tower core solid mass; South forecourt plaza and canopy remain completely walkable
      {
        id: 'hq-main',
        name: 'Developer HQ Tower',
        minX: -9.6,
        maxX: 9.6,
        minZ: -9.8,
        maxZ: 8.2,
      },
      // Developer HQ forecourt reflecting water basin (South-West courtyard)
      {
        id: 'hq-reflecting-pool',
        name: 'HQ Water Mirror',
        minX: -11.0,
        maxX: -4.5,
        minZ: 8.0,
        maxZ: 11.2,
      },

      // 2. Innovation & Projects Center (block-0-2, center [40, -40])
      // West entrance approach is at X=29.5, Z=-40
      {
        id: 'innovation-main',
        name: 'Innovation Center',
        minX: 31.5,
        maxX: 48.5,
        minZ: -48.5,
        maxZ: -31.5,
      },

      // 3. Skills & Technology Tower (block-1-0, center [-40, 0])
      // East entrance approach is at X=-29.5, Z=0
      {
        id: 'skills-main',
        name: 'Skills Tower',
        minX: -48.5,
        maxX: -31.5,
        minZ: -8.8,
        maxZ: 8.8,
      },

      // 4. Career & Experience Center (block-1-2, center [40, 0])
      // West entrance approach is at X=29.5, Z=0
      {
        id: 'career-main',
        name: 'Career Center',
        minX: 31.5,
        maxX: 48.5,
        minZ: -8.8,
        maxZ: 8.8,
      },

      // 5. About Me Studio (block-0-1, center [0, -40])
      // South entrance approach is at X=0, Z=-30.5
      {
        id: 'about-main',
        name: 'About Studio',
        minX: -8.8,
        maxX: 8.8,
        minZ: -48.5,
        maxZ: -31.5,
      },

      // 6. Contact & Collaboration Hub (block-2-0, center [-40, 40])
      // North entrance approach is at X=-40, Z=30.5
      {
        id: 'contact-main',
        name: 'Contact Hub',
        minX: -48.5,
        maxX: -31.5,
        minZ: 31.5,
        maxZ: 48.5,
      },

      // 7. AI Research & Innovation Center (block-2-1, center [0, 40])
      // North entrance approach is at X=0, Z=30.5
      {
        id: 'ai-main',
        name: 'AI Research Center',
        minX: -8.8,
        maxX: 8.8,
        minZ: 31.5,
        maxZ: 48.5,
      },

      // 8. Northwest Civic Plaza (block-0-0, center [-40, -40])
      // Public park is open; only the center ornamental fountain basin is solid
      {
        id: 'plaza-fountain',
        name: 'Civic Plaza Fountain',
        minX: -42.2,
        maxX: -37.8,
        minZ: -42.2,
        maxZ: -37.8,
      },

      // 9. Cloud & Systems Engineering Hub (block-2-2, center [40, 40])
      // North entrance approach is at X=40, Z=30.5
      {
        id: 'cloud-main',
        name: 'Cloud Hub',
        minX: 31.5,
        maxX: 48.5,
        minZ: 31.5,
        maxZ: 48.5,
      },
    ];
  }

  /**
   * Initialize entrance portals for interactive landmark trigger checks.
   */
  private initLandmarkPortals() {
    this.portals = [
      {
        id: 'hq',
        name: 'DEVELOPER HQ',
        subtitle: 'Signature Technology Campus & Full-Stack Citadel',
        portalX: 0.0,
        portalZ: 9.5,
        interactionRadius: 2.5,
      },
      {
        id: 'innovation',
        name: 'INNOVATION & PROJECTS CENTER',
        subtitle: 'Interactive Software Engineering Hub',
        portalX: 29.5,
        portalZ: -40.0,
        interactionRadius: 2.5,
      },
      {
        id: 'skills',
        name: 'SKILLS & TECHNOLOGY TOWER',
        subtitle: 'Full-Stack Technical Monolith',
        portalX: -29.5,
        portalZ: 0.0,
        interactionRadius: 2.5,
      },
      {
        id: 'career',
        name: 'CAREER & EXPERIENCE CENTER',
        subtitle: 'Production Enterprise Milestones',
        portalX: 29.5,
        portalZ: 0.0,
        interactionRadius: 2.5,
      },
      {
        id: 'about',
        name: 'ABOUT ME STUDIO',
        subtitle: 'Developer Philosophy & Craftsmanship',
        portalX: 0.0,
        portalZ: -30.5,
        interactionRadius: 2.5,
      },
      {
        id: 'contact',
        name: 'CONTACT & COLLABORATION HUB',
        subtitle: 'Direct Communication & Message Dispatch',
        portalX: -40.0,
        portalZ: 30.5,
        interactionRadius: 2.5,
      },
      {
        id: 'ai',
        name: 'AI RESEARCH & INNOVATION CENTER',
        subtitle: 'Neural Intelligence & Multimodal Systems',
        portalX: 0.0,
        portalZ: 30.5,
        interactionRadius: 2.5,
      },
      {
        id: 'cloud',
        name: 'CLOUD & SYSTEMS ENGINEERING HUB',
        subtitle: 'Backend • Cloud • APIs • Infrastructure',
        portalX: 40.0,
        portalZ: 30.5,
        interactionRadius: 2.5,
      },
    ];
  }

  /**
   * Check if a 2D point with avatar radius is inside the central 3x3 outer boundary.
   */
  public isPointInsideDistrict(x: number, z: number): boolean {
    return (
      x >= this.bounds.minX &&
      x <= this.bounds.maxX &&
      z >= this.bounds.minZ &&
      z <= this.bounds.maxZ
    );
  }

  /**
   * Check if point collides with any solid building AABB (inflated by avatar radius).
   */
  public checkBuildingCollision(x: number, z: number): boolean {
    const r = this.avatarRadius;
    for (let i = 0; i < this.colliders.length; i++) {
      const c = this.colliders[i];
      if (
        x >= c.minX - r &&
        x <= c.maxX + r &&
        z >= c.minZ - r &&
        z <= c.maxZ + r
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Free-roaming movement constraint engine with axis-separated tangential wall sliding.
   * Completely unrestricted across all roads, sidewalks, plazas, and alleys in the central 3x3 district.
   * Solidly prevents passing through buildings and prevents exiting the central 3x3 perimeter.
   */
  public constrainMovement(
    currentX: number,
    currentZ: number,
    desiredVx: number,
    desiredVz: number,
    dt: number
  ): { x: number; z: number; isBlocked: boolean } {
    const dx = desiredVx * dt;
    const dz = desiredVz * dt;

    if (Math.abs(dx) < 0.0001 && Math.abs(dz) < 0.0001) {
      return { x: currentX, z: currentZ, isBlocked: false };
    }

    let newX = currentX;
    let newZ = currentZ;
    let blocked = false;

    // 1. Test movement along X axis (enables tangential slide along Z-oriented walls)
    const testX = currentX + dx;
    if (this.isPointInsideDistrict(testX, currentZ) && !this.checkBuildingCollision(testX, currentZ)) {
      newX = testX;
    } else {
      blocked = true;
    }

    // 2. Test movement along Z axis (enables tangential slide along X-oriented walls)
    const testZ = currentZ + dz;
    if (this.isPointInsideDistrict(newX, testZ) && !this.checkBuildingCollision(newX, testZ)) {
      newZ = testZ;
    } else {
      blocked = true;
    }

    // 3. Strict clamp to central district outer perimeter
    newX = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, newX));
    newZ = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, newZ));

    return { x: newX, z: newZ, isBlocked: blocked };
  }

  /**
   * Check for nearby landmark entrance within interaction distance (2.0 - 2.5 meters).
   */
  public checkLandmarkProximity(px: number, pz: number): LandmarkPortal | null {
    for (let i = 0; i < this.portals.length; i++) {
      const portal = this.portals[i];
      const dist = Math.hypot(px - portal.portalX, pz - portal.portalZ);
      if (dist <= portal.interactionRadius) {
        return portal;
      }
    }
    return null;
  }

  /**
   * Authoritative spawn point on South sidewalk near Developer HQ.
   */
  public getHQSpawn(): { x: number; y: number; z: number; heading: number } {
    return {
      x: 0,
      y: 0.22,
      z: 13.8,
      heading: Math.PI, // Facing North (-Z)
    };
  }
}

let cachedDistrictNavigator: DistrictFreeRoamNavigator | null = null;

export function getDistrictFreeRoamNavigator(network: FullCityRoadNetwork): DistrictFreeRoamNavigator {
  if (!cachedDistrictNavigator) {
    cachedDistrictNavigator = new DistrictFreeRoamNavigator(network);
  }
  return cachedDistrictNavigator;
}
