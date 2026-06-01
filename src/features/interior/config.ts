import type { StationId } from '../cooking/types';
import type { InteriorZone } from './types';

export const INTERIOR_START_ZONE = 'window' satisfies InteriorZone;
export const INTERIOR_MOVEMENT_SECONDS = 1.25;

export const INTERIOR_STATION_ZONES = ['fryer', 'grill', 'oven', 'drink'] as const satisfies readonly StationId[];

export function isStationZone(zone: InteriorZone): zone is StationId {
  return (INTERIOR_STATION_ZONES as readonly string[]).includes(zone);
}
