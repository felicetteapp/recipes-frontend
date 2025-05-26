import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Divider,
} from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDataContext } from "../context/DataContext";
import { IngredientsSelect } from "./IngredientsSelect";
import { useSearchParams, useNavigate } from "react-router-dom";
import Select from "react-select/dist/declarations/src/Select";
import type { IIngredient } from "../interfaces/IIngredient";
import type { GroupBase } from "react-select";

const getQuantityObject = (list: Array<{ q: string; i: string }>) => {
  const object: Record<string, string> = {};

  list.forEach(({ q, i }) => {
    object[i] = q;
  });

  return object;
};

interface Props {
  onChange: (values: Array<{ i: string; q: string }>) => void;
}
const ListIngredientsSelectBase = ({ onChange }: Props) => {
  const { listIngredients, ingredients } = useDataContext();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const ingredientSelectRef =
    useRef<Select<IIngredient, true, GroupBase<IIngredient>>>(null);

  const [currentSelecteds, setCurrentSelecteds] = useState(
    listIngredients.map(({ i }) => i)
  );

  const labels = useMemo(() => {
    return ingredients
      .filter(({ id }) => listIngredients.find(({ i }) => i === id))
      .map(({ name }) => name)
      .join(", ");
  }, [ingredients, listIngredients]);

  const [ingredientsQuantity, setIngredientsQuantity] = useState<
    Record<string, string>
  >(getQuantityObject(listIngredients));

  const [searchParams, setSearchParams] = useSearchParams();
  const shouldFocusSelect = searchParams.get("focus") === "true";

  const currentIngredientsWithQuantity = useMemo(() => {
    return currentSelecteds.map((ingredient) => {
      return {
        i: ingredient,
        q: ingredientsQuantity[ingredient] || "",
      };
    });
  }, [currentSelecteds, ingredientsQuantity]);

  const handleOnSave = useCallback(() => {
    onChange(currentIngredientsWithQuantity);
    navigate(-1);
  }, [currentIngredientsWithQuantity, navigate, onChange]);

  useEffect(() => {
    setCurrentSelecteds(listIngredients.map(({ i }) => i));
    setIngredientsQuantity(getQuantityObject(listIngredients));
  }, [listIngredients]);

  useEffect(() => {
    setIngredientsQuantity((currentValues) => {
      const newValue: Record<string, string> = {};

      currentSelecteds.forEach((id) => {
        if (typeof currentValues[id] !== "undefined") {
          newValue[id] = currentValues[id];
          return;
        }

        newValue[id] = "";
      });

      return newValue;
    });
  }, [currentSelecteds]);

  useEffect(() => {
    const isRecipeSelectOpen =
      searchParams.get("listIngredientsSelect") === "true";
    if (isRecipeSelectOpen) {
      setDialogIsOpen(true);
    } else {
      setDialogIsOpen(false);
    }
  }, [searchParams]);
  useEffect(() => {
    if (shouldFocusSelect && ingredientSelectRef.current) {
      ingredientSelectRef.current.focusInput();
    }
  }, [shouldFocusSelect]);

  return (
    <>
      <Card>
        <CardActionArea
          onClick={() => setSearchParams({ listIngredientsSelect: "true" })}
        >
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t("common.ingredient", {
                count: Number.POSITIVE_INFINITY,
              })}
            </Typography>
            <Typography variant="body1">{labels}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Dialog
        open={dialogIsOpen}
        fullScreen
        keepMounted
        disableEnforceFocus
        disableAutoFocus
      >
        <DialogTitle>
          {t("common.ingredient", { count: listIngredients.length })}
        </DialogTitle>
        <DialogContent>
          <IngredientsSelect
            value={currentSelecteds}
            onChange={setCurrentSelecteds}
            ref={ingredientSelectRef}
          />
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          <Stack spacing={2}>
            {Object.entries(ingredientsQuantity).map(
              ([ingredientId, value]) => {
                const ingredient = ingredients.find(({ id }) => {
                  return id === ingredientId;
                });
                if (!ingredient) {
                  return null;
                }
                return (
                  <TextField
                    key={`quantity_${ingredient.id}`}
                    variant="outlined"
                    placeholder={t("common.quantityDescriptionOf", {
                      name: ingredient.name,
                    })}
                    label={t("common.quantityDescriptionOf", {
                      name: ingredient.name,
                    })}
                    size="small"
                    value={value}
                    onChange={(e) => {
                      const currentValue = e.currentTarget.value;
                      setIngredientsQuantity((currentValues) => {
                        return {
                          ...currentValues,
                          [ingredientId]: currentValue,
                        };
                      });
                    }}
                    sx={{ marginTop: 2 }}
                  />
                );
              }
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ paddingBottom: "25px" }}>
          <Button fullWidth onClick={handleOnSave} variant="contained">
            {t("common.ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const ListIngredientsSelect = memo(ListIngredientsSelectBase);
