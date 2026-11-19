import React, { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WORLD_CONFIG, getCityRoadNetwork } from '../WorldConfig';
import { useWorldStore } from '../stores/worldStore';

// Reusable scratch objects to avoid GC churn in 60fps frame loop
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _moveDir = new THREE.Vector3();

export const StoryCamera: React.FC = () => {
  const { camera, gl } = useThree();
  const network = useMemo(() => getCityRoadNetwork(), []);
  const preset = useWorldStore((s) => s.cameraPreset);

  // Position, rotation and velocity refs for zero React re-renders during 60fps loop
  const isDowntownStreet = preset === 'street_downtown' || preset === 'street';
  const isRefStreet = preset === 'ref_street_front' || preset === 'ref_block_street';
  const isHQStreet = preset === 'hq_street_level';
  const initSpawn: [number, number, number] = isHQStreet
    ? [0, 1.75, 17.5]
    : isDowntownStreet
    ? [-60, 1.75, -20]
    : isRefStreet
    ? [0, 1.75, -51]
    : WORLD_CONFIG.camera.storySpawn;
  const initYaw = isHQStreet ? 0 : isDowntownStreet || isRefStreet ? 0 : Math.PI;
  const initPitch = isHQStreet ? 0.08 : isDowntownStreet || isRefStreet ? 0.08 : -0.05;

  const posRef = useRef<THREE.Vector3>(new THREE.Vector3(...initSpawn));
  const velocityRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const yawRef = useRef<number>(initYaw);
  const pitchRef = useRef<number>(initPitch);

  const isMouseDownRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const keysPressedRef = useRef<Record<string, boolean>>({});

  const sidewalkZones = useMemo(() => {
    return network.blocks.map((b) => b.sidewalkBoundary);
  }, [network]);

  const getElevation = (x: number, z: number): number => {
    for (let i = 0; i < sidewalkZones.length; i++) {
      const zone = sidewalkZones[i];
      if (x >= zone.minX && x <= zone.maxX && z >= zone.minZ && z <= zone.maxZ) {
        return WORLD_CONFIG.sidewalkElevation; // 0.20m
      }
    }
    return WORLD_CONFIG.roadElevation; // 0.02m
  };

  // Setup keyboard and mouse listeners
  useEffect(() => {
    if (preset === 'street_downtown' || preset === 'street') {
      posRef.current.set(-60, 1.75, -20);
      yawRef.current = 0; // Facing North down 2nd Avenue urban canyon
      pitchRef.current = 0.08;
    } else if (preset === 'ref_street_front' || preset === 'ref_block_street') {
      posRef.current.set(0, 1.75, -51);
      yawRef.current = 0; // Look directly North towards block_1_3 at [0, -80]
      pitchRef.current = 0.08;
    } else if (preset === 'hq_street_level') {
      posRef.current.set(0, 1.75, 17.5);
      yawRef.current = Math.PI; // Looking North directly towards central HQ Grand Entrance at [0, 8.5]
      pitchRef.current = 0.08;
    } else if (preset === 'innovation_front_entrance') {
      posRef.current.set(40.0, 1.75, -17.5);
      yawRef.current = 0; // Looking North directly towards Innovation Center entrance at [40, -27.6]
      pitchRef.current = 0.08;
    } else if (preset === 'innovation_interior_atrium' || preset === 'innovation_projects_gallery') {
      posRef.current.set(40.0, 1.75, -34.0);
      yawRef.current = 0; // Inside ground-floor exhibition atrium looking North towards media wall
      pitchRef.current = 0.05;
    } else if (preset === 'skills_front_entrance') {
      posRef.current.set(-18.0, 1.75, 0.0);
      yawRef.current = -Math.PI / 2; // Looking West directly towards Skills Tower Grand Entrance at [-27.6, 0]
      pitchRef.current = 0.08;
    } else if (preset === 'skills_street_approach') {
      posRef.current.set(-18.0, 1.75, -20.0);
      yawRef.current = -Math.PI * 0.35; // Looking Southwest along Avenue towards Skills Tower
      pitchRef.current = 0.08;
    } else if (preset === 'skills_lobby') {
      posRef.current.set(-28.5, 1.75, 0.0);
      yawRef.current = -Math.PI / 2; // Inside double-height lobby looking West towards Technology Directory
      pitchRef.current = 0.04;
    } else if (preset === 'career_front_entrance') {
      posRef.current.set(18.0, 1.75, 0.0);
      yawRef.current = Math.PI / 2; // Looking East directly towards Career Center Grand Entrance at [28.0, 0]
      pitchRef.current = 0.08;
    } else if (preset === 'career_street_view') {
      posRef.current.set(18.0, 1.75, -16.0);
      yawRef.current = Math.PI * 0.35; // Looking Southeast towards Career Center & sidewalk directory
      pitchRef.current = 0.08;
    } else if (preset === 'career_lobby') {
      posRef.current.set(28.5, 1.75, 0.0);
      yawRef.current = Math.PI / 2; // Inside atrium lobby looking East towards illuminated timeline
      pitchRef.current = 0.04;
    } else if (preset === 'about_front_entrance') {
      posRef.current.set(0.0, 1.75, -20.0);
      yawRef.current = 0; // Looking North directly towards About Studio South Entrance
      pitchRef.current = 0.06;
    } else if (preset === 'about_street_view') {
      posRef.current.set(7.5, 1.75, -20.0);
      yawRef.current = -Math.PI * 0.25; // Looking Northwest towards directory board & entrance
      pitchRef.current = 0.06;
    } else if (preset === 'about_developer_journey') {
      posRef.current.set(0.0, 1.75, -32.0);
      yawRef.current = 0; // Inside exhibition gallery looking North towards media wall
      pitchRef.current = 0.04;
    } else if (preset === 'contact_front_entrance') {
      posRef.current.set(-40.0, 1.75, 20.0);
      yawRef.current = Math.PI; // Looking South towards Contact Hub North entrance
      pitchRef.current = 0.06;
    } else if (preset === 'contact_street_view') {
      posRef.current.set(-32.0, 1.75, 20.0);
      yawRef.current = -Math.PI * 0.75; // Looking Southwest towards directory board & portal
      pitchRef.current = 0.06;
    } else if (preset === 'contact_interior_globe') {
      posRef.current.set(-40.0, 1.75, 32.0);
      yawRef.current = Math.PI; // Inside lobby looking South towards holographic globe
      pitchRef.current = 0.08;
    } else if (preset === 'ai_front_entrance') {
      posRef.current.set(0.0, 1.75, 20.0);
      yawRef.current = Math.PI; // Looking South towards AI Research Center North entrance
      pitchRef.current = 0.06;
    } else if (preset === 'ai_street_view') {
      posRef.current.set(7.5, 1.75, 20.0);
      yawRef.current = Math.PI * 0.92; // Looking South towards directory board & AI building entrance
      pitchRef.current = 0.08;
    } else if (preset === 'ai_atrium_hologram') {
      posRef.current.set(1.5, 1.75, 30.0);
      yawRef.current = Math.PI; // Inside atrium looking South towards suspended neural sculpture
      pitchRef.current = 0.08;
    } else if (preset === 'cloud_front_entrance') {
      posRef.current.set(40.0, 1.75, 20.0);
      yawRef.current = Math.PI; // Looking South towards Cloud Ecosystem Hub entrance at [40, 30.5]
      pitchRef.current = 0.06;
    } else if (preset === 'cloud_street_approach') {
      posRef.current.set(32.0, 1.75, 20.0);
      yawRef.current = Math.PI * 0.75; // Looking Southeast towards Cloud Hub directory & entrance
      pitchRef.current = 0.08;
    } else if (preset === 'cloud_lobby_view' || preset === 'cloud_lobby_interior') {
      posRef.current.set(40.0, 1.75, 32.0);
      yawRef.current = Math.PI; // Inside lobby looking South towards 5-node architecture display
      pitchRef.current = 0.06;
    } else if (preset === 'facades') {
      posRef.current.set(-56, 1.72, -56);
      yawRef.current = Math.PI * 0.75; // Looking outward Northwest towards near commercial storefronts
      pitchRef.current = 0.04;
    } else if (preset === 'boundary') {
      posRef.current.set(-63.5, 1.72, 0);
      yawRef.current = Math.PI * 0.5; // Looking directly West across the non-explorable boundary
      pitchRef.current = 0.0;
    } else {
      const spawn = WORLD_CONFIG.camera.storySpawn;
      posRef.current.set(spawn[0], spawn[1], spawn[2]);
      yawRef.current = Math.PI;
      pitchRef.current = -0.05;
    }
    camera.position.copy(posRef.current);
    const euler = new THREE.Euler(pitchRef.current, yawRef.current, 0, 'YXZ');
    camera.quaternion.setFromEuler(euler);

    const onKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key.toLowerCase()] = true;
      keysPressedRef.current[e.code] = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key.toLowerCase()] = false;
      keysPressedRef.current[e.code] = false;
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0 || e.button === 2) {
        isMouseDownRef.current = true;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current) return;
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      const sensitivity = 0.0032;
      yawRef.current -= dx * sensitivity;
      pitchRef.current -= dy * sensitivity;

      pitchRef.current = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, pitchRef.current));
    };

    const onMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const canvas = gl.domElement;
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [camera, gl, preset]);

  // Frame Loop (60 FPS motion & collision update)
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const keys = keysPressedRef.current;

    let moveForward = 0;
    let moveSide = 0;

    if (keys['w'] || keys['arrowup'] || keys['keyw']) moveForward += 1;
    if (keys['s'] || keys['arrowdown'] || keys['keys']) moveForward -= 1;
    if (keys['d'] || keys['arrowright'] || keys['keyd']) moveSide += 1;
    if (keys['a'] || keys['arrowleft'] || keys['keya']) moveSide -= 1;

    if (keys['q'] || keys['keyq']) yawRef.current += 1.8 * dt;
    if (keys['e'] || keys['keye']) yawRef.current -= 1.8 * dt;

    const isSprint = keys['shift'] || keys['shiftleft'] || keys['shiftright'];
    const targetSpeed = isSprint ? 10.0 : 5.5;

    _forward.set(-Math.sin(yawRef.current), 0, -Math.cos(yawRef.current)).normalize();
    _right.set(Math.cos(yawRef.current), 0, -Math.sin(yawRef.current)).normalize();

    _moveDir.set(0, 0, 0);
    if (moveForward !== 0) _moveDir.addScaledVector(_forward, moveForward);
    if (moveSide !== 0) _moveDir.addScaledVector(_right, moveSide);

    if (_moveDir.lengthSq() > 0) {
      _moveDir.normalize();
      _moveDir.multiplyScalar(targetSpeed);
    }

    velocityRef.current.lerp(_moveDir, 12 * dt);

    posRef.current.x += velocityRef.current.x * dt;
    posRef.current.z += velocityRef.current.z * dt;

    // Strict Invisible Exploration Boundary (Zone A Playable District: [-64m, +64m])
    // Prevents walking into the non-explorable background metropolis with natural perimeter sliding
    const minBound = -64.0;
    const maxBound = 64.0;

    if (posRef.current.x < minBound) {
      posRef.current.x = minBound;
      velocityRef.current.x = 0;
    } else if (posRef.current.x > maxBound) {
      posRef.current.x = maxBound;
      velocityRef.current.x = 0;
    }

    if (posRef.current.z < minBound) {
      posRef.current.z = minBound;
      velocityRef.current.z = 0;
    } else if (posRef.current.z > maxBound) {
      posRef.current.z = maxBound;
      velocityRef.current.z = 0;
    }

    // Ground Height Clamping & Curb Transitions
    const groundY = getElevation(posRef.current.x, posRef.current.z);
    const targetEyeY = groundY + 1.72;
    posRef.current.y = THREE.MathUtils.lerp(posRef.current.y, targetEyeY, 15 * dt);

    camera.position.copy(posRef.current);
    const euler = new THREE.Euler(pitchRef.current, yawRef.current, 0, 'YXZ');
    camera.quaternion.setFromEuler(euler);
  });

  return null;
};
