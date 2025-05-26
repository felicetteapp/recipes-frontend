import type { IRecipe } from "../interfaces/IRecipe";

export const getQuantitiesFromArray = (array: IRecipe["ingredients"]) => {
  const quantities: Record<string, string> = {};

  array.forEach(({ ingredient, quantity }) => {
    quantities[ingredient] = quantity;
  });

  return quantities;
};
