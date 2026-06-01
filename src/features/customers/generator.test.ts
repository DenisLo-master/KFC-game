import { describe, expect, it } from 'vitest';
import type { DifficultyConfig } from '../difficulty/config';
import { generateCustomer } from './generator';
import type { AnomalyKind, StreetArchetype } from './types';

const difficulty: DifficultyConfig = {
  level: 3,
  maxItemsPerOrder: 4,
  anomalyChance: 0.25,
  customerPatienceMs: 20_000,
  subtleAnomalyChance: 0.25,
};

describe('customer anomaly generation', () => {
  it('reaches every approved ordinary archetype with deterministic street metadata', () => {
    const expectedArchetypes: StreetArchetype[] = [
      'student',
      'officeWorker',
      'courier',
      'shopper',
      'olderPerson',
      'tiredParent',
      'nightWorker',
      'teenager',
    ];

    const customers = expectedArchetypes.map((_, sequence) =>
      generateCustomer(sequence, difficulty, {
        forceAnomaly: false,
        now: () => sequence + 100,
        rng: () => 0.99,
      }),
    );

    expect(customers.map((customer) => customer.street.archetype)).toEqual(expectedArchetypes);
    expect(customers.every((customer) => customer.street.anomalyCue === null)).toBe(true);
    expect(customers.every((customer) => customer.street.source === 'streetQueue')).toBe(true);
    expect(customers.every((customer) => customer.street.encounterStage === 'approaching')).toBe(true);
    expect(new Set(customers.map((customer) => customer.street.movementIntent)).size).toBeGreaterThanOrEqual(4);
  });

  it('attaches every approved anomaly cue only to forced anomalous visitors', () => {
    const anomalyKinds: Exclude<AnomalyKind, 'normal'>[] = ['shadowEyes', 'longArms', 'staticSmile'];

    const anomalous = anomalyKinds.map((kind, index) =>
      generateCustomer(index + 20, difficulty, {
        forceAnomaly: true,
        forceAnomalyKind: kind,
        now: () => index + 200,
        rng: () => 0.99,
      }),
    );
    const normal = generateCustomer(21, difficulty, {
      forceAnomaly: false,
      now: () => 230,
      rng: () => 0.99,
    });

    expect(anomalous.map((customer) => customer.street.anomalyCue?.kind)).toEqual(anomalyKinds);
    expect(anomalous.every((customer) => customer.street.anomalyCue?.descriptor.includes('monster') === false)).toBe(true);
    expect(normal.anomalyKind).toBe('normal');
    expect(normal.street.anomalyCue).toBeNull();
  });

  it('adds deterministic street metadata for ordinary archetypes and movement intent', () => {
    const customer = generateCustomer(3, difficulty, {
      now: () => 31,
      rng: () => 0.99,
    });

    expect(customer.street.archetype).toBe('shopper');
    expect(customer.street.movementIntent).toBe('waiting');
    expect(customer.street.anomalyCue).toBeNull();
    expect(customer.street.source).toBe('streetQueue');
    expect(customer.street.encounterStage).toBe('approaching');
  });

  it('maps anomaly kinds to compatible street cue descriptors', () => {
    const customer = generateCustomer(4, difficulty, {
      forceAnomaly: true,
      forceAnomalyKind: 'longArms',
      now: () => 41,
      rng: () => 0.99,
    });

    expect(customer.street.anomalyCue).toMatchObject({
      kind: 'longArms',
      descriptor: 'sleeves hang too low and elbows bend after the hands move',
    });
  });

  it('allows deterministic reachability for each anomaly kind', () => {
    const shadow = generateCustomer(2, difficulty, {
      forceAnomaly: true,
      forceAnomalyKind: 'shadowEyes',
      now: () => 21,
      rng: () => 0.99,
    });
    const arms = generateCustomer(2, difficulty, {
      forceAnomaly: true,
      forceAnomalyKind: 'longArms',
      now: () => 22,
      rng: () => 0.99,
    });
    const smile = generateCustomer(2, difficulty, {
      forceAnomaly: true,
      forceAnomalyKind: 'staticSmile',
      now: () => 23,
      rng: () => 0.99,
    });

    expect([shadow.anomalyKind, arms.anomalyKind, smile.anomalyKind]).toEqual([
      'shadowEyes',
      'longArms',
      'staticSmile',
    ]);
  });
});
