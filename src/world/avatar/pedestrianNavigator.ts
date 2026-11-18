import { PedestrianGraph, PedestrianEdge, PedestrianNode } from '../navigation/pedestrianGraph';

export interface WalkableSegment {
  id: string;
  ax: number;
  az: number;
  bx: number;
  bz: number;
  length: number;
  dirX: number;
  dirZ: number;
  normalX: number;
  normalZ: number;
  halfWidth: number;
  isCrosswalk: boolean;
  isEntrance: boolean;
  landmarkId?: string;
  fromNode: string;
  toNode: string;
}

export interface LandmarkPortal {
  id: string;
  name: string;
  subtitle: string;
  portalX: number;
  portalZ: number;
  interactionRadius: number;
}

export const LANDMARK_PORTALS: LandmarkPortal[] = [
  {
    id: 'hq',
    name: 'DEVELOPER HQ',
    subtitle: 'Signature Technology Campus & Full-Stack Citadel',
    portalX: 0,
    portalZ: 9.5,
    interactionRadius: 2.8,
  },
  {
    id: 'innovation',
    name: 'INNOVATION & PROJECTS CENTER',
    subtitle: 'Interactive Software Engineering Hub',
    portalX: 29.5,
    portalZ: -40,
    interactionRadius: 2.8,
  },
  {
    id: 'skills',
    name: 'SKILLS & TECHNOLOGY TOWER',
    subtitle: 'Full-Stack Technical Monolith',
    portalX: -29.5,
    portalZ: 0,
    interactionRadius: 2.8,
  },
  {
    id: 'career',
    name: 'CAREER & EXPERIENCE CENTER',
    subtitle: 'Production Enterprise Milestones',
    portalX: 29.5,
    portalZ: 0,
    interactionRadius: 2.8,
  },
  {
    id: 'about',
    name: 'ABOUT ME STUDIO',
    subtitle: 'Developer Philosophy & Craftsmanship',
    portalX: 0,
    portalZ: -30.5,
    interactionRadius: 2.8,
  },
  {
    id: 'contact',
    name: 'CONTACT & COLLABORATION HUB',
    subtitle: 'Direct Communication & Message Dispatch',
    portalX: -40,
    portalZ: 30.5,
    interactionRadius: 2.8,
  },
  {
    id: 'ai',
    name: 'AI RESEARCH & INNOVATION CENTER',
    subtitle: 'Neural Intelligence & Multimodal Systems',
    portalX: 0,
    portalZ: 30.5,
    interactionRadius: 2.8,
  },
];

export class PedestrianNavigator {
  public segments: WalkableSegment[] = [];
  public segmentMap: Map<string, WalkableSegment> = new Map();
  public nodeMap: Map<string, PedestrianNode> = new Map();
  public nodeConnectedSegments: Map<string, string[]> = new Map();

  constructor(graph: PedestrianGraph) {
    this.buildSegments(graph);
  }

  private buildSegments(graph: PedestrianGraph) {
    this.segments = [];
    this.segmentMap.clear();
    this.nodeMap = graph.nodes;
    this.nodeConnectedSegments.clear();

    graph.edges.forEach((edge) => {
      const n1 = graph.nodes.get(edge.from);
      const n2 = graph.nodes.get(edge.to);
      if (!n1 || !n2) return;

      const dx = n2.x - n1.x;
      const dz = n2.z - n1.z;
      const length = Math.hypot(dx, dz);
      if (length < 0.001) return;

      const dirX = dx / length;
      const dirZ = dz / length;
      const normalX = -dirZ;
      const normalZ = dirX;

      const halfWidth = edge.isEntrance ? 1.4 : edge.isCrosswalk ? 1.1 : 0.95;

      const seg: WalkableSegment = {
        id: edge.id,
        ax: n1.x,
        az: n1.z,
        bx: n2.x,
        bz: n2.z,
        length,
        dirX,
        dirZ,
        normalX,
        normalZ,
        halfWidth,
        isCrosswalk: !!edge.isCrosswalk,
        isEntrance: !!edge.isEntrance,
        landmarkId: edge.landmarkId,
        fromNode: edge.from,
        toNode: edge.to,
      };

      this.segments.push(seg);
      this.segmentMap.set(seg.id, seg);

      // Track connectivity by node
      const fromList = this.nodeConnectedSegments.get(edge.from) || [];
      fromList.push(seg.id);
      this.nodeConnectedSegments.set(edge.from, fromList);

      const toList = this.nodeConnectedSegments.get(edge.to) || [];
      toList.push(seg.id);
      this.nodeConnectedSegments.set(edge.to, toList);
    });
  }

