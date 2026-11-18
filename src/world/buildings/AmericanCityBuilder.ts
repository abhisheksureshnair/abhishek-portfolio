import * as THREE from 'three';

export type BuildingArchetype =
  | 'modern-office'       // Glass curtain wall, aluminum framing, podium, setbacks, mechanical crown
  | 'commercial-brick'    // Chicago brick/limestone, storefronts, awnings, water tank, fire escapes
  | 'residential-apt'     // Brick/precast, apartment windows, balconies, entrance stoop
  | 'hotel-tower'         // Porte-cochere canopy, glass lobby, multi-tiered setbacks
  | 'retail-outparcel'    // Low-rise commercial bank/shop strip (6-16m)
  | 'landmark-skyscraper';// 100-165m skyline icon with decorative crown & spire

export interface BuildingData {
  id: string;
  archetype: BuildingArchetype;
  center: [number, number]; // [x, z]
  rotationY: number;

  // 1. Ground Podium / Street-Level Architecture
  podium?: {
    w: number;
    h: number;
    d: number;
    y: number;
    mat: 'storefront' | 'precastConcrete' | 'flutedStone' | 'urbanBrick';
    canopy?: { w: number; h: number; d: number; y: number; offsetZ: number };
    awnings?: { w: number; h: number; d: number; y: number; z: number; color: 'navy' | 'burgundy' | 'green' }[];
    stoop?: { w: number; h: number; d: number; y: number; offsetZ: number };
  };

  // 2. Main Tower Shaft
  shaft: {
    w: number;
    h: number;
    d: number;
    y: number;
    mat: 'curtainGlass' | 'corporateGlass' | 'precastConcrete' | 'urbanBrick' | 'residentialApartment' | 'flutedStone';
  };

  // 3. Setback Tiers (1 or 2)
  setbacks?: {
    w: number;
    h: number;
    d: number;
    y: number;
    mat: 'curtainGlass' | 'corporateGlass' | 'precastConcrete' | 'urbanBrick' | 'flutedStone';
  }[];

  // 4. Balconies (for Residential)
  balconies?: {
    w: number;
    h: number;
    d: number;
    x: number;
    y: number;
    z: number;
  }[];

  // 5. Fire Escapes (for Commercial/Brick)
  fireEscapes?: {
    w: number;
    h: number;
    d: number;
    x: number;
    y: number;
    z: number;
  }[];

  // 6. Rooftop Mechanical Equipment & Architectural Crowns
  rooftopEquipment?: {
    w: number;
    h: number;
    d: number;
    y: number;
  }[];

  waterTank?: {
    radius: number;
    height: number;
    y: number;
    legH: number;
  };

  spire?: {
    radius: number;
    height: number;
    y: number;
  };
}

export interface StreetPropData {
  streetlights: { pos: [number, number, number]; rotY: number }[];
  trafficSignals: { pos: [number, number, number]; rotY: number }[];
  roadSigns: { pos: [number, number, number]; rotY: number; type: 'street' | 'speed' | 'stop' }[];
  busShelters: { pos: [number, number, number]; rotY: number }[];
  benches: { pos: [number, number, number]; rotY: number }[];
  trashBins: { pos: [number, number, number] }[];
  fireHydrants: { pos: [number, number, number] }[];
  trees: { pos: [number, number, number]; scale: number }[];
  parkingMeters: { pos: [number, number, number] }[];
}

export interface UrbanGroundData {
  parkingLots: { pos: [number, number, number]; size: [number, number] }[];
  pocketParks: { pos: [number, number, number]; size: [number, number] }[];
  civicPlazas: { pos: [number, number, number]; size: [number, number] }[];
  serviceAlleys: { pos: [number, number, number]; size: [number, number] }[];
  wheelStops: { pos: [number, number, number]; rotY: number }[];
}

