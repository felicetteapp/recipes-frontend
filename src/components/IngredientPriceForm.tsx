import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import { useDataContext } from "../context/DataContext";
import { useTranslation } from "react-i18next";
import { IIngredient } from "../interfaces/IIngredient";

interface itemValue {
  quantity: string;
  unitPrice: string;
}

const useIngredientPriceValues = (initialValue: Array<itemValue>) => {
  const [items, setItems] = useState(initialValue);

  const setItemValue = useCallback(
    (index: number, value: Partial<itemValue>) => {
      setItems((currentValues) => {
        const newValues = [...currentValues];
        const originalValue = currentValues[index];
        newValues[index] = Object.assign({}, originalValue, value);
        return newValues;
      });
    },
    []
  );

  const addItem = useCallback(() => {
    setItems((currentValues) => {
      return [...currentValues, { quantity: "1", unitPrice: "0" }];
    });
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((currentItems) => {
      const newItems = [...currentItems];
      newItems.splice(index, 1);
      return newItems;
    });
  }, []);

  return {
    items,
    setItems,
    setItemValue,
    addItem,
    removeItem,
  };
};

interface Props {
  ingredient: IIngredient;
  data: Array<itemValue>;
  onSubmit: (data: Array<{ q: number; u: number }>) => void;
  onClose: () => void;
  onSubmitWithoutPrice: () => void;
}

const IngredientPriceFormBase = ({
  data,
  onSubmit,
  onSubmitWithoutPrice,
  onClose,
  ingredient,
}: Props) => {
  const { items, setItemValue, addItem, removeItem } =
    useIngredientPriceValues(data);

  const { currency } = useDataContext();
  const { t } = useTranslation();

  const totalValue = useMemo(
    () =>
      items.reduce((prevValue, { quantity, unitPrice }) => {
        return prevValue + Number(quantity) * Number(unitPrice);
      }, 0),
    [items]
  );

  const handleOnSubmit = useCallback(() => {
    onSubmit(
      items.map(({ quantity, unitPrice }) => ({
        q: Number(quantity),
        u: Number(unitPrice),
      }))
    );
  }, [items, onSubmit]);

  return (
    <>
      <DialogTitle>
        <IconButton edge="start" sx={{ mr: 2 }} onClick={onClose}>
          <Icon>arrow_back</Icon>
        </IconButton>
        {ingredient.name}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {items.map((itemData, index) => {
            const { quantity, unitPrice } = itemData;

            return (
              <Card
                variant="outlined"
                elevation={0}
                key={`price_${index}`}
                sx={{ background: "transparent" }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={t("common.price")}
                      type="number"
                      value={items[index].unitPrice}
                      error={isNaN(Number(unitPrice))}
                      onChange={(e) =>
                        setItemValue(index, {
                          unitPrice: e.currentTarget.value,
                        })
                      }
                      onFocus={(e) => e.currentTarget.select()}
                      InputProps={{
                        inputProps: {
                          step: "0.1",
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            {t("{{value,currency}}", {
                              currency,
                              value: Number(unitPrice),
                            })}
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Stack direction="row" spacing={2}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label={t("common.quantity")}
                        type="number"
                        value={quantity}
                        error={isNaN(Number(quantity))}
                        onChange={(e) =>
                          setItemValue(index, {
                            quantity: e.currentTarget.value,
                          })
                        }
                        onFocus={(e) => e.currentTarget.select()}
                      />
                      <ButtonGroup variant="outlined">
                        {[1, 2, 3, 4, 5].map((thisQ) => (
                          <Button
                            key={`q_${thisQ}`}
                            onClick={() =>
                              setItemValue(index, { quantity: String(thisQ) })
                            }
                          >
                            {thisQ}
                          </Button>
                        ))}
                      </ButtonGroup>
                    </Stack>
                    <Typography
                      textAlign={"center"}
                      variant="h6"
                      color={"secondary"}
                    >
                      {t("{{value,currency}}", {
                        currency,
                        value: Number(quantity) * Number(unitPrice),
                      })}
                    </Typography>
                  </Stack>
                </CardContent>
                {index > 0 && (
                  <CardActions>
                    <Button
                      fullWidth
                      color="error"
                      startIcon={<Icon>delete</Icon>}
                      onClick={() => removeItem(index)}
                    >
                      {t("actions.price.delete")}
                    </Button>
                  </CardActions>
                )}
              </Card>
            );
          })}
          <Button
            color="success"
            startIcon={<Icon>add</Icon>}
            onClick={addItem}
          >
            {t("actions.price.addAnother")}
          </Button>
          <Typography
            color="primary"
            variant="h5"
            textAlign={"center"}
            fontWeight={600}
          >
            {t("{{totalValue,currency}}", { totalValue, currency })}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ paddingBottom: "25px" }}>
        <Button
          color="inherit"
          fullWidth
          startIcon={<Icon>save_outlined</Icon>}
          onClick={onSubmitWithoutPrice}
        >
          {t("actions.price.saveWithout")}
        </Button>
        <Button
          variant="contained"
          color="success"
          fullWidth
          startIcon={<Icon>save</Icon>}
          onClick={handleOnSubmit}
        >
          {t("actions.price.save")}
        </Button>
      </DialogActions>
    </>
  );
};

export const IngredientPriceForm = memo(IngredientPriceFormBase);
