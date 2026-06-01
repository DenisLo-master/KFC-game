import { describe, expect, it } from 'vitest';
import { createWorkerMovementState, getVisibleWorkerZone, startWorkerMovement } from './movement';

describe('worker movement visual mapping', () => {
  it('derives the visible worker zone from durable movement state', () => {
    const arrived = createWorkerMovementState('storage');

    expect(getVisibleWorkerZone(arrived)).toBe('storage');
    expect(getVisibleWorkerZone(startWorkerMovement(arrived, 'fryer'))).toBe('storage');
  });
});
