/**
 * City Traffic Signals Controller
 * Manages intersection traffic signal phases and stop line coordinates.
 */

export type SignalPhase = 'green' | 'yellow' | 'red';

export interface TrafficSignalState {
  nsPhase: SignalPhase;
  ewPhase: SignalPhase;
  cycleTime: number;
}

// 22-second coordinated traffic light cycle
const PHASE_NS_GREEN = 7.5;
const PHASE_NS_YELLOW = 2.5;
const PHASE_ALL_RED1 = 1.0;
const PHASE_EW_GREEN = 7.5;
const PHASE_EW_YELLOW = 2.5;
const PHASE_ALL_RED2 = 1.0;

export const TOTAL_SIGNAL_CYCLE =
  PHASE_NS_GREEN +
  PHASE_NS_YELLOW +
  PHASE_ALL_RED1 +
  PHASE_EW_GREEN +
  PHASE_EW_YELLOW +
  PHASE_ALL_RED2; // 22.0 seconds

/**
 * Returns the exact North-South and East-West traffic light phases at any time (in seconds).
 */
export function getTrafficSignalState(timeSec: number): TrafficSignalState {
  const t = ((timeSec % TOTAL_SIGNAL_CYCLE) + TOTAL_SIGNAL_CYCLE) % TOTAL_SIGNAL_CYCLE;

  if (t < PHASE_NS_GREEN) {
    return { nsPhase: 'green', ewPhase: 'red', cycleTime: t };
  } else if (t < PHASE_NS_GREEN + PHASE_NS_YELLOW) {
    return { nsPhase: 'yellow', ewPhase: 'red', cycleTime: t };
  } else if (t < PHASE_NS_GREEN + PHASE_NS_YELLOW + PHASE_ALL_RED1) {
    return { nsPhase: 'red', ewPhase: 'red', cycleTime: t };
  }

  const tEW = t - (PHASE_NS_GREEN + PHASE_NS_YELLOW + PHASE_ALL_RED1);
  if (tEW < PHASE_EW_GREEN) {
    return { nsPhase: 'red', ewPhase: 'green', cycleTime: t };
  } else if (tEW < PHASE_EW_GREEN + PHASE_EW_YELLOW) {
    return { nsPhase: 'red', ewPhase: 'yellow', cycleTime: t };
  }

  return { nsPhase: 'red', ewPhase: 'red', cycleTime: t };
}

