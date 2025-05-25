import {
  DialogTitle,
  DialogContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  Divider,
  DialogActions,
  Button,
  Icon,
} from "@mui/material";
import { useState, useCallback, useEffect, memo } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useDataContext } from "../context/DataContext";
import { getQuantitiesFromArray } from "../helpers/recipes";
import { useCreate } from "../hooks/useCreate";
import { useDelete } from "../hooks/useDelete";
import { useGroup } from "../hooks/useGroup";
import type { IRecipe } from "../interfaces/IRecipe";
import { editOrCreateRecipe, deleteRecipe } from "../services/api/recipes";
import { IngredientsSelect } from "./IngredientsSelect";

const RecipeInputDisplayBase = ({
  data: { id, name, ingredients },
  onSave,
  onCancel,
  onDelete,
}: {
  data: Partial<IRecipe>;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) => {
  const [inputName, setInputName] = useState(name || "");
  const [quantityValues, setQuantityValues] = useState<Record<string, string>>(
    ingredients ? getQuantitiesFromArray(ingredients) : {}
  );
  const [selectedIngredients, setSelectedIngredients] = useState<Array<string>>(
    ingredients?.map(({ ingredient }) => ingredient) || []
  );
  const [creating, handleCreationg] = useCreate();
  const [deleting, handleDeletion] = useDelete();
  const { id: groupId } = useGroup();
  const { ingredients: dataIngredients } = useDataContext();
  const { t } = useTranslation();

  const handleOnSaveClick = useCallback(async () => {
    if (!groupId) {
      throw new Error("missing groupId");
    }
    return editOrCreateRecipe(groupId, {
      id,
      name: inputName,
      ingredients: selectedIngredients.map((ingredient) => {
        return {
          ingredient,
          quantity: quantityValues[ingredient] || "",
        };
      }),
    });
  }, [groupId, id, selectedIngredients, inputName, quantityValues]);

  const handleOnDeleteClick = useCallback(() => {
    if (!id) {
      throw new Error("missing id");
    }

    if (!groupId) {
      throw new Error("missing groupId");
    }

    return deleteRecipe(groupId, id);
  }, [groupId, id]);

  useEffect(() => {
    setQuantityValues((currentValues) => {
      const newValue: Record<string, string> = {};

      selectedIngredients.forEach((id) => {
        if (typeof currentValues[id] !== "undefined") {
          newValue[id] = currentValues[id];
          return;
        }

        newValue[id] = "";
      });

      return newValue;
    });
  }, [selectedIngredients]);

  return (
    <>
      <DialogTitle>{id ? inputName : t("actions.recipe.new")}</DialogTitle>
      <DialogContent>
        {creating || deleting ? (
          <CircularProgress />
        ) : (
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ paddingTop: 2 }}
          >
            <Stack sx={{ width: "100%" }} spacing={2}>
              <TextField
                placeholder={t("common.name")}
                label={t("common.name")}
                variant="outlined"
                value={inputName}
                onChange={(e) => setInputName(e.currentTarget.value)}
                fullWidth
              />
              <Typography variant="body2" fontSize={14}>
                {t("recipes.inputDisplay.ingredientsHelperText")}
              </Typography>
              <IngredientsSelect
                value={selectedIngredients}
                onChange={setSelectedIngredients}
              />
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" fontSize={14}>
                <Trans
                  t={t}
                  i18nKey={"recipes.inputDisplay.quantityHelperText"}
                  components={{
                    small: (
                      <Typography
                        variant="body2"
                        component="small"
                        fontSize={12}
                      />
                    ),
                  }}
                ></Trans>
              </Typography>
              {Object.entries(quantityValues).map(([ingredientId, value]) => {
                const ingredient = dataIngredients.find((thisIngredient) => {
                  return thisIngredient.id === ingredientId;
                });
                if (!ingredient) {
                  return null;
                }
                return (
                  <TextField
                    key={`quantity_${ingredient.id}`}
                    variant="outlined"
                    placeholder={t("common.quantityOf", {
                      name: ingredient.name,
                    })}
                    label={t("common.quantityOf", { name: ingredient.name })}
                    value={value}
                    onChange={(e) => {
                      const currentValue = e.currentTarget.value;
                      setQuantityValues((currentValues) => {
                        return {
                          ...currentValues,
                          [ingredientId]: currentValue,
                        };
                      });
                    }}
                    sx={{ marginTop: 2 }}
                  />
                );
              })}
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ paddingBottom: 4 }}>
        <Button
          fullWidth
          color="inherit"
          onClick={onCancel}
          startIcon={<Icon>arrow_back</Icon>}
        >
          {t("actions.cancel")}
        </Button>
        <Button
          color="success"
          onClick={() => handleCreationg(handleOnSaveClick).then(onSave)}
          startIcon={<Icon>save</Icon>}
          fullWidth
        >
          {t("actions.save")}
        </Button>
        {id && (
          <Button
            color="error"
            onClick={() => {
              const doDelete = window.confirm(t("actions.deleteConfirm"));
              if (!doDelete) {
                return;
              }

              handleDeletion(handleOnDeleteClick).then(onDelete);
            }}
            startIcon={<Icon>delete</Icon>}
            fullWidth
          >
            {t("actions.delete")}
          </Button>
        )}
      </DialogActions>
    </>
  );
};

export const RecipeInputDisplay = memo(RecipeInputDisplayBase);
