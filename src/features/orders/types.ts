import type { BurgerIngredient, CookableKind, DrinkFlavor, PreparedItem } from '../cooking/types';

export type OrderLine = {
  kind: CookableKind;
  count: number;
  ingredients?: BurgerIngredient[];
};

export type Order = {
  id: string;
  lines: OrderLine[];
  drink: DrinkFlavor | null;
};

export type OrderMatchResult = {
  ok: boolean;
  reason: string;
};

export type PreparedSummary = {
  fries: number;
  burger: number;
  burgers: BurgerIngredient[][];
  nuggets: number;
  strips: number;
  drink: DrinkFlavor | null;
};

export function summarizePrepared(items: PreparedItem[]): PreparedSummary {
  return items.reduce<PreparedSummary>(
    (summary, item) => {
      if (item.kind === 'drink') {
        summary.drink = item.flavor;
      } else if (item.kind === 'burger') {
        summary.burger += 1;
        summary.burgers.push(item.ingredients);
      } else {
        summary[item.kind] += 1;
      }
      return summary;
    },
    { fries: 0, burger: 0, burgers: [], nuggets: 0, strips: 0, drink: null },
  );
}
