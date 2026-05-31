import type { CookingStation } from './types';

export const COOKING_DURATIONS = {
  fries: 3,
  burger: 4,
  nuggets: 3.4,
  strips: 3.8,
  drink: 1,
} as const;

export const createCookingStations = (): Record<CookingStation['id'], CookingStation> => ({
  fryer: {
    id: 'fryer',
    label: 'Fryer',
    status: 'idle',
    product: null,
    remaining: 0,
    duration: COOKING_DURATIONS.fries,
  },
  grill: {
    id: 'grill',
    label: 'Grill',
    status: 'idle',
    product: null,
    remaining: 0,
    duration: COOKING_DURATIONS.burger,
  },
  oven: {
    id: 'oven',
    label: 'Oven',
    status: 'idle',
    product: null,
    remaining: 0,
    duration: COOKING_DURATIONS.nuggets,
  },
  drink: {
    id: 'drink',
    label: 'Dispenser',
    status: 'idle',
    product: null,
    remaining: 0,
    duration: COOKING_DURATIONS.drink,
  },
});