function seededRandom(seed: number): () => number {
  let s = Math.sin(seed) * 10000;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Builds the complete authentic American downtown city layout:
 * - 4 distinct building categories + low-rise outparcels + landmark skyline
 * - Street-level architecture (storefronts, canopies, awnings, stoops)
 * - Rooftop equipment (chillers, penthouses, water tanks, spires)
 * - Land uses: parking lots, pocket parks, plazas, service alleys
 * - Street infrastructure: streetlights, traffic signals, road signs, bus shelters, benches, hydrants, trees
 */
export function generateAmericanMetropolis() {
  const buildings: BuildingData[] = [];
  const props: StreetPropData = {
    streetlights: [],
    trafficSignals: [],
    roadSigns: [],
    busShelters: [],
    benches: [],
    trashBins: [],
    fireHydrants: [],
    trees: [],
    parkingMeters: [],
  };
  const ground: UrbanGroundData = {
    parkingLots: [],
    pocketParks: [],
    civicPlazas: [],
    serviceAlleys: [],
    wheelStops: [],
  };

  // Outer city grid sectors surrounding the central [-64, +64] portfolio district
  const gridCoords = [-320, -250, -185, -130, -78, 78, 130, 185, 250, 320];

  gridCoords.forEach((cx, cIdx) => {
    gridCoords.forEach((cz, rIdx) => {
      // 1. STRICT EXPLORABLE BOUNDARY CHECK: Never place scenery inside the central playable district!
      if (Math.abs(cx) < 70 && Math.abs(cz) < 70) return;

      const dist = Math.hypot(cx, cz);
      const rng = seededRandom(cIdx * 7919 + rIdx * 5449 + 101);

      // 2. URBAN LAND USE ASSIGNMENTS (Pockets of open land, parking lots, parks, plazas)
      const landUseRoll = rng();

      // Pocket Park (12% of blocks)
      if (landUseRoll < 0.12 && dist < 260) {
        ground.pocketParks.push({
          pos: [cx, 0.21, cz],
          size: [48, 48],
        });
        // Add shade trees around the park
        for (let t = 0; t < 5; t++) {
          const tx = cx + (rng() - 0.5) * 36;
          const tz = cz + (rng() - 0.5) * 36;
          props.trees.push({ pos: [tx, 0.22, tz], scale: 0.85 + rng() * 0.4 });
        }
        // Park benches along perimeter
        props.benches.push(
          { pos: [cx - 18, 0.22, cz], rotY: Math.PI / 2 },
          { pos: [cx + 18, 0.22, cz], rotY: -Math.PI / 2 },
          { pos: [cx, 0.22, cz - 18], rotY: 0 },
          { pos: [cx, 0.22, cz + 18], rotY: Math.PI }
        );
        props.trashBins.push({ pos: [cx - 16, 0.22, cz + 16] });
        return;
      }

      // Surface Commercial Parking Lot (15% of blocks)
      if (landUseRoll >= 0.12 && landUseRoll < 0.27 && dist < 280) {
        ground.parkingLots.push({
          pos: [cx, 0.21, cz],
          size: [52, 52],
        });
        // Concrete wheel stops along stalls
        for (let ws = -18; ws <= 18; ws += 6) {
          ground.wheelStops.push({ pos: [cx + ws, 0.22, cz - 16], rotY: 0 });
          ground.wheelStops.push({ pos: [cx + ws, 0.22, cz + 16], rotY: 0 });
        }
        // Parking lot perimeter light poles
        props.streetlights.push(
          { pos: [cx - 22, 0.22, cz - 22], rotY: Math.PI / 4 },
          { pos: [cx + 22, 0.22, cz + 22], rotY: -Math.PI * 0.75 }
        );
        return;
      }

      // Civic Plaza / Service Courtyard (6% of blocks)
      if (landUseRoll >= 0.27 && landUseRoll < 0.33) {
        ground.civicPlazas.push({
          pos: [cx, 0.21, cz],
          size: [50, 50],
        });
        props.trees.push(
          { pos: [cx - 14, 0.22, cz - 14], scale: 0.9 },
          { pos: [cx + 14, 0.22, cz - 14], scale: 0.9 },
          { pos: [cx - 14, 0.22, cz + 14], scale: 0.9 },
          { pos: [cx + 14, 0.22, cz + 14], scale: 0.9 }
        );
        props.benches.push({ pos: [cx, 0.22, cz - 12], rotY: 0 });
        return;
      }

      // 3. BUILDING PLACEMENT & LOT SUBDIVISION
      // Near and mid blocks (dist < 240m) often split into 2 distinct lots
      const isDualLot = rng() > 0.45 && dist < 240;
      const subLots = isDualLot ? 2 : 1;

      for (let sub = 0; sub < subLots; sub++) {
        const lotOffsetX = isDualLot ? (sub === 0 ? -14 : 14) : (rng() - 0.5) * 6;
        const lotOffsetZ = (rng() - 0.5) * 6;
        const bx = cx + lotOffsetX;
        const bz = cz + lotOffsetZ;

        // Double check boundary after offset
        if (Math.abs(bx) < 70 && Math.abs(bz) < 70) continue;

        // Service Alley between dual buildings
        if (isDualLot && sub === 0) {
          ground.serviceAlleys.push({
            pos: [cx, 0.21, cz],
            size: [6, 44],
          });
        }

        // ====================================================================
        // ZONE 1: IMMEDIATE PERIMETER (70m - 140m)
        // Pedestrian-scale downtown architecture with rich street-level detail:
        // - Chicago brick commercial buildings with storefronts & fabric awnings
        // - Residential apartment buildings with balconies & entrance stoops
        // - Low-rise retail outparcels / bank branches (6m - 16m)
        // - Hotels with porte-cochere canopies
        // ====================================================================
        if (dist < 140) {
          const typeRoll = rng();

          // 1A. Commercial Brick Building with Storefronts & Awnings
          if (typeRoll < 0.40) {
            const h = 22 + rng() * 20; // 22m - 42m (6-11 stories)
            const w = isDualLot ? 18 + rng() * 4 : 26 + rng() * 6;
            const d = isDualLot ? 22 + rng() * 4 : 26 + rng() * 6;

            const bld: BuildingData = {
              id: `bld-comm-${cIdx}-${rIdx}-${sub}`,
              archetype: 'commercial-brick',
              center: [bx, bz],
              rotationY: 0,
              // Ground floor retail storefront
              podium: {
                w,
                h: 5.5,
                d,
                y: 2.75 + 0.20,
                mat: 'storefront',
                awnings: [
                  {
                    w: w * 0.42,
                    h: 1.2,
                    d: 2.2,
                    y: 3.6 + 0.20,
                    z: bz + d / 2 + 1.1,
                    color: rng() > 0.5 ? 'navy' : rng() > 0.5 ? 'burgundy' : 'green',
                  },
                ],
              },
              shaft: {
                w: w * 0.96,
                h: h - 5.5,
                d: d * 0.96,
                y: 5.5 + (h - 5.5) / 2 + 0.20,
                mat: 'urbanBrick',
              },
              // Traditional American rooftop wooden water tower
              waterTank: {
                radius: 2.4,
                height: 4.8,
                y: h + 2.4 + 0.20,
                legH: 3.2,
              },
              rooftopEquipment: [
                {
                  w: w * 0.35,
                  h: 3.8,
                  d: d * 0.35,
                  y: h + 1.9 + 0.20,
                },
              ],
            };

            // Fire escapes on the side facade facing alley
            const feFloors = Math.floor(h / 3.8) - 1;
            const feList: { w: number; h: number; d: number; x: number; y: number; z: number }[] = [];
            for (let f = 1; f < feFloors; f++) {
              feList.push({
                w: 1.6,
                h: 0.15,
                d: 3.2,
                x: bx + (sub === 0 ? w / 2 + 0.8 : -w / 2 - 0.8),
                y: f * 3.8 + 0.20,
                z: bz,
              });
            }
            bld.fireEscapes = feList;

            buildings.push(bld);
          }
          // 1B. Residential Apartment Building with Balconies & Stoop
          else if (typeRoll < 0.70) {
            const h = 20 + rng() * 22; // 20m - 42m (6-12 stories)
            const w = isDualLot ? 18 + rng() * 3 : 24 + rng() * 5;
            const d = isDualLot ? 20 + rng() * 3 : 24 + rng() * 5;

            const bld: BuildingData = {
              id: `bld-res-${cIdx}-${rIdx}-${sub}`,
              archetype: 'residential-apt',
              center: [bx, bz],
              rotationY: 0,
              podium: {
                w,
                h: 4.5,
                d,
                y: 2.25 + 0.20,
                mat: 'precastConcrete',
                stoop: {
                  w: 4.5,
                  h: 1.0,
                  d: 2.4,
                  y: 0.5 + 0.20,
                  offsetZ: d / 2 + 1.2,
                },
                canopy: {
                  w: 5.2,
                  h: 0.35,
                  d: 2.2,
                  y: 3.8 + 0.20,
                  offsetZ: d / 2 + 1.1,
                },
              },
              shaft: {
                w,
                h: h - 4.5,
                d,
                y: 4.5 + (h - 4.5) / 2 + 0.20,
                mat: 'residentialApartment',
              },
              rooftopEquipment: [
                {
                  w: w * 0.38,
                  h: 3.5,
                  d: d * 0.38,
                  y: h + 1.75 + 0.20,
                },
              ],
            };

            // Projecting cantilevered balconies on front facade
            const balcFloors = Math.floor(h / 3.6) - 1;
            const balcList: { w: number; h: number; d: number; x: number; y: number; z: number }[] = [];
            for (let f = 2; f < balcFloors; f++) {
              balcList.push({
                w: 4.2,
                h: 0.95,
                d: 1.4,
                x: bx,
                y: f * 3.6 + 0.20,
                z: bz + d / 2 + 0.7,
              });
            }
            bld.balconies = balcList;

            buildings.push(bld);
          }
          // 1C. Low-Rise Retail Outparcel / Bank Branch (6m - 16m)
          else if (typeRoll < 0.88) {
            const h = 8 + rng() * 8; // 8m - 16m (2-4 stories)
            const w = isDualLot ? 16 + rng() * 4 : 28 + rng() * 8;
            const d = 18 + rng() * 6;

            buildings.push({
              id: `bld-outp-${cIdx}-${rIdx}-${sub}`,
              archetype: 'retail-outparcel',
              center: [bx, bz],
              rotationY: 0,
              podium: {
                w,
                h: 4.8,
                d,
                y: 2.4 + 0.20,
                mat: 'storefront',
                canopy: {
                  w: w * 0.65,
                  h: 0.4,
                  d: 3.0,
                  y: 4.2 + 0.20,
                  offsetZ: d / 2 + 1.5,
                },
              },
              shaft: {
                w,
                h: h - 4.8,
                d,
                y: 4.8 + (h - 4.8) / 2 + 0.20,
                mat: 'precastConcrete',
              },
              rooftopEquipment: [
                {
                  w: 6,
                  h: 2.2,
                  d: 6,
                  y: h + 1.1 + 0.20,
                },
              ],
            });
          }
          // 1D. Hotel & Mixed-Use Complex with Porte-Cochere
          else {
            const h = 38 + rng() * 18; // 38m - 56m
            const w = 24 + rng() * 6;
            const d = 24 + rng() * 6;

            buildings.push({
              id: `bld-hotel-${cIdx}-${rIdx}-${sub}`,
              archetype: 'hotel-tower',
              center: [bx, bz],
              rotationY: 0,
              podium: {
                w: w + 4,
                h: 6.5,
                d: d + 4,
                y: 3.25 + 0.20,
                mat: 'precastConcrete',
                // Grand Porte-cochère drive-up canopy
                canopy: {
                  w: 9.0,
                  h: 0.5,
                  d: 5.5,
                  y: 4.5 + 0.20,
                  offsetZ: d / 2 + 4.5,
                },
              },
              shaft: {
                w,
                h: h - 6.5,
                d,
                y: 6.5 + (h - 6.5) / 2 + 0.20,
                mat: 'corporateGlass',
              },
              rooftopEquipment: [
                {
                  w: w * 0.45,
                  h: 4.5,
                  d: d * 0.45,
                  y: h + 2.25 + 0.20,
                },
              ],
            });
          }
        }
        // ====================================================================
        // ZONE 2: MID-DISTANCE COMMERCIAL & OFFICE TOWERS (140m - 250m)
        // Mid-rise and high-rise commercial corporate architecture:
        // - Glass curtain-wall facades, aluminum framing, realistic setbacks
        // - Multi-tiered podium bases, rooftop HVAC chiller penthouses
        // ====================================================================
        else if (dist < 250) {
          const isModernOffice = rng() > 0.4;
          const h = 42 + rng() * 45; // 42m - 87m tall
          const w = isDualLot ? 22 + rng() * 4 : 30 + rng() * 6;
          const d = isDualLot ? 22 + rng() * 4 : 30 + rng() * 6;

          const baseH = h * 0.65;
          const setbackH = h * 0.35;
          const setbackW = w * 0.72;
          const setbackD = d * 0.72;

          buildings.push({
            id: `bld-mid-${cIdx}-${rIdx}-${sub}`,
            archetype: 'modern-office',
            center: [bx, bz],
            rotationY: 0,
            podium: {
              w: w + 2,
              h: 7.0,
              d: d + 2,
              y: 3.5 + 0.20,
              mat: 'precastConcrete',
              canopy: {
                w: 8.5,
                h: 0.45,
                d: 3.5,
                y: 4.8 + 0.20,
                offsetZ: d / 2 + 2.5,
              },
            },
            shaft: {
              w,
              h: baseH - 7.0,
              d,
              y: 7.0 + (baseH - 7.0) / 2 + 0.20,
              mat: isModernOffice ? 'curtainGlass' : 'corporateGlass',
            },
            setbacks: [
              {
                w: setbackW,
                h: setbackH,
                d: setbackD,
                y: baseH + setbackH / 2 + 0.20,
                mat: isModernOffice ? 'curtainGlass' : 'precastConcrete',
              },
            ],
            rooftopEquipment: [
              {
                w: setbackW * 0.5,
                h: 5.5,
                d: setbackD * 0.5,
                y: baseH + setbackH + 2.75 + 0.20,
              },
            ],
            spire: rng() > 0.45 ? {
              radius: 0.4,
              height: 14 + rng() * 10,
              y: h + 0.20,
            } : undefined,
          });
        }
        // ====================================================================
        // ZONE 3: DISTANT SKYLINE SKYLINE TOWERS (250m - 420m)
        // High-rise skyscrapers (70m - 165m) clustered along avenue corridors
        // Stepped crowns, architectural spires, iconic silhouettes
        // ====================================================================
        else {
          // Concentrate tallest towers along arterial avenue corridors
          const isAvenueCorridor = Math.abs(bx) < 240 || Math.abs(bz) < 240;
          const h = isAvenueCorridor ? 85 + rng() * 75 : 45 + rng() * 45; // up to 160m!
          const w = 28 + rng() * 8;
          const d = 28 + rng() * 8;

          const isStepped = h > 75;
          const tier1H = isStepped ? h * 0.55 : h;
          const tier2H = isStepped ? h * 0.30 : 0;
          const tier3H = isStepped ? h * 0.15 : 0;

          const bld: BuildingData = {
            id: `bld-sky-${cIdx}-${rIdx}-${sub}`,
            archetype: 'landmark-skyscraper',
            center: [bx, bz],
            rotationY: 0,
            shaft: {
              w,
              h: tier1H,
              d,
              y: tier1H / 2 + 0.20,
              mat: rng() > 0.3 ? 'curtainGlass' : 'flutedStone',
            },
          };

          if (isStepped) {
            bld.setbacks = [
              {
                w: w * 0.72,
                h: tier2H,
                d: d * 0.72,
                y: tier1H + tier2H / 2 + 0.20,
                mat: 'curtainGlass',
              },
              {
                w: w * 0.48,
                h: tier3H,
                d: d * 0.48,
                y: tier1H + tier2H + tier3H / 2 + 0.20,
                mat: 'flutedStone',
              },
            ];
            bld.rooftopEquipment = [
              {
                w: w * 0.3,
                h: 6.0,
                d: d * 0.3,
                y: h + 3.0 + 0.20,
              },
            ];
            bld.spire = {
              radius: 0.5,
              height: 22 + rng() * 18,
              y: h + 0.20,
            };
          } else {
            bld.rooftopEquipment = [
              {
                w: w * 0.4,
                h: 5.0,
                d: d * 0.4,
                y: h + 2.5 + 0.20,
              },
            ];
          }

          buildings.push(bld);
        }
      }
    });
  });

  // 4. GENERATE OPTIMIZED STREET INFRASTRUCTURE ALONG OUTER ROADS
  const avenueXs = [-260, -190, -125, -60, -20, 20, 60, 125, 190, 260];
  const streetZs = [-260, -190, -125, -60, -20, 20, 60, 125, 190, 260];

  // A. Streetlights along Avenue Sidewalks (Every 38m)
  avenueXs.forEach((ax) => {
    for (let z = -280; z <= 280; z += 38) {
      // Do not populate central reserved portfolio blocks interior
      if (Math.abs(ax) < 65 && Math.abs(z) < 65) continue;
      // West sidewalk pole
      props.streetlights.push({ pos: [ax - 5.8, 0.20, z], rotY: Math.PI / 2 });
      // East sidewalk pole
      props.streetlights.push({ pos: [ax + 5.8, 0.20, z], rotY: -Math.PI / 2 });
    }
  });

  // B. Traffic Signal Mast Arms at Outer Intersections
  avenueXs.forEach((ax) => {
    streetZs.forEach((sz) => {
      // Skip central 4 intersections
      if (Math.abs(ax) <= 60 && Math.abs(sz) <= 60) return;
      props.trafficSignals.push({ pos: [ax + 5.5, 0.20, sz + 5.5], rotY: -Math.PI / 4 });
      props.trafficSignals.push({ pos: [ax - 5.5, 0.20, sz - 5.5], rotY: Math.PI * 0.75 });
    });
  });

  // C. Street Signs (Street Name Blades & Speed Limits)
  avenueXs.forEach((ax, idx) => {
    streetZs.forEach((sz) => {
      if (Math.abs(ax) < 65 && Math.abs(sz) < 65) return;
      if (idx % 2 === 0) {
        props.roadSigns.push({
          pos: [ax - 5.6, 0.20, sz + 5.6],
          rotY: 0,
          type: 'street',
        });
      } else {
        props.roadSigns.push({
          pos: [ax - 5.6, 0.20, sz + 5.6],
          rotY: 0,
          type: 'speed',
        });
      }
    });
  });

  // D. Bus Transit Shelters (Placed along major avenue stops)
  [-125, 125].forEach((ax) => {
    [-170, -85, 85, 170].forEach((sz) => {
      props.busShelters.push({ pos: [ax + 6.2, 0.20, sz], rotY: -Math.PI / 2 });
      props.benches.push({ pos: [ax + 6.2, 0.20, sz + 3.5], rotY: -Math.PI / 2 });
      props.trashBins.push({ pos: [ax + 6.2, 0.20, sz - 3.5] });
    });
  });

  // E. Fire Hydrants along sidewalk curbs near intersections
  avenueXs.forEach((ax) => {
    streetZs.forEach((sz) => {
      if (Math.abs(ax) < 65 && Math.abs(sz) < 65) return;
      props.fireHydrants.push({ pos: [ax + 5.4, 0.20, sz - 8.0] });
    });
  });

  // F. Parking Meters along commercial blocks
  [-90, 90, -130, 130].forEach((ax) => {
    for (let z = -140; z <= 140; z += 18) {
      if (Math.abs(z) < 65) continue;
      props.parkingMeters.push({ pos: [ax - 5.4, 0.20, z] });
    }
  });

  return { buildings, props, ground };
}
