import type { PreparedItem } from '../cooking/types';
import type { Order, OrderMatchResult } from './types';
import { summarizePrepared } from './types';

export function matchOrder(order: Order, preparedItems: PreparedItem[]): OrderMatchResult {
  const prepared = summarizePrepared(preparedItems);
  const expected = { fries: 0, burger: 0, nuggets: 0, strips: 0 };
  let expectedBurgerIngredients: string | null = null;

  for (const line of order.lines) {
    expected[line.kind] += line.count;
    if (line.kind === 'burger') {
      expectedBurgerIngredients = [...(line.ingredients ?? [])].sort().join(',');
    }
  }

  if (
    prepared.fries !== expected.fries ||
    prepared.burger !== expected.burger ||
    prepared.nuggets !== expected.nuggets ||
    prepared.strips !== expected.strips
  ) {
    return { ok: false, reason: 'Food counts do not match the ticket.' };
  }

  if (
    expectedBurgerIngredients &&
    prepared.burgers.some((ingredients) => [...ingredients].sort().join(',') !== expectedBurgerIngredients)
  ) {
    return { ok: false, reason: 'Burger ingredients do not match the ticket.' };
  }

  if (prepared.drink !== order.drink) {
    return { ok: false, reason: order.drink ? 'Wrong or missing drink.' : 'Unexpected drink.' };
  }

  return { ok: true, reason: 'Order matched.' };
}
