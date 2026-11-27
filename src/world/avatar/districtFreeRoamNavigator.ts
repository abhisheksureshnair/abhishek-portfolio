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

export interface CircleCollider {
  id: string;
  name: string;
  x: number;
  z: number;
  radius: number;
}

export interface MovementConstraintResult {
  x: number;
  z: number;
  isBlocked: boolean;
  colliderId: string | null;
  contactX: number;
  contactZ: number;
  normalX: number;
  normalZ: number;
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
  public circleColliders: CircleCollider[] = [];
  public portals: LandmarkPortal[] = [];
  public avatarRadius = 0.35; // 35cm character capsule radius

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
      // Matches visible lobby pavilion [-10, 10] x [0, 8.5] and main tower [-6, 11] x [-11, 4]
      {
        id: 'hq-main',
        name: 'Developer HQ Tower',
        minX: -10.0,
        maxX: 11.0,
        minZ: -11.0,
        maxZ: 8.5,
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

    this.circleColliders = [
      // HQ cylindrical glass revolving door drum protruding at Z = 8.6 (radius 1.3m)
      {
        id: 'hq-revolving-drum',
        name: 'HQ Revolving Door',
        x: 0,
        z: 8.6,
        radius: 1.3,
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
   * Check if a capsule (2D circle of avatarRadius) overlaps any solid building AABB or circle collider.
   */
  public checkBuildingCollision(x: number, z: number): boolean {
    const rSq = this.avatarRadius * this.avatarRadius;
    for (let i = 0; i < this.colliders.length; i++) {
      const c = this.colliders[i];
      const closestX = Math.max(c.minX, Math.min(x, c.maxX));
      const closestZ = Math.max(c.minZ, Math.min(z, c.maxZ));
      const dx = x - closestX;
      const dz = z - closestZ;
      if (dx * dx + dz * dz < rSq) {
        return true;
      }
    }
    for (let i = 0; i < this.circleColliders.length; i++) {
      const cc = this.circleColliders[i];
      const minDist = cc.radius + this.avatarRadius;
      const dx = x - cc.x;
      const dz = z - cc.z;
      if (dx * dx + dz * dz < minDist * minDist) {
        return true;
      }
    }
    return false;
  }

  /**
   * Shared capsule-vs-AABB & circle solver with penetration push-out and tangent sliding.
   */
  private resolveCapsuleMovement(
    currentX: number,
    currentZ: number,
    desiredVx: number,
    desiredVz: number,
    dt: number,
    aabbs: BuildingCollider[],
    circles: CircleCollider[],
    bounds: DistrictBounds
  ): MovementConstraintResult {
    const totalDx = desiredVx * dt;
    const totalDz = desiredVz * dt;
    const totalDist = Math.hypot(totalDx, totalDz);

    let x = currentX;
    let z = currentZ;
    let isBlocked = false;
    let colliderId: string | null = null;
    let contactX = x;
    let contactZ = z;
    let normalX = 0;
    let normalZ = 0;

    // Sub-step so even low-FPS sprints (e.g. 25 FPS) never tunnel past corners or thin edges
    const maxStepDist = 0.14;
    const numSteps = Math.max(1, Math.min(8, Math.ceil(totalDist / maxStepDist)));
    const stepDx = totalDx / numSteps;
    const stepDz = totalDz / numSteps;
    const r = this.avatarRadius;

    for (let s = 0; s < numSteps; s++) {
      let remX = stepDx;
      let remZ = stepDz;

      // Bounded iterative contact resolution & tangent projection
      for (let iter = 0; iter < 3; iter++) {
        x += remX;
        z += remZ;
        remX = 0;
        remZ = 0;

        let hadContactThisIter = false;

        // 1. Resolve AABB colliders using closest-point capsule test (rounded corners)
        for (let i = 0; i < aabbs.length; i++) {
          const c = aabbs[i];
          const closestX = Math.max(c.minX, Math.min(x, c.maxX));
          const closestZ = Math.max(c.minZ, Math.min(z, c.maxZ));
          const dx = x - closestX;
          const dz = z - closestZ;
          const distSq = dx * dx + dz * dz;

          if (distSq < r * r) {
            hadContactThisIter = true;
            isBlocked = true;
            colliderId = c.id;

            let nx = 0;
            let nz = 0;
            let pen = 0;

            if (distSq > 1e-8) {
              const dist = Math.sqrt(distSq);
              nx = dx / dist;
              nz = dz / dist;
              pen = r - dist;
              contactX = closestX;
              contactZ = closestZ;
            } else {
              // Center is inside AABB: push out along shallowest axis
              const dLeft = Math.abs(x - c.minX);
              const dRight = Math.abs(c.maxX - x);
              const dTop = Math.abs(z - c.minZ);
              const dBot = Math.abs(c.maxZ - z);
              const minD = Math.min(dLeft, dRight, dTop, dBot);
              if (minD === dLeft) {
                nx = -1;
                contactX = c.minX;
                contactZ = z;
                pen = dLeft + r;
              } else if (minD === dRight) {
                nx = 1;
                contactX = c.maxX;
                contactZ = z;
                pen = dRight + r;
              } else if (minD === dTop) {
                nz = -1;
                contactX = x;
                contactZ = c.minZ;
                pen = dTop + r;
              } else {
                nz = 1;
                contactX = x;
                contactZ = c.maxZ;
                pen = dBot + r;
              }
            }

            x += nx * pen;
            z += nz * pen;
            normalX = nx;
            normalZ = nz;
          }
        }

        // 2. Resolve Circle colliders (revolving door drum, columns, pedestals)
        for (let i = 0; i < circles.length; i++) {
          const cc = circles[i];
          const minDist = cc.radius + r;
          const dx = x - cc.x;
          const dz = z - cc.z;
          const distSq = dx * dx + dz * dz;
          if (distSq < minDist * minDist) {
            hadContactThisIter = true;
            isBlocked = true;
            colliderId = cc.id;

            const dist = distSq > 1e-8 ? Math.sqrt(distSq) : 0.001;
            const nx = distSq > 1e-8 ? dx / dist : 0;
            const nz = distSq > 1e-8 ? dz / dist : 1;
            const pen = minDist - dist;

            x += nx * pen;
            z += nz * pen;
            contactX = cc.x + nx * cc.radius;
            contactZ = cc.z + nz * cc.radius;
            normalX = nx;
            normalZ = nz;
          }
        }

        // 3. Clamp to outer perimeter bounds
        if (x < bounds.minX) {
          x = bounds.minX;
          isBlocked = true;
          colliderId = 'district-bounds-west';
          normalX = 1;
          normalZ = 0;
          contactX = bounds.minX;
          contactZ = z;
        } else if (x > bounds.maxX) {
          x = bounds.maxX;
          isBlocked = true;
          colliderId = 'district-bounds-east';
          normalX = -1;
          normalZ = 0;
          contactX = bounds.maxX;
          contactZ = z;
        }
        if (z < bounds.minZ) {
          z = bounds.minZ;
          isBlocked = true;
          colliderId = 'district-bounds-north';
          normalX = 0;
          normalZ = 1;
          contactX = x;
          contactZ = bounds.minZ;
        } else if (z > bounds.maxZ) {
          z = bounds.maxZ;
          isBlocked = true;
          colliderId = 'district-bounds-south';
          normalX = 0;
          normalZ = -1;
          contactX = x;
          contactZ = bounds.maxZ;
        }

        if (!hadContactThisIter) break;
      }
    }

    return {
      x,
      z,
      isBlocked,
      colliderId,
      contactX,
      contactZ,
      normalX,
      normalZ,
    };
  }

  /**
   * Free-roaming movement constraint engine with swept capsule collision & smooth wall sliding.
   * Completely unrestricted across all roads, sidewalks, plazas, and alleys in the central 3x3 district.
   */
  public constrainMovement(
    currentX: number,
    currentZ: number,
    desiredVx: number,
    desiredVz: number,
    dt: number
  ): MovementConstraintResult {
    return this.resolveCapsuleMovement(
      currentX,
      currentZ,
      desiredVx,
      desiredVz,
      dt,
      this.colliders,
      this.circleColliders,
      this.bounds
    );
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

  /**
   * Floor elevation inside Flagship Headquarters (0.28m on central circular platform, 0.22m on lobby floor).
   */
  public getHQInteriorFloorY(x: number, z: number): number {
    const distToPlatform = Math.hypot(x, z - 3.8);
    return distToPlatform <= 2.22 ? 0.28 : 0.22;
  }

  private static readonly HQ_INTERIOR_BOUNDS: DistrictBounds = {
    minX: -7.75,
    maxX: 7.75,
    minZ: -0.95,
    maxZ: 8.05,
  };

  private static readonly HQ_INTERIOR_AABBS: BuildingCollider[] = [
    {
      id: 'hq-reception-desk',
      name: 'HQ Reception Desk',
      minX: -1.7,
      maxX: 1.7,
      minZ: -0.75,
      maxZ: 0.05,
    },
  ];

  private static readonly HQ_INTERIOR_CIRCLES: CircleCollider[] = [
    { id: 'hq-revolving-drum', name: 'Revolving Door Drum', x: 0, z: 8.6, radius: 1.3 },
    { id: 'hq-column-west', name: 'West Perimeter Pilaster', x: -7.6, z: 4.5, radius: 0.32 },
    { id: 'hq-column-east', name: 'East Perimeter Pilaster', x: 7.6, z: 4.5, radius: 0.32 },
  ];

  /**
   * Axis-separated & swept capsule wall sliding inside Flagship Headquarters.
   */
  public constrainHQInteriorMovement(
    currentX: number,
    currentZ: number,
    desiredVx: number,
    desiredVz: number,
    dt: number
  ): MovementConstraintResult {
    return this.resolveCapsuleMovement(
      currentX,
      currentZ,
      desiredVx,
      desiredVz,
      dt,
      DistrictFreeRoamNavigator.HQ_INTERIOR_AABBS,
      DistrictFreeRoamNavigator.HQ_INTERIOR_CIRCLES,
      DistrictFreeRoamNavigator.HQ_INTERIOR_BOUNDS
    );
  }
}

let cachedDistrictNavigator: DistrictFreeRoamNavigator | null = null;

export function getDistrictFreeRoamNavigator(network: FullCityRoadNetwork): DistrictFreeRoamNavigator {
  if (!cachedDistrictNavigator) {
    cachedDistrictNavigator = new DistrictFreeRoamNavigator(network);
  }
  return cachedDistrictNavigator;
}
