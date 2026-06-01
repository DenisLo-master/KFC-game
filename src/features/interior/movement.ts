import { INTERIOR_MOVEMENT_SECONDS, INTERIOR_START_ZONE } from './config';
import type { InteriorZone, WorkerMovementState } from './types';

export function createWorkerMovementState(zone: InteriorZone = INTERIOR_START_ZONE): WorkerMovementState {
  return {
    currentZone: zone,
    targetZone: null,
    status: 'arrived',
    progress: 1,
    elapsed: 0,
    duration: 0,
    lastArrivedZone: zone,
  };
}

export function startWorkerMovement(
  movement: WorkerMovementState,
  targetZone: InteriorZone,
): WorkerMovementState {
  if (movement.currentZone === targetZone && movement.status !== 'moving') {
    return createWorkerMovementState(targetZone);
  }

  return {
    ...movement,
    targetZone,
    status: 'moving',
    progress: 0,
    elapsed: 0,
    duration: INTERIOR_MOVEMENT_SECONDS,
  };
}

export function advanceWorkerMovement(movement: WorkerMovementState, delta: number): WorkerMovementState {
  if (movement.status !== 'moving' || !movement.targetZone) return movement;

  const duration = movement.duration || INTERIOR_MOVEMENT_SECONDS;
  const elapsed = Math.max(0, movement.elapsed + delta);
  const progress = Math.min(1, elapsed / duration);

  if (progress >= 1) {
    return createWorkerMovementState(movement.targetZone);
  }

  return {
    ...movement,
    elapsed,
    duration,
    progress,
  };
}

export function getVisibleWorkerZone(movement: WorkerMovementState): InteriorZone {
  return movement.currentZone;
}
