'use client';

import React from 'react';
import * as THREE from 'three';
import { RoadSegment, RoadSegmentProps } from './RoadSegment';
import { Intersection, IntersectionProps } from './Intersection';
import { Sidewalk } from './Sidewalk';
import { BuildingPlot } from './BuildingPlot';

// Re-export subcomponents for modular external usage
export { RoadSegment } from './RoadSegment';
export { Intersection } from './Intersection';
export { Sidewalk } from './Sidewalk';
export { BuildingPlot } from './BuildingPlot';

/**
 * CityRoadNetwork Component
 * Constructs the stylized 3D city road grid and sidewalk network:
 * - Main North-South arterial avenue (X = 0, 5.6m wide, 2-lane with dashed center lines)
 * - Main East-West cross boulevard (Z = 0, 5.6m wide, 2-lane with dashed center lines)
 * - Secondary connecting grid streets forming readable city blocks
 * - Clean intersection junctions with NO overlapping dashed lines
 * - High-visibility zebra pedestrian crossings at every junction approach
 * - Raised light-gray sidewalks with curbs (0.10m step)
 * - Small lush grass buffer strips between sidewalks and building lots
 * - Reserved empty plots for 6 portfolio buildings
 * - Zero z-fighting: road @ 0.62, markings @ 0.625/0.626, sidewalks @ 0.72, plots @ 0.74
 */
interface CityRoadNetworkProps {
  onRoadClick?: (point: THREE.Vector3) => void;
}

