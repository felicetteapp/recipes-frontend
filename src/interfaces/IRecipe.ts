export interface IRecipe {
  id: string;
  name: string;
  ingredients: Array<{
    ingredient: string;
    quantity: string;
  }>;
}
