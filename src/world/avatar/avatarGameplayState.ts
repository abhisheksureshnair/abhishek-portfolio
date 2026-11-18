import * as THREE from 'three';

// Static scratch vectors for zero-allocation performance
const _fwd = new THREE.Vector3();
const _rgt = new THREE.Vector3();

export class AvatarGameplayState {
  // Authoritative Camera Orbit Angles (Radians)
  public cameraYaw: number = 0;
  public cameraPitch: number = 0.2618; // 15° downward tilt per Section 2
  public cameraDistance: number = 3.5; // 3.5m follow distance per Section 2
  public targetDistance: number = 3.5;

  // Limits
  public minPitch: number = -0.25; // ~14° upward
  public maxPitch: number = 1.15; // ~66° downward
  public minDistance: number = 2.0;
  public maxDistance: number = 7.5;

  // Telemetry & Alignment
  public lastMouseInputTime: number = 0;
  public isMoving: boolean = false;
  public currentSpeed: number = 0;
  public hasInitialized: boolean = false;

  /**
   * Initialize camera directly behind the avatar on spawn or mode reset.
   * When avatar faces heading theta, camera is positioned at theta + PI, looking along theta.
   */
  public initializeSpawn(avatarHeading: number) {
    this.cameraYaw = avatarHeading + Math.PI;
    this.cameraPitch = 0.2618; // 15° downward
    this.cameraDistance = 3.5;
    this.targetDistance = 3.5;
    this.lastMouseInputTime = performance.now();
    this.hasInitialized = true;
  }

  /**
   * Handle mouse look with sensitivity.
   */
  public handleMouseMove(movementX: number, movementY: number, sensitivity: number = 0.0022) {
    this.cameraYaw -= movementX * sensitivity;
    this.cameraPitch = Math.max(
      this.minPitch,
      Math.min(this.maxPitch, this.cameraPitch - movementY * sensitivity)
    );
    this.lastMouseInputTime = performance.now();
  }

  /**
   * Handle mouse wheel zoom.
   */
  public handleWheelZoom(deltaY: number) {
    const zoomDelta = deltaY * 0.0025;
    this.targetDistance = Math.max(
      this.minDistance,
      Math.min(this.maxDistance, this.targetDistance + zoomDelta)
    );
    this.lastMouseInputTime = performance.now();
  }

  /**
   * Get exact ground-projected horizontal camera forward and right vectors.
   * Analytical formula with zero pitch distortion and zero scene graph matrix latency:
   *   forward = (-sin(yaw), 0, -cos(yaw))
   *   right   = (cos(yaw), 0, -sin(yaw))
   */
  public getCameraVectors(): { forward: THREE.Vector3; right: THREE.Vector3 } {
    const y = this.cameraYaw;
    _fwd.set(-Math.sin(y), 0, -Math.cos(y));
    _rgt.set(Math.cos(y), 0, -Math.sin(y));
    return { forward: _fwd, right: _rgt };
  }

  /**
   * GTA-Style Automatic Camera Alignment:
   * When avatar is moving continuously and no mouse input for 1.5s,
   * gradually align camera directly behind the avatar's travel direction.
   */
  public updateAutoAlignment(avatarHeading: number, dt: number) {
    if (!this.isMoving) return;

    const timeSinceMouse = (performance.now() - this.lastMouseInputTime) / 1000;
    if (timeSinceMouse <= 1.5) return;

    const targetBehindYaw = avatarHeading + Math.PI;

    // Shortest-angle difference interpolation
    let diffYaw = (targetBehindYaw - this.cameraYaw) % (2 * Math.PI);
    if (diffYaw > Math.PI) diffYaw -= 2 * Math.PI;
    if (diffYaw < -Math.PI) diffYaw += 2 * Math.PI;

    if (Math.abs(diffYaw) > 0.002) {
      const alignSpeed = 2.0; // 2.0 rad/s gentle follow
      const step = Math.sign(diffYaw) * Math.min(Math.abs(diffYaw), alignSpeed * dt);
      this.cameraYaw += step;
    }
  }
}

// Module-level singleton instance shared across gameplay components
export const avatarGameplayState = new AvatarGameplayState();

if (typeof window !== 'undefined') {
  (window as any).__avatarGameplayState = avatarGameplayState;
}
