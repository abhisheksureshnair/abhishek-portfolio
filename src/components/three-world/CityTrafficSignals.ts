/**
 * City Traffic Signals Controller
 * Manages synchronized intersection vehicular and pedestrian signal phases.
 */

export type SignalPhase = 'green' | 'yellow' | 'red';

export interface TrafficSignalState {
  nsVehiclePhase: SignalPhase;
  ewVehiclePhase: SignalPhase;
  /** Backwards compatibility alias for nsVehiclePhase */
  nsPhase: SignalPhase;
  /** Backwards compatibility alias for ewVehiclePhase */
  ewPhase: SignalPhase;
  /** Walk signal for crosswalks at Z = ±3.8 crossing the North-South Avenue */
  nsCrosswalkWalk: boolean;
  /** Walk signal for crosswalks at X = ±3.8 crossing the East-West Boulevard */
  ewCrosswalkWalk: boolean;
  cycleTime: number;
}

// 24-second coordinated traffic light cycle
const PHASE_NS_GREEN = 8.0;
const PHASE_NS_YELLOW = 2.5;
const PHASE_ALL_RED1 = 1.5;
const PHASE_EW_GREEN = 8.0;
const PHASE_EW_YELLOW = 2.5;
const PHASE_ALL_RED2 = 1.5;

export const TOTAL_SIGNAL_CYCLE =
  PHASE_NS_GREEN +
  PHASE_NS_YELLOW +
  PHASE_ALL_RED1 +
  PHASE_EW_GREEN +
  PHASE_EW_YELLOW +
  PHASE_ALL_RED2; // 24.0 seconds

/**
 * Returns the exact vehicular and pedestrian signal phases at any given timestamp (in seconds).
 */
export function getTrafficSignalState(timeSec: number): TrafficSignalState {
  const t = ((timeSec % TOTAL_SIGNAL_CYCLE) + TOTAL_SIGNAL_CYCLE) % TOTAL_SIGNAL_CYCLE;

  // 1. NS Vehicular GREEN / EW Vehicular RED
  if (t < PHASE_NS_GREEN) {
    return {
      nsVehiclePhase: 'green',
      ewVehiclePhase: 'red',
      nsPhase: 'green',
      ewPhase: 'red',
      ewCrosswalkWalk: true,
      nsCrosswalkWalk: false,
      cycleTime: t,
    };
  }

  // 2. NS Vehicular YELLOW / EW Vehicular RED
  if (t < PHASE_NS_GREEN + PHASE_NS_YELLOW) {
    return {
      nsVehiclePhase: 'yellow',
      ewVehiclePhase: 'red',
      nsPhase: 'yellow',
      ewPhase: 'red',
      ewCrosswalkWalk: false,
      nsCrosswalkWalk: false,
      cycleTime: t,
    };
  }

  // 3. ALL RED Clearance 1
  if (t < PHASE_NS_GREEN + PHASE_NS_YELLOW + PHASE_ALL_RED1) {
    return {
      nsVehiclePhase: 'red',
      ewVehiclePhase: 'red',
      nsPhase: 'red',
      ewPhase: 'red',
      ewCrosswalkWalk: false,
      nsCrosswalkWalk: false,
      cycleTime: t,
    };
  }

  // 4. EW Vehicular GREEN / NS Vehicular RED
  const tEW = t - (PHASE_NS_GREEN + PHASE_NS_YELLOW + PHASE_ALL_RED1);
  if (tEW < PHASE_EW_GREEN) {
    return {
      nsVehiclePhase: 'red',
      ewVehiclePhase: 'green',
      nsPhase: 'red',
      ewPhase: 'green',
      nsCrosswalkWalk: true,
      ewCrosswalkWalk: false,
      cycleTime: t,
    };
  }

  // 5. EW Vehicular YELLOW / NS Vehicular RED
  if (tEW < PHASE_EW_GREEN + PHASE_EW_YELLOW) {
    return {
      nsVehiclePhase: 'red',
      ewVehiclePhase: 'yellow',
      nsPhase: 'red',
      ewPhase: 'yellow',
      nsCrosswalkWalk: false,
      ewCrosswalkWalk: false,
      cycleTime: t,
    };
  }

  // 6. ALL RED Clearance 2
  return {
    nsVehiclePhase: 'red',
    ewVehiclePhase: 'red',
    nsPhase: 'red',
    ewPhase: 'red',
    nsCrosswalkWalk: false,
    ewCrosswalkWalk: false,
    cycleTime: t,
  };
}
