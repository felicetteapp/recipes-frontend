import { memo, useCallback } from "react";
import { useDataContext } from "../context/DataContext";
import {
  List,
  IconButton,
  Icon,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Chip,
  ListItemButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { IRecipe } from "../interfaces/IRecipe";

interface Props {
  onEditClick: (item: IRecipe) => void;
  checkeds: Array<string>;
  onChangeCheckeds: (items: Array<string>) => void;
  enableSelection: boolean;
  showIsInList?: boolean;
}

const RecipesListBase = ({
  onEditClick,
  checkeds,
  onChangeCheckeds,
  enableSelection,
  showIsInList = false,
}: Props) => {
  const { recipes, ingredients, listRecipes } = useDataContext();
  const { t } = useTranslation();

  const handleOnClick = useCallback(
    (id: string) => {
      if (!enableSelection) {
        return undefined;
      } else {
        return () => {
          const isChecked = checkeds.indexOf(id) > -1;

          const newList = [...checkeds];
          if (!isChecked) {
            newList.push(id);
            onChangeCheckeds([...newList]);
          } else {
            onChangeCheckeds(newList.filter((itemId) => itemId !== id));
          }
        };
      }
    },
    [enableSelection, checkeds, onChangeCheckeds]
  );
  return (
    <List disablePadding>
      {recipes.map((item) => {
        return (
          <ListItemButton
            key={`this_recipe_${item.id}`}
            component="a"
            disableGutters
            disableRipple={!enableSelection}
            onClick={handleOnClick(item.id)}
          >
            {enableSelection && (
              <ListItemIcon>
                <Checkbox checked={checkeds.indexOf(item.id) > -1} />
              </ListItemIcon>
            )}
            <ListItemText
              sx={{ mr: 2 }}
              primary={item.name}
              secondary={item.ingredients
                .map(
                  (thisIngredient) =>
                    ingredients.find(
                      (ingredient) =>
                        ingredient.id === thisIngredient.ingredient
                    )?.name
                )
                .join(", ")}
            />
            {showIsInList &&
              !enableSelection &&
              listRecipes.includes(item.id) && (
                <Chip
                  color="success"
                  label={t("recipes.onList")}
                  size="small"
                  icon={<Icon>list</Icon>}
                  variant="outlined"
                />
              )}
            {!enableSelection && (
              <IconButton
                color="warning"
                sx={{ ml: 2 }}
                onClick={() => onEditClick(item)}
              >
                <Icon>edit</Icon>
              </IconButton>
            )}
          </ListItemButton>
        );
      })}
    </List>
  );
};

export const RecipesList = memo(RecipesListBase);
