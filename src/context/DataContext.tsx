import { doc } from "firebase/firestore";
import {
  type PropsWithChildren,
  createContext,
  memo,
  useContext,
  useMemo,
} from "react";
import { db } from "../services/firebase";
import type { IGroup } from "../interfaces/IGroup";
import type { IIngredient } from "../interfaces/IIngredient";
import type { IRecipe } from "../interfaces/IRecipe";
import { useGroup } from "../hooks/useGroup";
import { useFetch } from "../hooks/useFetch";
import { useFetchQuery } from "../hooks/useFetchQuery";
import { queryIngredients } from "../services/api/ingredients";
import { queryRecipes } from "../services/api/recipes";
import { FullScreenSpinner } from "../components/FullScreenSpinner";

interface Value {
  listRecipes: Array<string>;
  listIngredients: Array<{ q: string; i: string }>;
  ingredients: Array<IIngredient>;
  recipes: Array<IRecipe>;
  checkedIngredients: Array<string>;
  ingredientsPrices: Record<string, Array<{ q: number; u: number }>>;
  currentListPrice: number;
  filters: {
    showCheckedsFirst: boolean;
  };
  currency: string;
  budget: number;
}

const DataContext = createContext<Value>({
  listRecipes: [],
  listIngredients: [],
  ingredients: [],
  recipes: [],
  checkedIngredients: [],
  ingredientsPrices: {},
  currentListPrice: 0,
  currency: "BRL",
  budget: 0,
  filters: {
    showCheckedsFirst: false,
  },
});

const DataContextProviderBase = ({ children }: PropsWithChildren) => {
  const { id } = useGroup();

  const fetchGroupMethod = useMemo(() => {
    if (!id) {
      throw new Error("missing group id");
    }
    return doc(db, `groups`, id);
  }, [id]);

  const fetchRecipesMethod = useMemo(() => queryRecipes(id || ""), [id]);
  const fetchIngredientsMethod = useMemo(
    () => queryIngredients(id || ""),
    [id]
  );

  const [fetchingGroup, group] = useFetch<Partial<IGroup>>(fetchGroupMethod);
  const [fetchingRecipes, recipes] = useFetchQuery<IRecipe>(fetchRecipesMethod);

  const [fetchingIngredients, ingredients] = useFetchQuery<IIngredient>(
    fetchIngredientsMethod
  );

  const isFetching = useMemo(() => {
    return fetchingGroup || fetchingRecipes || fetchingIngredients;
  }, [fetchingGroup, fetchingIngredients, fetchingRecipes]);

  const currentListPrice = useMemo(() => {
    let value = 0;

    if (!group) {
      return value;
    }

    Object.entries(group.ingredientsPrices || {}).forEach(
      ([ingredientId, ingredientPrice]) => {
        if (
          group.checkedIngredients &&
          group.checkedIngredients.includes(ingredientId)
        ) {
          value += ingredientPrice.reduce((prev, { q, u }) => {
            return prev + q * u;
          }, 0);
        }
      }
    );

    return value;
  }, [group]);

  const value = useMemo<Value>(() => {
    return {
      listRecipes: group ? group.currentRecipes || [] : [],
      listIngredients: group ? group.currentIngredients || [] : [],
      checkedIngredients: group ? group.checkedIngredients || [] : [],
      ingredientsPrices: group ? group.ingredientsPrices || {} : {},
      filters: group
        ? group.filters || { showCheckedsFirst: false }
        : { showCheckedsFirst: false },
      currency: group ? group.currency || "BRL" : "BRL",
      budget: group ? group.budget || 0 : 0,
      recipes,
      ingredients,
      currentListPrice,
    };
  }, [group, recipes, ingredients, currentListPrice]);

  return (
    <DataContext.Provider value={value}>
      {isFetching ? <FullScreenSpinner /> : children}
    </DataContext.Provider>
  );
};

export const DataContextProvider = memo(DataContextProviderBase);

export const useDataContext = () => useContext(DataContext);
