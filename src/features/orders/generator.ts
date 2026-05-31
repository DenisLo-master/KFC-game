import type { BurgerIngredient, DrinkFlavor } from '../cooking/types';
import type { DifficultyConfig } from '../difficulty/config';
import type { Order } from './types';

const drinks: DrinkFlavor[] = ['lemonade', 'soda', 'smoothie', 'juice'];
const burgerIngredientSets: BurgerIngredient[][] = [
  ['bun', 'patty', 'sauce'],
  ['bun', 'patty', 'lettuce', 'sauce'],
  ['bun', 'patty', 'tomato', 'sauce'],
  ['bun', 'patty', 'lettuce', 'tomato', 'sauce'],
];

export function generateOrder(sequence: number, difficulty: DifficultyConfig): Order {
  const wantsBurger = sequence % 3 !== 1;
  const wantsFries = sequence % 4 !== 2;
  const wantsNuggets = difficulty.level >= 2 && sequence % 3 === 1;
  const wantsStrips = difficulty.level >= 3 && sequence % 4 === 0;
  const burgerCount = wantsBurger ? 1 + (difficulty.maxItemsPerOrder >= 5 && sequence % 5 === 0 ? 1 : 0) : 0;
  const friesCount = wantsFries ? 1 + (sequence % 6 === 3 ? 1 : 0) : 0;
  const nuggetsCount = wantsNuggets ? 1 : 0;
  const stripsCount = wantsStrips ? 1 : 0;
  const burgerIngredients = burgerIngredientSets[(sequence + difficulty.level) % burgerIngredientSets.length];
  const lines = [
    ...(burgerCount > 0 ? [{ kind: 'burger' as const, count: burgerCount, ingredients: burgerIngredients }] : []),
    ...(friesCount > 0 ? [{ kind: 'fries' as const, count: friesCount }] : []),
    ...(nuggetsCount > 0 ? [{ kind: 'nuggets' as const, count: nuggetsCount }] : []),
    ...(stripsCount > 0 ? [{ kind: 'strips' as const, count: stripsCount }] : []),
  ].slice(0, difficulty.maxItemsPerOrder);

  return {
    id: `order-${sequence}`,
    lines: lines.length > 0 ? lines : [{ kind: 'fries', count: 1 }],
    drink: sequence % 2 === 0 ? drinks[sequence % drinks.length] : null,
  };
}