export const CityRoadNetwork: React.FC<CityRoadNetworkProps> = ({ onRoadClick }) => {
  return (
    <group
      name="CityRoadNetwork"
      onClick={(e) => {
        e.stopPropagation();
        if (onRoadClick) {
          onRoadClick(e.point);
        }
      }}
    >
      {/* ======================================================== */}
      {/* 1. INTERSECTIONS (9 Clean Junctions with Zebra Crossings)*/}
      {/* ======================================================== */}
      {/* Center Grand Crossroads (Main N-S x Main E-W) */}
      <Intersection
        position={[0, 0, 0]}
        sizeX={5.6}
        sizeZ={5.6}
        crossings={{ north: true, south: true, east: true, west: true }}
      />

      {/* North Junction (Main N-S x North Cross Street) */}
      <Intersection
        position={[0, 0, -14]}
        sizeX={5.6}
        sizeZ={4.2}
        crossings={{ north: true, south: true, east: true, west: true }}
      />

      {/* South Junction (Main N-S x South Cross Street) */}
      <Intersection
        position={[0, 0, 14]}
        sizeX={5.6}
        sizeZ={4.2}
        crossings={{ north: true, south: true, east: true, west: true }}
      />

      {/* West Junction (Main E-W x West Street) */}
      <Intersection
        position={[-15, 0, 0]}
        sizeX={4.2}
        sizeZ={5.6}
        crossings={{ north: true, south: true, east: true, west: true }}
      />

      {/* East Junction (Main E-W x East Street) */}
      <Intersection
        position={[15, 0, 0]}
        sizeX={4.2}
        sizeZ={5.6}
        crossings={{ north: true, south: true, east: true, west: true }}
      />

      {/* Northwest Corner Junction */}
      <Intersection
        position={[-15, 0, -14]}
        sizeX={4.2}
        sizeZ={4.2}
        crossings={{ north: true, south: true, east: true, west: true }}
      />

      {/* Northeast Corner Junction */}
      <Intersection
        position={[15, 0, -14]}
        sizeX={4.2}
        sizeZ={4.2}
        crossings={{ north: true, south: true, east: true, west: true }}
      />

      {/* Southwest Corner Junction */}
      <Intersection
        position={[-15, 0, 14]}
        sizeX={4.2}
        sizeZ={4.2}
        crossings={{ north: true, south: true, east: true, west: true }}
      />

      {/* Southeast Corner Junction */}
      <Intersection
        position={[15, 0, 14]}
        sizeX={4.2}
        sizeZ={4.2}
        crossings={{ north: true, south: true, east: true, west: true }}
      />

      {/* ======================================================== */}
      {/* 2. MAIN ARTERIAL ROAD SEGMENTS (North-South, X = 0)      */}
      {/* ======================================================== */}
      {/* Central North Segment (between center and North intersection) */}
      <RoadSegment
        position={[0, 0, -7.35]}
        width={5.6}
        length={9.1}
        orientation="z"
      />

      {/* Central South Segment (between center and South intersection) */}
      <RoadSegment
        position={[0, 0, 7.35]}
        width={5.6}
        length={9.1}
        orientation="z"
      />

      {/* Far North Segment (approach to Contact Hub) */}
      <RoadSegment
        position={[0, 0, -16.85]}
        width={5.6}
        length={1.5}
        orientation="z"
        hasCenterLine={false}
      />

      {/* Far South Segment (approach to Experience Office Gateway) */}
      <RoadSegment
        position={[0, 0, 16.85]}
        width={5.6}
        length={1.5}
        orientation="z"
        hasCenterLine={false}
      />

      {/* ======================================================== */}
      {/* 3. MAIN ARTERIAL ROAD SEGMENTS (East-West, Z = 0)        */}
      {/* ======================================================== */}
      {/* Central West Segment (between center and West intersection) */}
      <RoadSegment
        position={[-7.85, 0, 0]}
        width={5.6}
        length={10.1}
        orientation="x"
      />

      {/* Central East Segment (between center and East intersection) */}
      <RoadSegment
        position={[7.85, 0, 0]}
        width={5.6}
        length={10.1}
        orientation="x"
      />

      {/* Far West Segment */}
      <RoadSegment
        position={[-21.5, 0, 0]}
        width={5.6}
        length={8.8}
        orientation="x"
      />

      {/* Far East Segment */}
      <RoadSegment
        position={[21.5, 0, 0]}
        width={5.6}
        length={8.8}
        orientation="x"
      />

      {/* ======================================================== */}
      {/* 4. CONNECTING STREET SEGMENTS (North Cross Street, Z=-14) */}
      {/* ======================================================== */}
      <RoadSegment
        position={[-7.85, 0, -14]}
        width={4.2}
        length={10.1}
        orientation="x"
      />
      <RoadSegment
        position={[7.85, 0, -14]}
        width={4.2}
        length={10.1}
        orientation="x"
      />
      <RoadSegment
        position={[-20.5, 0, -14]}
        width={4.2}
        length={6.8}
        orientation="x"
      />
      <RoadSegment
        position={[20.5, 0, -14]}
        width={4.2}
        length={6.8}
        orientation="x"
      />

      {/* ======================================================== */}
      {/* 5. CONNECTING STREET SEGMENTS (South Cross Street, Z=14)  */}
      {/* ======================================================== */}
      <RoadSegment
        position={[-7.85, 0, 14]}
        width={4.2}
        length={10.1}
        orientation="x"
      />
      <RoadSegment
        position={[7.85, 0, 14]}
        width={4.2}
        length={10.1}
        orientation="x"
      />
      <RoadSegment
        position={[-20.5, 0, 14]}
        width={4.2}
        length={6.8}
        orientation="x"
      />
      <RoadSegment
        position={[20.5, 0, 14]}
        width={4.2}
        length={6.8}
        orientation="x"
      />

      {/* ======================================================== */}
      {/* 6. CONNECTING STREET SEGMENTS (West Street, X=-15)       */}
      {/* ======================================================== */}
      <RoadSegment
        position={[-15, 0, -7.35]}
        width={4.2}
        length={9.1}
        orientation="z"
      />
      <RoadSegment
        position={[-15, 0, 7.35]}
        width={4.2}
        length={9.1}
        orientation="z"
      />
      <RoadSegment
        position={[-15, 0, -20.0]}
        width={4.2}
        length={7.8}
        orientation="z"
      />
      <RoadSegment
        position={[-15, 0, 20.0]}
        width={4.2}
        length={7.8}
        orientation="z"
      />

      {/* ======================================================== */}
      {/* 7. CONNECTING STREET SEGMENTS (East Street, X=15)        */}
      {/* ======================================================== */}
      <RoadSegment
        position={[15, 0, -7.35]}
        width={4.2}
        length={9.1}
        orientation="z"
      />
      <RoadSegment
        position={[15, 0, 7.35]}
        width={4.2}
        length={9.1}
        orientation="z"
      />
      <RoadSegment
        position={[15, 0, -20.0]}
        width={4.2}
        length={7.8}
        orientation="z"
      />
      <RoadSegment
        position={[15, 0, 20.0]}
        width={4.2}
        length={7.8}
        orientation="z"
      />

      {/* ======================================================== */}
      {/* 8. RAISED SIDEWALKS (Framing Roads with Curbs)           */}
      {/* ======================================================== */}
      {/* Main N-S Avenue Sidewalks (West & East of X = 0) */}
      <Sidewalk
        position={[-3.3, 0, -7.35]}
        width={1.0}
        length={9.1}
        orientation="z"
        curbSide="right"
      />
      <Sidewalk
        position={[3.3, 0, -7.35]}
        width={1.0}
        length={9.1}
        orientation="z"
        curbSide="left"
      />
      <Sidewalk
        position={[-3.3, 0, 7.35]}
        width={1.0}
        length={9.1}
        orientation="z"
        curbSide="right"
      />
      <Sidewalk
        position={[3.3, 0, 7.35]}
        width={1.0}
        length={9.1}
        orientation="z"
        curbSide="left"
      />

      {/* Main E-W Boulevard Sidewalks (North & South of Z = 0) */}
      <Sidewalk
        position={[-7.85, 0, -3.3]}
        width={1.0}
        length={10.1}
        orientation="x"
        curbSide="left"
      />
      <Sidewalk
        position={[-7.85, 0, 3.3]}
        width={1.0}
        length={10.1}
        orientation="x"
        curbSide="right"
      />
      <Sidewalk
        position={[7.85, 0, -3.3]}
        width={1.0}
        length={10.1}
        orientation="x"
        curbSide="left"
      />
      <Sidewalk
        position={[7.85, 0, 3.3]}
        width={1.0}
        length={10.1}
        orientation="x"
        curbSide="right"
      />

      {/* North Cross Street Sidewalks (Z = -14) */}
      <Sidewalk
        position={[-7.85, 0, -11.4]}
        width={1.0}
        length={10.1}
        orientation="x"
        curbSide="right"
      />
      <Sidewalk
        position={[-7.85, 0, -16.6]}
        width={1.0}
        length={10.1}
        orientation="x"
        curbSide="left"
      />
      <Sidewalk
        position={[7.85, 0, -11.4]}
        width={1.0}
        length={10.1}
        orientation="x"
        curbSide="right"
      />
      <Sidewalk
        position={[7.85, 0, -16.6]}
        width={1.0}
        length={10.1}
        orientation="x"
        curbSide="left"
      />

      {/* South Cross Street Sidewalks (Z = 14) */}
      <Sidewalk
        position={[-7.85, 0, 11.4]}
        width={1.0}
        length={10.1}
        orientation="x"
        curbSide="left"
      />
      <Sidewalk
        position={[-7.85, 0, 16.6]}
        width={1.0}
        length={10.1}
        orientation="x"
        curbSide="right"
      />
      <Sidewalk
        position={[7.85, 0, 11.4]}
        width={1.0}
        length={10.1}
        orientation="x"
        curbSide="left"
      />
      <Sidewalk
        position={[7.85, 0, 16.6]}
        width={1.0}
        length={10.1}
        orientation="x"
        curbSide="right"
      />

      {/* West Street Sidewalks (X = -15) */}
      <Sidewalk
        position={[-12.4, 0, -7.35]}
        width={1.0}
        length={9.1}
        orientation="z"
        curbSide="left"
      />
      <Sidewalk
        position={[-17.6, 0, -7.35]}
        width={1.0}
        length={9.1}
        orientation="z"
        curbSide="right"
      />
      <Sidewalk
        position={[-12.4, 0, 7.35]}
        width={1.0}
        length={9.1}
        orientation="z"
        curbSide="left"
      />
      <Sidewalk
        position={[-17.6, 0, 7.35]}
        width={1.0}
        length={9.1}
        orientation="z"
        curbSide="right"
      />

      {/* East Street Sidewalks (X = 15) */}
      <Sidewalk
        position={[12.4, 0, -7.35]}
        width={1.0}
        length={9.1}
        orientation="z"
        curbSide="right"
      />
      <Sidewalk
        position={[17.6, 0, -7.35]}
        width={1.0}
        length={9.1}
        orientation="z"
        curbSide="left"
      />
      <Sidewalk
        position={[12.4, 0, 7.35]}
        width={1.0}
        length={9.1}
        orientation="z"
        curbSide="right"
      />
      <Sidewalk
        position={[17.6, 0, 7.35]}
        width={1.0}
        length={9.1}
        orientation="z"
        curbSide="left"
      />

      {/* ======================================================== */}
      {/* 9. RESERVED EMPTY PLOTS FOR SIX PORTFOLIO BUILDINGS      */}
      {/* ======================================================== */}
      {/* Plot 01: Northwest Central Block (Hero Headquarters) */}
      <BuildingPlot
        id="hero-hq"
        plotNumber="01"
        name="HERO HEADQUARTERS"
        category="Flagship Tech Campus"
        color="#00f0ff" // Cyan
        position={[-7.85, 0, -7.35]}
        sizeX={8.1}
        sizeZ={7.1}
      />

      {/* Plot 02: Northeast Central Block (About Me Creative Studio) */}
      <BuildingPlot
        id="about-me"
        plotNumber="02"
        name="ABOUT ME STUDIO"
        category="Creative Studio & Journey"
        color="#f97316" // Warm Terracotta Orange
        position={[7.85, 0, -7.35]}
        sizeX={8.1}
        sizeZ={7.1}
      />

      {/* Plot 03: Southwest Central Block (Projects Innovation Center) */}
      <BuildingPlot
        id="projects-center"
        plotNumber="03"
        name="PROJECTS INNOVATION CENTER"
        category="Tech Exhibition & Gallery"
        color="#8b5cf6" // Violet / Purple
        position={[-7.85, 0, 7.35]}
        sizeX={8.1}
        sizeZ={7.1}
      />

      {/* Plot 04: Southeast Central Block (Skills Tech Tower) */}
      <BuildingPlot
        id="skills-tower"
        plotNumber="04"
        name="SKILLS TECH TOWER"
        category="Engineering Stack & Tools"
        color="#06b6d4" // Teal / Cyan
        position={[7.85, 0, 7.35]}
        sizeX={8.1}
        sizeZ={7.1}
      />

      {/* Plot 05: North Plaza (Contact Hub) */}
      <BuildingPlot
        id="contact-hub"
        plotNumber="05"
        name="CONTACT HUB"
        category="Connect & Communication"
        color="#ec4899" // Hot Pink & Cyan
        position={[0, 0, -21.5]}
        sizeX={9.5}
        sizeZ={7.8}
      />

      {/* Plot 06: South Enterprise Gateway (Experience Office) */}
      <BuildingPlot
        id="experience-office"
        plotNumber="06"
        name="EXPERIENCE OFFICE"
        category="InnSpark HQ & Career Timeline"
        color="#0284c7" // Corporate Blue
        position={[0, 0, 21.5]}
        sizeX={9.5}
        sizeZ={7.8}
      />
    </group>
  );
};

