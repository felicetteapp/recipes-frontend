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
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDataContext } from "../context/DataContext";
import { IngredientsSelect } from "./IngredientsSelect";

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
    setDialogIsOpen(false);
  }, [currentIngredientsWithQuantity, onChange]);

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

  return (
    <>
      <Card>
        <CardActionArea onClick={() => setDialogIsOpen(true)}>
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
      <Dialog open={dialogIsOpen} fullScreen>
        <DialogTitle>
          {t("common.ingredient", { count: listIngredients.length })}
        </DialogTitle>
        <DialogContent>
          <IngredientsSelect
            value={currentSelecteds}
            onChange={setCurrentSelecteds}
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
