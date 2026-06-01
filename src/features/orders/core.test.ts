import { describe, expect, it } from 'vitest';
import type { DifficultyConfig } from '../difficulty/config';
import { generateCustomer } from '../customers/generator';
import { generateOrder } from './generator';
import { matchOrder } from './matcher';
import type { Order } from './types';
import type { PreparedItem } from '../cooking/types';

const difficulty: DifficultyConfig = {
  level: 3,
  maxItemsPerOrder: 4,
  anomalyChance: 0.25,
  customerPatienceMs: 20_000,
  subtleAnomalyChance: 0.25,
};

describe('order and customer core behavior', () => {
  it('keeps the first generated customer normal even with anomaly-friendly rng', () => {
    const customer = generateCustomer(1, difficulty, {
      now: () => 10,
      rng: () => 0,
    });

    expect(customer.anomaly).toBe(false);
    expect(customer.anomalyKind).toBe('normal');
  });

  it('allows tests to force an anomaly without relying on random sequence luck', () => {
    const customer = generateCustomer(2, difficulty, {
      forceAnomaly: true,
      now: () => 20,
      rng: () => 0.99,
    });

    expect(customer.anomaly).toBe(true);
    expect(customer.anomalyKind).not.toBe('normal');
  });

  it('generates the MVP dish variety across the core order loop', () => {
    const dishKinds = new Set(
      Array.from({ length: 12 }, (_, index) => generateOrder(index + 1, difficulty))
        .flatMap((order) => order.lines.map((line) => line.kind)),
    );

    expect(dishKinds).toEqual(new Set(['burger', 'fries', 'nuggets', 'strips']));
  });

  it('matches complete food and drink tickets and rejects wrong trays', () => {
    const order: Order = {
      id: 'order-test',
      lines: [
        { kind: 'burger', count: 1, ingredients: ['bun', 'patty', 'sauce'] },
        { kind: 'fries', count: 1 },
      ],
      drink: 'lemonade',
    };
    const correctTray: PreparedItem[] = [
      { kind: 'burger', id: 'burger-1', ingredients: ['patty', 'sauce', 'bun'] },
      { kind: 'fries', id: 'fries-1' },
      { kind: 'drink', id: 'drink-1', flavor: 'lemonade' },
    ];
    const wrongTray: PreparedItem[] = [
      { kind: 'burger', id: 'burger-2', ingredients: ['bun', 'patty', 'lettuce', 'sauce'] },
      { kind: 'fries', id: 'fries-2' },
      { kind: 'drink', id: 'drink-2', flavor: 'lemonade' },
    ];

    expect(matchOrder(order, correctTray)).toEqual({ ok: true, reason: 'Order matched.' });
    expect(matchOrder(order, wrongTray).ok).toBe(false);
  });
});
