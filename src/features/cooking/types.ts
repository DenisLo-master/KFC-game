export type BurgerIngredient = 'bun' | 'patty' | 'lettuce' | 'tomato' | 'sauce';
export type CookableKind = 'fries' | 'burger' | 'nuggets' | 'strips';
export type DrinkFlavor = 'lemonade' | 'soda' | 'smoothie' | 'juice';
export type FoodKind = CookableKind | 'drink';

export type PreparedItem =
  | { kind: Exclude<CookableKind, 'burger'>; id: string }
  | { kind: 'burger'; ingredients: BurgerIngredient[]; id: string }
  | { kind: 'drink'; flavor: DrinkFlavor; id: string };

export type StationId = 'fryer' | 'grill' | 'oven' | 'drink';

export type CookingStation = {
  id: StationId;
  label: string;
  status: 'idle' | 'cooking' | 'ready';
  product: FoodKind | null;
  remaining: number;
  duration: number;
  drinkFlavor?: DrinkFlavor;
  burgerIngredients?: BurgerIngredient[];
};
