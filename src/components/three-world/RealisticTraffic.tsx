'use client';

import React from 'react';
import * as THREE from 'three';
import { TimeOfDay } from './AtmosphericWeatherSystem';
import { RealisticTrafficAI } from './RealisticTrafficAI';

export interface RealisticTrafficProps {
  timeOfDay?: TimeOfDay;
  playerPosRef?: React.MutableRefObject<THREE.Vector3>;
}

/**
 * Realistic Traffic System Component
 * Renders intelligent vehicle traffic simulation with diverse models:
 * - Sedans, SUVs, Taxis, Buses, Vans, and Motorcycles
 * - Coordinated traffic signal stopping and intersection turns
 * - Car-following distance safety and pedestrian yielding
 * - Front wheel steering and wheel rotation physics
 * - Braking taillights, headlights, and turn signals
 * - Curbside parked vehicles
 */
export const RealisticTraffic: React.FC<RealisticTrafficProps> = ({
  timeOfDay = 'day',
  playerPosRef,
}) => {
  return <RealisticTrafficAI timeOfDay={timeOfDay} playerPosRef={playerPosRef} />;
};
