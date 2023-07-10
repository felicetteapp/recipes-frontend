export interface IGroup {
  id: string;
  creatorUid:string;
  name: string;
  currentRecipes: Array<string>;
  currentIngredients: Array<{ i: string; q: string }>;
  checkedIngredients: Array<string>;
  ingredientsPrices: Record<string, Array<{ q: number; u: number }>>;
  filters: {
    showCheckedsFirst: boolean;
  };
  currency: string;
  budget: number;
}
