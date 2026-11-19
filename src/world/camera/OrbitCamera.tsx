import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { WORLD_CONFIG } from '../WorldConfig';
import { useWorldStore } from '../stores/worldStore';

export const OrbitCamera: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const preset = useWorldStore((s) => s.cameraPreset);

  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3(...WORLD_CONFIG.camera.orbitSpawn));
  const targetLook = useRef<THREE.Vector3>(new THREE.Vector3(...WORLD_CONFIG.camera.orbitTarget));
  const isTransitioning = useRef<boolean>(false);
  const isFirstMount = useRef<boolean>(true);

  // 1. Ensure Camera FOV is reset to standard 48° for Orbit Mode on mount
  useEffect(() => {
    const persCam = camera as THREE.PerspectiveCamera;
    if (persCam.isPerspectiveCamera && persCam.fov !== WORLD_CONFIG.camera.fov) {
      persCam.fov = WORLD_CONFIG.camera.fov;
      persCam.updateProjectionMatrix();
    }
  }, [camera]);

  // 2. Global Camera Recovery Trigger & Key Shortcut (R)
  useEffect(() => {
    const handleReset = () => {
      console.log('[OrbitCamera] Resetting camera to default downtown view [0, 165, 215] -> [0, 12, 0]');
      const spawn = WORLD_CONFIG.camera.orbitSpawn;
      const target = WORLD_CONFIG.camera.orbitTarget;
      camera.position.set(spawn[0], spawn[1], spawn[2]);
      camera.up.set(0, 1, 0);
      camera.lookAt(target[0], target[1], target[2]);
      const persCam = camera as THREE.PerspectiveCamera;
      if (persCam.isPerspectiveCamera) {
        persCam.fov = WORLD_CONFIG.camera.fov;
        persCam.updateProjectionMatrix();
      }
      if (controlsRef.current) {
        controlsRef.current.target.set(target[0], target[1], target[2]);
        controlsRef.current.update();
      }
      targetPos.current.set(spawn[0], spawn[1], spawn[2]);
      targetLook.current.set(target[0], target[1], target[2]);
      isTransitioning.current = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in input, ignore
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'r' || e.key === 'R') {
        handleReset();
      }
    };

    window.addEventListener('reset-camera', handleReset);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('reset-camera', handleReset);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [camera]);

  useEffect(() => {
    let spawn = WORLD_CONFIG.camera.orbitSpawn;
    let target = WORLD_CONFIG.camera.orbitTarget;

    if (preset === 'aerial_overview' || preset === 'downtown_overview' || preset === 'orbit') {
      // 1. High-altitude aerial overview showing the entire playable downtown and surrounding city
      spawn = [0, 165, 215];
      target = [0, 12, 0];
    } else if (preset === 'aerial_transition') {
      // 2. Low-altitude aerial perspective showing transition from detailed buildings to background neighborhoods
      spawn = [-115, 68, -85];
      target = [-185, 14, -185];
    } else if (preset === 'street_skyline') {
      // 3. Street-level view looking toward the distant skyline down 2nd Avenue
      spawn = [-60, 2.2, 50];
      target = [-60, 8.0, -220];
    } else if (preset === 'outer_boundary') {
      // 4. Outer city boundary showing connected roads and buildings crossing from Zone A to Zone B
      spawn = [-130, 42, -60];
      target = [-195, 14, -60];
    } else if (preset === 'full_island_aerial') {
      // 1. Full Island Aerial Overview showing complete coastal city surrounded by ocean
      spawn = [0, 540, 690];
      target = [0, 0, 0];
    } else if (preset === 'city_to_coast_transition') {
      // 2. Downtown-to-Coast Transition showing connecting roads and coastal boulevard
      spawn = [210, 85, -260];
      target = [380, 15, -360];
    } else if (preset === 'waterfront_street_level') {
      // 3. Waterfront Street-Level View along seawall, promenade and piers
      spawn = [510, 8.5, -60];
      target = [510, 7.0, 60];
    } else if (preset === 'harbor_overview') {
      // 4. Harbor Overview across East River commercial piers, cargo terminals and skyline
      spawn = [680, 110, 10];
      target = [450, 15, 10];
    } else if (preset === 'ocean_horizon') {
      // 5. Ocean Horizon View showing wave swell and smooth atmospheric horizon blending
      spawn = [-20, 14.0, 500];
      target = [-20, 12.0, 1200];
    } else if (preset === 'downtown_skyline') {
      // Downtown Skyline View from water looking up at the high-rises
      spawn = [0, 85, 490];
      target = [0, 35, 0];
    } else if (preset === 'waterfront_view') {
      // Waterfront Promenade & Harbor Piers View
      spawn = [550, 24, -100];
      target = [540, 10, 80];
    } else if (preset === 'high_altitude_island') {
      // 4. High-Altitude Isometric Island Overview
      spawn = [540, 720, 540];
      target = [0, 0, 0];
    } else if (preset === 'street_level_downtown') {
      // 5. Street-Level Downtown Ground Canyon
      spawn = [-20, 2.5, -45];
      target = [-20, 2.5, 0];
    } else if (preset === 'max_orbit_distance' || preset === 'max_orbit') {
      // 6. Maximum Orbit Distance showing full geographic island and surrounding ocean
      spawn = [0, 750, 980];
      target = [0, 0, 0];
    } else if (preset === 'cardinal_north') {
      // 7. North Cardinal Perspective (looking South across the island)
      spawn = [0, 260, 820];
      target = [0, 30, 0];
    } else if (preset === 'cardinal_south') {
      // 8. South Cardinal Perspective (looking North from harbor across the island)
      spawn = [0, 260, -820];
      target = [0, 30, 0];
    } else if (preset === 'cardinal_east') {
      // 9. East Cardinal Perspective (looking West across the piers & downtown)
      spawn = [820, 260, 0];
      target = [0, 30, 0];
    } else if (preset === 'cardinal_west') {
      // 10. West Cardinal Perspective (looking East across the coastal bay)
      spawn = [-820, 260, 0];
      target = [0, 30, 0];
    } else if (preset === 'ref_block' || preset === 'ref_three_quarter') {
      spawn = [-28, 16, -48];
      target = [0, 10, -78];
    } else if (preset === 'ref_street_front' || preset === 'ref_block_street') {
      spawn = [0, 2.8, -50];
      target = [0, 3.5, -68];
    } else if (preset === 'ref_elevated_overview' || preset === 'ref_block_orbit') {
      spawn = [0, 56, -34];
      target = [0, 0, -80];
    } else if (preset === 'street_intersection') {
      spawn = [-20, 2.8, -75];
      target = [-20, 1.4, -48];
    } else if (preset === 'facade_close_up' || preset === 'facades') {
      spawn = [-10, 6.2, -62];
      target = [0, 11.5, -78];
    } else if (preset === 'distant_skyline' || preset === 'skyline') {
      spawn = [-110, 42, 160];
      target = [10, 30, -40];
    } else if (preset === 'street_downtown' || preset === 'street') {
      spawn = [-58, 4.5, -35];
      target = [-60, 15, -90];
    } else if (preset === 'central_district') {
      spawn = [0, 95, 95];
      target = [0, 0, 0];
    } else if (preset === 'central_hq_overview') {
      // Phase 2.1.1: Central HQ Overview framing HQ as the centerpiece of the city
      spawn = [28, 48, 42];
      target = [0, 14, 0];
    } else if (preset === 'hq_front_entrance') {
      // Phase 2.1.1: Front Entrance looking at canopy, revolving door & brand signage at [0, 0]
      spawn = [0, 3.5, 22.0];
      target = [0, 4.5, 8.5];
    } else if (preset === 'hq_three_quarter') {
      // Phase 2.1.1: Three-Quarter Architectural Perspective showing L-shape, 38m spire blade & wings
      spawn = [18, 14.0, 22.0];
      target = [0, 10.0, 0];
    } else if (preset === 'hq_elevated_overview') {
      // Phase 2.1.1: Elevated Exterior View showing full campus, roof crown & forecourt at [0, 0]
      spawn = [22, 42.0, 26.0];
      target = [0, 16.0, 0];
    } else if (preset === 'hq_street_level') {
      // Phase 2.1.1: Street-Level Pedestrian Approach along South Sidewalk
      spawn = [0, 1.75, 17.5];
      target = [0, 3.8, 8.5];
    } else if (preset === 'hq_roof_skyline') {
      // Phase 2.1.1: Roof and Skyline View framed against surrounding downtown
      spawn = [-18, 26.0, -18.0];
      target = [2, 22.0, 0];
    } else if (preset === 'innovation_front_entrance') {
      // Phase 2.2: Innovation Center Front Entrance at [40, -40]
      spawn = [40.0, 3.8, -17.5];
      target = [40.0, 4.2, -27.6];
    } else if (preset === 'innovation_three_quarter') {
      // Phase 2.2: Innovation Center Three-Quarter Exterior View
      spawn = [56.0, 16.0, -18.0];
      target = [40.0, 12.0, -40.0];
    } else if (preset === 'innovation_rooftop') {
      // Phase 2.2: Innovation Center Rooftop & Penthouse Crown View
      spawn = [26.0, 36.0, -22.0];
      target = [40.0, 24.0, -42.0];
    } else if (preset === 'innovation_interior_atrium') {
      // Phase 2.2: Innovation Center Interior Atrium & Holographic Media Wall
      spawn = [40.0, 4.8, -24.0];
      target = [40.0, 5.0, -42.0];
    } else if (preset === 'innovation_projects_gallery') {
      // Phase 2.2: Innovation Center Ground-Floor Interactive Projects Gallery
      spawn = [40.0, 2.8, -32.0];
      target = [36.0, 2.0, -40.0];
    } else if (preset === 'innovation_downtown_overview') {
      // Phase 2.2: Downtown Overview framing both Central HQ [0, 0] & Innovation Center [40, -40]
      spawn = [60.0, 58.0, 25.0];
      target = [20.0, 15.0, -20.0];
    } else if (preset === 'innovation_side_facade') {
      // Phase 2.2.1: Innovation Center Articulated West Facade & Vertical Fins
      spawn = [21.0, 10.0, -40.0];
      target = [40.0, 10.0, -40.0];
    } else if (preset === 'ground_plots_closeup') {
      // Phase 2.2.1: Ground Level Plot Survey Pads Close-up (Zero Z-Fighting)
      spawn = [20.0, 4.5, -20.0];
      target = [0.0, 0.24, -40.0];
    } else if (preset === 'both_landmarks_elevated') {
      // Phase 2.2.1: Both landmarks (Central HQ [0, 0] & Innovation Center [40, -40]) elevated overview
      spawn = [38.0, 52.0, 28.0];
      target = [20.0, 12.0, -20.0];
    } else if (preset === 'hq_roof_cleanup') {
      // Phase 2.2.1: Rooftop close-up of Developer HQ Storey 7 clean parapet & equipment
      spawn = [12.0, 36.0, 10.0];
      target = [2.5, 29.0, -3.5];
    } else if (preset === 'directory_board_hq') {
      // Phase 2.2.1: Street-level physical building directory board at HQ entrance
      spawn = [4.5, 1.6, 14.2];
      target = [4.5, 1.1, 10.8];
    } else if (preset === 'directory_board_innovation') {
      // Phase 2.2.1: Street-level physical building directory board at Innovation entrance
      spawn = [44.8, 1.6, -25.2];
      target = [44.8, 1.1, -29.2];
    } else if (preset === 'skills_front_entrance') {
      // Phase 2.3: Skills Tower Front Entrance at [-40, 0] (Facing East)
      spawn = [-16.0, 4.2, 0.0];
      target = [-38.0, 4.2, 0.0];
    } else if (preset === 'skills_three_quarter') {
      // Phase 2.3: Skills Tower Three-Quarter Exterior & Vertical Metallic Fins
      spawn = [-18.0, 24.0, 26.0];
      target = [-40.0, 24.0, 0.0];
    } else if (preset === 'skills_street_approach') {
      // Phase 2.3: Skills Tower Street Approach along Central Avenue
      spawn = [-18.0, 2.2, -22.0];
      target = [-30.0, 4.2, 0.0];
    } else if (preset === 'skills_elevated_overview') {
      // Phase 2.3: Skills Tower Elevated Overview & Sculptural Crown
      spawn = [-12.0, 56.0, 32.0];
      target = [-40.0, 28.0, 0.0];
    } else if (preset === 'skills_lobby') {
      // Phase 2.3: Skills Tower Double-Height Lobby & Interactive Directory Console
      spawn = [-24.0, 3.8, 0.0];
      target = [-42.0, 4.0, 0.0];
    } else if (preset === 'landmarks_skyline') {
      // Phase 2.3: Skyline framing all 3 landmarks (HQ [0, 0], Innovation [40, -40], Skills [-40, 0])
      spawn = [30.0, 82.0, 85.0];
      target = [-5.0, 18.0, -15.0];
    } else if (preset === 'career_front_entrance') {
      // Phase 2.4: Career Center Front Entrance at [40, 0] (Facing West)
      spawn = [16.0, 4.2, 0.0];
      target = [38.0, 4.2, 0.0];
    } else if (preset === 'career_three_quarter') {
      // Phase 2.4: Career Center Three-Quarter Stepped Architectural View
      spawn = [18.0, 24.0, 26.0];
      target = [40.0, 16.0, 0.0];
    } else if (preset === 'career_elevated_overview') {
      // Phase 2.4: Career Center Elevated Overview & Rooftop Terrace
      spawn = [15.0, 48.0, 32.0];
      target = [40.0, 20.0, 0.0];
    } else if (preset === 'career_lobby') {
      // Phase 2.4: Career Center Lobby & 7.2m Illuminated Career Timeline Display
      spawn = [25.0, 3.8, 0.0];
      target = [42.0, 4.0, 0.0];
    } else if (preset === 'career_street_view') {
      // Phase 2.4: Career Center Street-Level Approach & Sidewalk Directory Board
      spawn = [18.0, 2.2, -12.0];
      target = [32.0, 3.2, 0.0];
    } else if (preset === 'four_landmarks_aerial') {
      // Phase 2.4: Aerial framing all 4 landmarks (HQ [0, 0], Innovation [40, -40], Skills [-40, 0], Career [40, 0])
      spawn = [20.0, 95.0, 95.0];
      target = [0.0, 10.0, -10.0];
    } else if (preset === 'about_front_entrance') {
      // Phase 2.5: About Studio South Entrance at [0, -40] (Facing South towards Central Ave)
      spawn = [0.0, 3.8, -17.5];
      target = [0.0, 4.0, -38.0];
    } else if (preset === 'about_three_quarter') {
      // Phase 2.5: About Studio Three-Quarter View & Cantilevered Timber Soffit
      spawn = [-16.0, 16.0, -18.0];
      target = [0.0, 7.0, -40.0];
    } else if (preset === 'about_rooftop_terrace') {
      // Phase 2.5: About Studio Rooftop Observation Terrace & Skyline Backdrop
      spawn = [-10.0, 24.0, -24.0];
      target = [1.0, 13.0, -42.6];
    } else if (preset === 'about_developer_journey') {
      // Phase 2.5: Close exhibition view into gallery & digital media wall
      spawn = [0.0, 2.8, -26.0];
      target = [0.0, 2.6, -42.0];
    } else if (preset === 'about_personal_intro') {
      // Phase 2.5: Entrance portal & welcome exhibition space
      spawn = [-4.0, 2.6, -23.0];
      target = [0.0, 3.2, -38.0];
    } else if (preset === 'about_street_view') {
      // Phase 2.5: Street-level view from sidewalk & directory board
      spawn = [7.5, 1.8, -20.5];
      target = [3.0, 3.5, -36.0];
    } else if (preset === 'five_landmarks_aerial') {
      // Phase 2.5: Grand skyline framing all 5 landmarks (HQ [0,0], Innovation [40,-40], Skills [-40,0], Career [40,0], About [0,-40])
      spawn = [25.0, 110.0, 105.0];
      target = [0.0, 12.0, -18.0];
    } else if (preset === 'contact_front_entrance') {
      // Phase 2.6: Contact Hub North Entrance at [-40, 40] (Facing North towards Street Z=20)
      spawn = [-40.0, 5.0, 15.0];
      target = [-40.0, 5.2, 34.0];
    } else if (preset === 'contact_three_quarter') {
      // Phase 2.6: Contact Hub Three-Quarter View & Sweeping Aerodynamic Canopy
      spawn = [-62.0, 16.0, 16.0];
      target = [-40.0, 10.0, 38.0];
    } else if (preset === 'contact_rooftop_terrace') {
      // Phase 2.6: Contact Hub Upper Shell & Skyline Backdrop
      spawn = [-48.0, 28.0, 22.0];
      target = [-38.0, 16.0, 42.0];
    } else if (preset === 'contact_interior_globe') {
      // Phase 2.6: Double-height lobby view focused on suspended holographic communication globe
      spawn = [-40.0, 3.4, 26.5];
      target = [-40.0, 4.8, 38.5];
    } else if (preset === 'contact_collaboration_showcase') {
      // Phase 2.6: Mid-level architectural colonnade and collaboration suites
      spawn = [-48.0, 8.5, 24.0];
      target = [-40.0, 6.0, 36.0];
    } else if (preset === 'contact_street_view') {
      // Phase 2.6: Sidewalk perspective from directory board
      spawn = [-31.5, 2.2, 20.5];
      target = [-38.0, 4.0, 36.0];
    } else if (preset === 'all_six_landmarks_aerial') {
      // Phase 2.6: Grand panoramic aerial framing all 6 completed portfolio landmarks
      spawn = [30.0, 125.0, 120.0];
      target = [0.0, 12.0, 0.0];
    } else if (preset === 'ai_front_entrance') {
      // Phase 2.7: AI Research Center North Entrance at [0, 40] (Facing North towards Street Z=20)
      spawn = [0.0, 5.0, 15.0];
      target = [0.0, 5.2, 34.0];
    } else if (preset === 'ai_three_quarter') {
      // Phase 2.7: AI Research Center Three-Quarter View & Diagrid Facade
      spawn = [-22.0, 16.0, 16.0];
      target = [0.0, 10.0, 38.0];
    } else if (preset === 'ai_elevated_exterior') {
      // Phase 2.7: AI Research Center Elevated View, Crown Spires & Skyline
      spawn = [-12.0, 30.0, 22.0];
      target = [2.0, 16.0, 42.0];
    } else if (preset === 'ai_atrium_hologram') {
      // Phase 2.7: Double-height atrium view focused on suspended 3D neural network sculpture
      spawn = [1.5, 3.6, 26.5];
      target = [1.5, 4.8, 38.2];
    } else if (preset === 'ai_street_view') {
      // Phase 2.7: Sidewalk perspective from directory board
      spawn = [7.5, 2.2, 20.5];
      target = [2.0, 4.0, 36.0];
    } else if (preset === 'all_seven_landmarks_aerial') {
      // Phase 2.7: Grand panoramic aerial framing all 7 completed portfolio landmarks
      spawn = [35.0, 135.0, 125.0];
      target = [0.0, 12.0, 0.0];
    } else if (preset === 'both_refined_elevated') {
      // Phase 2.7.1: Elevated framing of both refined buildings side by side (Contact at [-40, 40] and AI at [0, 40])
      spawn = [-20.0, 30.0, 5.0];
      target = [-20.0, 10.0, 40.0];
    } else if (preset === 'ai_rooftop_refined') {
      // Phase 2.7.1: Elevated top-down view of AI Research Center clean roofline and stepped volumes
      spawn = [0.0, 26.0, 20.0];
      target = [0.0, 14.0, 40.0];
    } else if (preset === 'contact_rooftop_refined') {
      // Phase 2.7.1: Elevated top-down view of Contact Hub aerodynamic roof canopy and crown rim
      spawn = [-40.0, 28.0, 20.0];
      target = [-40.0, 15.0, 40.0];
    } else if (preset === 'cloud_front_entrance') {
      // Phase 2.8: Cloud Hub North Entrance at [40, 40] (Facing North towards Street Z=20)
      spawn = [40.0, 5.0, 15.0];
      target = [40.0, 5.2, 34.0];
    } else if (preset === 'cloud_three_quarter') {
      // Phase 2.8: Cloud Hub Three-Quarter View showing curved aerodynamic corner and cyan cloud HUD
      spawn = [18.0, 16.0, 16.0];
      target = [40.0, 10.0, 40.0];
    } else if (preset === 'cloud_street_approach') {
      // Phase 2.8: Cloud Hub Street Approach looking up at the illuminated curved architecture
      spawn = [30.0, 2.8, 16.0];
      target = [40.0, 5.5, 32.0];
    } else if (preset === 'cloud_elevated_exterior' || preset === 'cloud_skyline') {
      // Phase 2.8: Cloud Hub Rooftop & Skyline view showing curved crown, HVAC, and mechanical penthouse
      spawn = [28.0, 32.0, 22.0];
      target = [42.0, 16.0, 42.0];
    } else if (preset === 'cloud_lobby_interior' || preset === 'cloud_lobby_view') {
      // Phase 2.8: Double-height lobby view focused on 5-node holographic system architecture pipeline
      spawn = [40.0, 2.8, 33.5];
      target = [40.0, 2.4, 40.5];
    } else if (preset === 'cloud_infrastructure_close') {
      // Phase 2.8: Close-up of cloud infrastructure exhibition consoles & telemetry displays
      spawn = [37.5, 3.2, 32.0];
      target = [41.5, 3.8, 38.0];
    } else if (preset === 'civic_plaza_overview') {
      // Phase 2.8: Central Civic Plaza overview at [-40, -40] showing paving, sculpture, and seating
      spawn = [-26.0, 14.0, -26.0];
      target = [-40.0, 1.5, -40.0];
    } else if (preset === 'all_nine_landmarks_aerial') {
      // Phase 2.8: High-angle aerial framing all 9 central portfolio plots
      spawn = [38.0, 140.0, 130.0];
      target = [0.0, 12.0, 0.0];
    } else if (preset === 'complete_coastal_city_aerial') {
      // Phase 2.8: Complete coastal city aerial view with the ocean and skyline
      spawn = [90.0, 175.0, 185.0];
      target = [0.0, 10.0, 0.0];
    }

    targetPos.current.set(spawn[0], spawn[1], spawn[2]);
    targetLook.current.set(target[0], target[1], target[2]);

    if (isFirstMount.current) {
      isFirstMount.current = false;
      camera.position.set(spawn[0], spawn[1], spawn[2]);
      camera.lookAt(target[0], target[1], target[2]);
      if (controlsRef.current) {
        controlsRef.current.target.set(target[0], target[1], target[2]);
        controlsRef.current.update();
      }
      isTransitioning.current = false;
    } else {
      isTransitioning.current = true;
    }
  }, [camera, preset]);

  useFrame((_, delta) => {
    // Continuous Failsafe: check for NaN/Infinity in camera state and recover immediately
    if (
      !Number.isFinite(camera.position.x) ||
      !Number.isFinite(camera.position.y) ||
      !Number.isFinite(camera.position.z) ||
      !Number.isFinite(camera.quaternion.x) ||
      !Number.isFinite(camera.quaternion.y) ||
      !Number.isFinite(camera.quaternion.z) ||
      !Number.isFinite(camera.quaternion.w) ||
      (controlsRef.current && (
        !Number.isFinite(controlsRef.current.target.x) ||
        !Number.isFinite(controlsRef.current.target.y) ||
        !Number.isFinite(controlsRef.current.target.z)
      ))
    ) {
      console.warn('[OrbitCamera] Invalid camera coordinates or target detected (NaN/Infinity). Executing automatic recovery.');
      const spawn = WORLD_CONFIG.camera.orbitSpawn;
      const target = WORLD_CONFIG.camera.orbitTarget;
      camera.position.set(spawn[0], spawn[1], spawn[2]);
      camera.up.set(0, 1, 0);
      camera.lookAt(target[0], target[1], target[2]);
      if (controlsRef.current) {
        controlsRef.current.target.set(target[0], target[1], target[2]);
        controlsRef.current.update();
      }
      targetPos.current.set(spawn[0], spawn[1], spawn[2]);
      targetLook.current.set(target[0], target[1], target[2]);
      isTransitioning.current = false;
      return;
    }

    if (!isTransitioning.current) return;

    // Frame-rate independent exponential damping for smooth cinematics
    const factor = 1.0 - Math.exp(-delta * 4.5);
    camera.position.lerp(targetPos.current, factor);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook.current, factor);
      controlsRef.current.update();
    }

    if (
      camera.position.distanceTo(targetPos.current) < 0.08 &&
      (!controlsRef.current || controlsRef.current.target.distanceTo(targetLook.current) < 0.08)
    ) {
      camera.position.copy(targetPos.current);
      if (controlsRef.current) {
        controlsRef.current.target.copy(targetLook.current);
        controlsRef.current.update();
      }
      isTransitioning.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      minDistance={10}
      maxDistance={1400}
      maxPolarAngle={Math.PI / 2 - 0.04} // Never sink below ground or water
      minPolarAngle={0.04}
      onStart={() => {
        // Immediately yield control to user on manual interaction
        isTransitioning.current = false;
      }}
    />
  );
};