  /**
   * Project a point onto a segment line.
   */
  public projectPoint(px: number, pz: number, seg: WalkableSegment) {
    const vax = px - seg.ax;
    const vaz = pz - seg.az;
    const proj = vax * seg.dirX + vaz * seg.dirZ;
    const t = Math.max(0, Math.min(1, proj / seg.length));
    const closestX = seg.ax + t * (seg.bx - seg.ax);
    const closestZ = seg.az + t * (seg.bz - seg.az);
    const dist = Math.hypot(px - closestX, pz - closestZ);
    return { t, closestX, closestZ, dist };
  }

  /**
   * Find the closest segment to a point.
   */
  public findClosestSegment(px: number, pz: number, currentSegId?: string): WalkableSegment {
    if (currentSegId && this.segmentMap.has(currentSegId)) {
      const cur = this.segmentMap.get(currentSegId)!;
      const p = this.projectPoint(px, pz, cur);
      if (p.dist <= cur.halfWidth + 0.3) {
        return cur;
      }
    }

    let bestSeg = this.segments[0];
    let bestDist = Infinity;

    for (let i = 0; i < this.segments.length; i++) {
      const seg = this.segments[i];
      const p = this.projectPoint(px, pz, seg);
      if (p.dist < bestDist) {
        bestDist = p.dist;
        bestSeg = seg;
      }
    }

    return bestSeg;
  }

