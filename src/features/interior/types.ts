export type InteriorZone = 'storage' | 'prep' | 'fryer' | 'grill' | 'oven' | 'drink' | 'window' | 'shutter';

export type WorkerMovementStatus = 'idle' | 'moving' | 'arrived' | 'interacting';

export type WorkerMovementState = {
  currentZone: InteriorZone;
  targetZone: InteriorZone | null;
  status: WorkerMovementStatus;
  progress: number;
  elapsed: number;
  duration: number;
  lastArrivedZone: InteriorZone;
};