  /**
   * Authoritative Movement Constraint Engine.
   * Ensures the avatar can only move inside valid pedestrian corridors.
   * Enables smooth sliding along corridor boundaries when heading obliquely.
   * Completely prevents tunneling into roads, buildings, or off the island.
   */
  public constrainMovement(
    currentX: number,
    currentZ: number,
    desiredVx: number,
    desiredVz: number,
    dt: number,
    currentSegId?: string
  ): {
    x: number;
    z: number;
    segmentId: string;
    isBlocked: boolean;
  } {
    const attemptedDx = desiredVx * dt;
    const attemptedDz = desiredVz * dt;

    if (Math.hypot(attemptedDx, attemptedDz) < 0.0001) {
      return {
        x: currentX,
        z: currentZ,
        segmentId: currentSegId || this.findClosestSegment(currentX, currentZ).id,
        isBlocked: false,
      };
    }

    const proposedX = currentX + attemptedDx;
    const proposedZ = currentZ + attemptedDz;

    // 1. Gather candidate segments (current + connected neighbors + nearby approach corridors)
    const curSeg = this.findClosestSegment(currentX, currentZ, currentSegId);
    const candidates: WalkableSegment[] = [curSeg];

    const addNeighbors = (nodeId: string) => {
      const neighborSegIds = this.nodeConnectedSegments.get(nodeId) || [];
      for (const nid of neighborSegIds) {
        const nseg = this.segmentMap.get(nid);
        if (nseg && !candidates.includes(nseg)) {
          candidates.push(nseg);
        }
      }
    };

    addNeighbors(curSeg.fromNode);
    addNeighbors(curSeg.toNode);

    // Also include any nearby segments within approach distance (ensures seamless entrance walkway transitions)
    for (let i = 0; i < this.segments.length; i++) {
      const seg = this.segments[i];
      if (!candidates.includes(seg)) {
        const p = this.projectPoint(currentX, currentZ, seg);
        if (p.dist <= seg.halfWidth + 1.6) {
          candidates.push(seg);
        }
      }
    }

    // 2. Check if the proposed position is directly inside any candidate corridor
    for (const seg of candidates) {
      const p = this.projectPoint(proposedX, proposedZ, seg);
      if (p.dist <= seg.halfWidth) {
        // Valid step inside the corridor!
        return {
          x: proposedX,
          z: proposedZ,
          segmentId: seg.id,
          isBlocked: false,
        };
      }
    }

    // 3. Proposed position breached boundary: Calculate wall-sliding along segment tangent
    const pCurrent = this.projectPoint(currentX, currentZ, curSeg);
    const tangentSpeed = desiredVx * curSeg.dirX + desiredVz * curSeg.dirZ;
    const slideDx = curSeg.dirX * tangentSpeed * dt;
    const slideDz = curSeg.dirZ * tangentSpeed * dt;

    const slidX = currentX + slideDx;
    const slidZ = currentZ + slideDz;

    for (const seg of candidates) {
      const p = this.projectPoint(slidX, slidZ, seg);
      if (p.dist <= seg.halfWidth) {
        return {
          x: slidX,
          z: slidZ,
          segmentId: seg.id,
          isBlocked: true,
        };
      }
    }

    // 4. If even sliding would exit, clamp to the boundary of the closest candidate
    let bestClampedX = currentX;
    let bestClampedZ = currentZ;
    let bestDist = Infinity;
    let bestSegId = curSeg.id;

    for (const seg of candidates) {
      const p = this.projectPoint(proposedX, proposedZ, seg);
      if (p.dist < bestDist) {
        bestDist = p.dist;
        bestSegId = seg.id;
        // Clamp lateral offset to halfWidth
        const lateralX = proposedX - p.closestX;
        const lateralZ = proposedZ - p.closestZ;
        const latLen = Math.hypot(lateralX, lateralZ);
        if (latLen > 0.0001) {
          const factor = Math.min(1.0, seg.halfWidth / latLen);
          bestClampedX = p.closestX + lateralX * factor;
          bestClampedZ = p.closestZ + lateralZ * factor;
        } else {
          bestClampedX = p.closestX;
          bestClampedZ = p.closestZ;
        }
      }
    }

    return {
      x: bestClampedX,
      z: bestClampedZ,
      segmentId: bestSegId,
      isBlocked: true,
    };
  }

  /**
   * Returns authoritative Developer HQ spawn coordinates.
   */
  public getHQSpawn(): { x: number; y: number; z: number; heading: number } {
    return {
      x: 0,
      y: 0.22,
      z: 13.8, // On the South sidewalk of HQ (block-1-1), facing North directly toward entrance canopy
      heading: Math.PI, // Facing North (-Z)
    };
  }

  /**
   * Check for nearby landmark entrance for interaction prompt.
   * Requires avatar to be within 2.8m of entrance AND on the entrance walkway approach.
   * Prevents false triggers through walls or from rear of buildings.
   */
  public checkLandmarkProximity(px: number, pz: number, currentSegId?: string): LandmarkPortal | null {
    const curSeg = currentSegId ? this.segmentMap.get(currentSegId) : null;

    for (const portal of LANDMARK_PORTALS) {
      const dist = Math.hypot(px - portal.portalX, pz - portal.portalZ);
      if (dist <= portal.interactionRadius) {
        // If segment info is available, ensure we are on the entrance walkway or approaching edge
        if (curSeg) {
          if (curSeg.landmarkId === portal.id || (curSeg.isEntrance && curSeg.landmarkId === portal.id)) {
            return portal;
          }
          if (curSeg.fromNode.includes(portal.id) || curSeg.toNode.includes(portal.id)) {
            return portal;
          }
        }
        // Direct close approach distance (<= 2.5m)
        if (dist <= 2.5) {
          return portal;
        }
      }
    }
    return null;
  }
}

let cachedNavigator: PedestrianNavigator | null = null;

export function getPedestrianNavigator(graph: PedestrianGraph): PedestrianNavigator {
  if (!cachedNavigator) {
    cachedNavigator = new PedestrianNavigator(graph);
  }
  return cachedNavigator;
}
