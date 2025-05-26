import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Icon,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  type SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
  Snackbar,
} from "@mui/material";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDataContext } from "../context/DataContext";
import { useCreate } from "../hooks/useCreate";
import { arrayRemove, arrayUnion, deleteField } from "firebase/firestore";

import { IngredientPriceForm } from "./IngredientPriceForm";
import { Trans, useTranslation } from "react-i18next";
import { RecipesSelect } from "./RecipesSelect";
import { ListIngredientsSelect } from "./ListIngredientsSelect";
import { useAppStateContext } from "../context/AppStateContext";
import { useMonetaryInputState } from "../hooks/useMonetaryInputState";
import type { IIngredient } from "../interfaces/IIngredient";
import type { IRecipe } from "../interfaces/IRecipe";
import { useGroup } from "../hooks/useGroup";
import { updateGroup } from "../services/api/groups";
import { GroupNameSubHeader } from "./GroupNameSubHeader";
import { usePeristentState } from "../hooks/usePersistentState";
import {
  generatePath,
  useMatch,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const availableCurrencies = ["USD", "ARS", "BRL", "EUR"];

const ListsPageBase = () => {
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const { listRecipes, currency, budget, currentListPrice } = useDataContext();
  const { id: groupId } = useGroup();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [, handleSave] = useCreate();

  const [budgetValue, formatedBudgetValue, setBudgetValue, setRawValue] =
    useMonetaryInputState(budget);

  const { setAction, clearState, setTitle } = useAppStateContext();
  const isEditingList = useMatch("list/edit");
  const navigate = useNavigate();
  const theme = useTheme();

  const formater = useMemo(() => {
    return new Intl.DisplayNames([language], { type: "currency" });
  }, [language]);

  const currenciesList = useMemo(() => {
    return availableCurrencies.map((ac) => ({
      value: ac,
      name: formater.of(ac),
    }));
  }, [formater]);

  const handleClearListOnClick = useCallback(() => {
    const confirmClear = window.confirm(t("list.confirmClearAllChecks"));
    if (!confirmClear) {
      return;
    }
    handleSave(() => {
      if (!groupId) {
        throw new Error("missing groupId");
      }
      return updateGroup(
        groupId,
        "checkedIngredients",
        [],
        "ingredientsPrices",
        []
      );
    });
  }, [groupId, handleSave, t]);

  const handleAddIngredientOnClick = useCallback(() => {
    // http://localhost:3000/list/edit?listIngredientsSelect=true
    navigate(generatePath("edit?listIngredientsSelect=true&focus=true"));
  }, [navigate]);

  const handleCurrencyOnChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      handleSave(() => {
        if (!groupId) {
          throw new Error("missing groupId");
        }
        return updateGroup(groupId, "currency", e.target.value);
      });
    },
    [groupId, handleSave]
  );

  useEffect(() => {
    setTitle(t("common.list", { count: 1 }));
    setAction(
      <Button
        color="warning"
        startIcon={<Icon>edit</Icon>}
        onClick={() => navigate("edit")}
      >
        {t("list.editList")}
      </Button>
    );
    return () => {
      clearState();
    };
  }, [setAction, clearState, t, setTitle, navigate]);

  useEffect(() => {
    setRawValue(budget);
  }, [setRawValue, budget]);

  useEffect(() => {
    if (isEditingList) {
      setModalEditIsOpen(true);
    } else {
      setModalEditIsOpen(false);
    }
  }, [isEditingList]);

  return (
    <>
      <Stack spacing={2} sx={{ paddingBottom: "120px" }}>
        <div>
          <Typography variant="h4">{t("common.list", { count: 1 })}</Typography>
          <GroupNameSubHeader />
        </div>
        <IngredientsListFromRecipes />
        <Button
          startIcon={<Icon>playlist_add</Icon>}
          fullWidth
          color="warning"
          onClick={handleAddIngredientOnClick}
        >
          {t("actions.ingredient.add")}
        </Button>
        <Button
          startIcon={<Icon>remove_done</Icon>}
          fullWidth
          color="error"
          onClick={handleClearListOnClick}
        >
          {t("list.clearAllChecks")}
        </Button>
      </Stack>
      <Dialog
        fullScreen
        open={modalEditIsOpen}
        keepMounted
        disableEnforceFocus
        disableAutoFocus
      >
        <DialogTitle>{t("list.editList")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {t("list.recipesOnListDescription")}
            </Typography>
            <RecipesSelect
              value={listRecipes}
              onChange={async (newValues) => {
                await handleSave(() => {
                  if (!groupId) {
                    throw new Error("missing groupId");
                  }
                  return updateGroup(groupId, "currentRecipes", newValues);
                });
              }}
            />
            <Divider />
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {t("list.ingredientsOnListDescription")}
            </Typography>
            <ListIngredientsSelect
              onChange={(newValues) => {
                handleSave(() => {
                  if (!groupId) {
                    throw new Error("missing groupId");
                  }
                  return updateGroup(groupId, "currentIngredients", newValues);
                });
              }}
            />
            <Divider />
            <TextField
              label={t("common.budget")}
              placeholder={t("common.budget")}
              value={String(budgetValue)}
              type="number"
              onChange={(e) => {
                setBudgetValue(e.currentTarget.value);
              }}
              InputProps={{
                inputProps: {
                  step: "0.1",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    {formatedBudgetValue}
                  </InputAdornment>
                ),
              }}
              onBlur={() => {
                handleSave(() => {
                  if (!groupId) {
                    throw new Error("missing groupId");
                  }
                  return updateGroup(groupId, "budget", budgetValue);
                });
              }}
            />
            <div>
              <FormControl sx={{ m: 1, ml: 0, mr: 0 }} fullWidth>
                <InputLabel id="currency-select-label">
                  {t("common.currency")}
                </InputLabel>
                <Select
                  fullWidth
                  labelId="currency-select-label"
                  id="currency-select"
                  input={<OutlinedInput label={t("common.currency")} />}
                  value={currency}
                  onChange={handleCurrencyOnChange}
                >
                  {currenciesList.map(({ value, name }) => (
                    <MenuItem key={value} value={value}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ paddingBottom: "25px" }}>
          <Button fullWidth onClick={() => navigate(-1)} variant="contained">
            {t("common.ok")}
          </Button>
        </DialogActions>
      </Dialog>
      <Paper
        elevation={1}
        sx={{
          width: "100%",
          padding: 2,
          textAlign: "center",
          position: "fixed",
          left: 0,
          top: "auto",
          bottom: "85px",
        }}
      >
        <Stack
          spacing={1}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Typography variant="body2" color="text.secondary" textAlign="left">
            <Trans
              i18nKey={"list.value.usedOfBudget"}
              values={{
                usedValue: currentListPrice,
                budgetValue: budget,
                currency,
              }}
              components={{
                strongUsed: (
                  <Typography
                    key={"strongUsed"}
                    color="primary"
                    fontWeight="bolder"
                    component={"strong"}
                  />
                ),
                strong: (
                  <Typography
                    key={"strong"}
                    color="secondary"
                    fontWeight="bolder"
                    component={"strong"}
                  />
                ),
              }}
            />
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="right">
            <Trans
              i18nKey={"list.value.availableBudget"}
              values={{
                availableValue: budget - currentListPrice,
                currency,
              }}
              components={{
                strong: (
                  <Typography
                    key={"strong"}
                    color={
                      budget - currentListPrice >= 9
                        ? theme.palette.success.light
                        : theme.palette.error.light
                    }
                    fontSize="inherit"
                    fontWeight="bolder"
                    component="strong"
                  />
                ),
              }}
            />
          </Typography>
        </Stack>
      </Paper>
    </>
  );
};

export const ListsPage = memo(ListsPageBase);

const IngredientsListFromRecipesBase = () => {
  const [modalFilterIsOpen, setModalFilterIsOpen] = useState(false);
  const {
    ingredients: dataIngredients,
    recipes: dataRecipes,
    checkedIngredients,
    listIngredients,
    listRecipes,
    ingredientsPrices,
    currency,
    filters,
  } = useDataContext();
  const { id: groupId } = useGroup();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<
    IIngredient | false
  >(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const [listDisplayType, setListDisplayType] = usePeristentState<
    "ingredients" | "recipes"
  >("@list.listDisplayType", "ingredients");

  const handleModalOnClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleOpenModal = useCallback((ingredient: IIngredient) => {
    setEditingIngredient(ingredient);
    setModalOpen(true);
  }, []);

  const recipes = useMemo(() => {
    return dataRecipes.filter(({ id }) => {
      return listRecipes.includes(id);
    });
  }, [dataRecipes, listRecipes]);

  const ingredients = useMemo(() => {
    return listIngredients.map(({ i, q }) => {
      return {
        ingredient: dataIngredients.find(({ id }) => id === i) as IIngredient,
        quantityDescription: q,
      };
    });
  }, [dataIngredients, listIngredients]);

  const ingredientsFormated = useMemo(() => {
    const listOfIngredients: Array<{
      ingredient: IIngredient;
      recipes: Array<IRecipe>;
      texts: Array<string>;
    }> = [];
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((thisIngredient) => {
        const currentIngredientIndex = listOfIngredients.findIndex(
          (thisIngredientFromList) =>
            thisIngredientFromList.ingredient.id === thisIngredient.ingredient
        );

        if (currentIngredientIndex < 0) {
          listOfIngredients.push({
            ingredient: dataIngredients.find(
              ({ id }) => id === thisIngredient.ingredient
            ) as IIngredient,
            recipes: [recipe],
            texts: [],
          });
        } else {
          listOfIngredients[currentIngredientIndex].recipes.push(recipe);
        }
      });
    });

    ingredients.forEach((thisIngredient) => {
      const currentIngredientIndex = listOfIngredients.findIndex(
        (thisIngredientFromList) =>
          thisIngredientFromList.ingredient.id === thisIngredient.ingredient.id
      );

      if (currentIngredientIndex < 0) {
        const initialTexts = thisIngredient.quantityDescription
          ? [thisIngredient.quantityDescription]
          : [];
        listOfIngredients.push({
          ingredient: dataIngredients.find(
            ({ id }) => id === thisIngredient.ingredient.id
          ) as IIngredient,
          recipes: [],
          texts: initialTexts,
        });
      } else {
        if (thisIngredient.quantityDescription) {
          listOfIngredients[currentIngredientIndex].texts.push(
            thisIngredient.quantityDescription
          );
        }
      }
    });
    return listOfIngredients;
  }, [recipes, ingredients, dataIngredients]);

  const actualTextsToDisplays = useMemo(() => {
    const items = ingredientsFormated.map((item) => {
      const descriptions = [...item.texts];

      item.recipes.forEach((recipe) => {
        const ingredientExists = recipe.ingredients.find(
          (recipeIngredient) =>
            recipeIngredient.ingredient === item.ingredient.id
        );
        if (!ingredientExists) {
          return;
        }

        descriptions.push(
          t("list.quantityForRecipe", {
            quantity: ingredientExists.quantity,
            recipe: recipe.name,
          })
        );
      });

      descriptions.sort();

      return {
        ingredient: item.ingredient,
        descriptions,
      };
    });

    items.sort((itemA, itemB) => {
      return itemA.ingredient.name.localeCompare(
        itemB.ingredient.name,
        language
      );
    });

    if (filters.showCheckedsFirst) {
      items.sort((itemA, itemB) => {
        const itemAIsChecked = checkedIngredients.includes(itemA.ingredient.id);
        const itemBIsChecked = checkedIngredients.includes(itemB.ingredient.id);

        if (itemAIsChecked && !itemBIsChecked) {
          return -1;
        } else if (itemBIsChecked && !itemAIsChecked) {
          return 1;
        }

        return 0;
      });
    }

    return items;
  }, [
    ingredientsFormated,
    filters.showCheckedsFirst,
    t,
    language,
    checkedIngredients,
  ]);

  const sortedRecies = useMemo(() => {
    const list = [...recipes];

    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [recipes]);

  const [listDisplaySnackbar, setListDisplaySnackbar] = useState(false);

  useEffect(() => {
    const filterModalShouldBeOpen = searchParams.get("filterModal") === "open";

    if (filterModalShouldBeOpen) {
      setModalFilterIsOpen(true);
    } else {
      setModalFilterIsOpen(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const editingIngredientIdParam = searchParams.get("editingIngredientId");

    if (editingIngredientIdParam) {
      const ingredientFromParam = dataIngredients.find(
        (i) => i.id === editingIngredientIdParam
      );

      if (ingredientFromParam) {
        handleOpenModal(ingredientFromParam);
      } else {
        handleModalOnClose();
      }
    } else {
      handleModalOnClose();
    }
  }, [handleModalOnClose, handleOpenModal, dataIngredients, searchParams]);

  return (
    <>
      <Snackbar
        open={listDisplaySnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={2500}
        onClose={() => setListDisplaySnackbar(false)}
        message={t(`list.snackbar.showingListGroupedBy.${listDisplayType}`)}
        sx={{ bottom: { xs: 150 } }}
        key={`snackbark.${listDisplayType}`}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => setListDisplaySnackbar(false)}
          >
            {t("common.ok")}
          </Button>
        }
      />
      <Stack direction="row" spacing={1}>
        <Button
          onClick={() => {
            setSearchParams({
              filterModal: "open",
            });
          }}
          color="secondary"
          startIcon={<Icon>tune</Icon>}
          variant="outlined"
        >
          {t("list.filtersAndOrder")}
        </Button>
        <ToggleButtonGroup
          exclusive
          value={listDisplayType}
          onChange={(_, value) => {
            if (value !== null) {
              setListDisplaySnackbar(true);
              setListDisplayType(value);
            }
          }}
          aria-label="text formatting"
        >
          <ToggleButton value="recipes">
            <Icon>menu_book</Icon>
          </ToggleButton>
          <ToggleButton value="ingredients">
            <Icon>list</Icon>
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {listDisplayType === "recipes" ? (
        <List dense>
          {[
            ...sortedRecies,
            {
              id: "others",
              name: t("list.withoutRecipes"),
              ingredients: ingredients.map((i) => ({
                ingredient: i.ingredient.id,
                quantity: i.quantityDescription,
              })),
            },
          ].map((recipe) => {
            return (
              <>
                <ListSubheader
                  disableGutters
                  disableSticky
                  color="primary"
                  key={`recipe-${recipe.id}`}
                >
                  {recipe.name}
                </ListSubheader>
                {recipe.ingredients.map((ingredient) => {
                  const thisItemPrices =
                    ingredientsPrices[ingredient.ingredient];
                  const thisIngredient = dataIngredients.find(
                    (i) => ingredient.ingredient === i.id
                  );

                  const anotherRecipesThatUsesThisIngredient = recipes.filter(
                    (r) =>
                      r.id !== recipe.id &&
                      r.ingredients.some(
                        (i) => i.ingredient === ingredient.ingredient
                      )
                  );

                  const anotherRecipesTexts =
                    anotherRecipesThatUsesThisIngredient.map((recipe) => {
                      const quantity = recipe.ingredients.find(
                        (i) => i.ingredient === ingredient.ingredient
                      )?.quantity;
                      if (!quantity) {
                        return t("list.ingredientFor", { name: recipe.name });
                      }
                      return t("list.quantityForRecipe", {
                        quantity,
                        recipe: recipe.name,
                      });
                    });
                  return (
                    <ListItem
                      disableGutters
                      key={`item-${recipe.id}-${ingredient.ingredient}`}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={
                            checkedIngredients.indexOf(ingredient.ingredient) >
                            -1
                          }
                          tabIndex={-1}
                          disableRipple
                          onChange={async (e) => {
                            if (!thisIngredient) {
                              return;
                            }
                            if (e.currentTarget.checked) {
                              setSearchParams({
                                editingIngredientId: thisIngredient.id,
                              });

                              if (!groupId) {
                                throw new Error("missing groupId");
                              }
                              await updateGroup(
                                groupId,
                                "checkedIngredients",
                                arrayUnion(ingredient.ingredient)
                              );
                            } else {
                              if (!groupId) {
                                throw new Error("missing groupId");
                              }
                              await updateGroup(
                                groupId,
                                "checkedIngredients",
                                arrayRemove(ingredient.ingredient)
                              );
                            }
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${ingredient.quantity} ${
                          dataIngredients.find(
                            (i) => i.id === ingredient.ingredient
                          )?.name
                        }`}
                        secondary={
                          !anotherRecipesThatUsesThisIngredient.length
                            ? undefined
                            : t("list.alsoNeededFor", {
                                recipes: anotherRecipesTexts.join(", "),
                              })
                        }
                        sx={{
                          flex: 1,
                        }}
                      />
                      <Box sx={{ textAlign: "right" }}>
                        {!thisItemPrices ||
                        checkedIngredients.indexOf(ingredient.ingredient) ===
                          -1 ? null : (
                          <Stack
                            onClick={() => {
                              if (!thisIngredient) {
                                return;
                              }
                              setSearchParams({
                                editingIngredientId: thisIngredient.id,
                              });
                            }}
                            sx={{ marginLeft: 3, marginRight: 1 }}
                          >
                            <Typography
                              variant="body1"
                              color="error"
                              fontWeight={500}
                            >
                              {t("{{value,currency}}", {
                                currency,
                                value: thisItemPrices.reduce(
                                  (prev, thisItem) =>
                                    prev + thisItem.q * thisItem.u,
                                  0
                                ),
                              })}
                            </Typography>
                            <Stack
                              direction={"row"}
                              spacing={1}
                              justifyContent={"flex-end"}
                            >
                              {thisItemPrices.map(({ q, u }) => (
                                <Typography
                                  variant="body2"
                                  color="grey.300"
                                  fontSize={10}
                                  key={`item_price_${q}_${u}`}
                                >
                                  <Trans
                                    i18nKey={
                                      "list.value.ingredient.itemPricePerUnit"
                                    }
                                    values={{
                                      quantity: q,
                                      currency,
                                      pricePerUnit: u,
                                    }}
                                    components={{
                                      small: (
                                        <Typography
                                          key={`small_${q}_${u}`}
                                          color="grey.400"
                                          component="small"
                                          fontSize="inherit"
                                        />
                                      ),
                                      strong: (
                                        <Typography
                                          key={`strong_${q}_${u}`}
                                          fontWeight="bolder"
                                          color="primary"
                                          component="strong"
                                          fontSize="inherit"
                                        />
                                      ),
                                    }}
                                  />
                                </Typography>
                              ))}
                            </Stack>
                          </Stack>
                        )}

                        {!thisItemPrices &&
                          checkedIngredients.indexOf(ingredient.ingredient) >
                            -1 && (
                            <IconButton
                              color="warning"
                              onClick={() => {
                                if (!thisIngredient) {
                                  return;
                                }

                                setSearchParams({
                                  editingIngredientId: thisIngredient.id,
                                });
                              }}
                            >
                              <Icon>edit</Icon>
                            </IconButton>
                          )}
                      </Box>
                    </ListItem>
                  );
                })}
              </>
            );
          })}
        </List>
      ) : (
        <List>
          {actualTextsToDisplays.map(({ ingredient, descriptions }) => {
            const thisItemPrices = ingredientsPrices[ingredient.id];

            return (
              <ListItem
                key={`list_ingredient_${ingredient.id}`}
                sx={{ paddingRight: 0 }}
                disableGutters
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checkedIngredients.indexOf(ingredient.id) > -1}
                    tabIndex={-1}
                    disableRipple
                    onChange={async (e) => {
                      if (e.currentTarget.checked) {
                        setSearchParams({
                          editingIngredientId: ingredient.id,
                        });
                        if (!groupId) {
                          throw new Error("missing groupId");
                        }
                        await updateGroup(
                          groupId,
                          "checkedIngredients",
                          arrayUnion(ingredient.id)
                        );
                      } else {
                        if (!groupId) {
                          throw new Error("missing groupId");
                        }
                        await updateGroup(
                          groupId,
                          "checkedIngredients",
                          arrayRemove(ingredient.id)
                        );
                      }
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={ingredient.name}
                  secondary={descriptions.join(", ")}
                  sx={{ flex: 1 }}
                />
                <Box sx={{ textAlign: "right" }}>
                  {!thisItemPrices ||
                  checkedIngredients.indexOf(ingredient.id) === -1 ? null : (
                    <Stack
                      onClick={() =>
                        setSearchParams({
                          editingIngredientId: ingredient.id,
                        })
                      }
                      sx={{ marginLeft: 3, marginRight: 1 }}
                    >
                      <Typography
                        variant="body1"
                        color="error"
                        fontWeight={500}
                      >
                        {t("{{value,currency}}", {
                          currency,
                          value: thisItemPrices.reduce(
                            (prev, thisItem) => prev + thisItem.q * thisItem.u,
                            0
                          ),
                        })}
                      </Typography>
                      <Stack
                        direction={"row"}
                        spacing={1}
                        justifyContent={"flex-end"}
                      >
                        {thisItemPrices.map(({ q, u }) => (
                          <Typography
                            variant="body2"
                            color="grey.300"
                            fontSize={10}
                            key={`item_price_${q}_${u}`}
                          >
                            <Trans
                              i18nKey={"list.value.ingredient.itemPricePerUnit"}
                              values={{
                                quantity: q,
                                currency,
                                pricePerUnit: u,
                              }}
                              components={{
                                small: (
                                  <Typography
                                    key={`small_${q}_${u}`}
                                    color="grey.400"
                                    component="small"
                                    fontSize="inherit"
                                  />
                                ),
                                strong: (
                                  <Typography
                                    key={`strong_${q}_${u}`}
                                    fontWeight="bolder"
                                    color="primary"
                                    component="strong"
                                    fontSize="inherit"
                                  />
                                ),
                              }}
                            />
                          </Typography>
                        ))}
                      </Stack>
                    </Stack>
                  )}

                  {!thisItemPrices &&
                    checkedIngredients.indexOf(ingredient.id) > -1 && (
                      <IconButton
                        color="warning"
                        onClick={() =>
                          setSearchParams({
                            editingIngredientId: ingredient.id,
                          })
                        }
                      >
                        <Icon>edit</Icon>
                      </IconButton>
                    )}
                </Box>
              </ListItem>
            );
          })}
        </List>
      )}
      <Dialog fullScreen open={modalOpen} sx={{ zIndex: 999999 }}>
        {editingIngredient && (
          <IngredientPriceForm
            ingredient={editingIngredient}
            onClose={() => setSearchParams({ editingIngredientId: "" })}
            onSubmitWithoutPrice={() => {
              if (!groupId) {
                throw new Error("missing groupId");
              }
              updateGroup(
                groupId,
                `ingredientsPrices.${editingIngredient.id}`,
                deleteField()
              );
              setSearchParams({ editingIngredientId: "" });
            }}
            data={(
              ingredientsPrices[editingIngredient.id] || [{ q: 1, u: 0 }]
            ).map(({ q, u }) => ({
              quantity: String(q),
              unitPrice: String(u),
            }))}
            onSubmit={(data) => {
              if (!groupId) {
                throw new Error("missing groupId");
              }
              updateGroup(
                groupId,
                `ingredientsPrices.${editingIngredient.id}`,
                data
              );
              setSearchParams({ editingIngredientId: "" });
            }}
          />
        )}
      </Dialog>
      <Dialog fullWidth open={modalFilterIsOpen}>
        <DialogTitle>{t("list.filtersAndOrder")}</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={filters.showCheckedsFirst}
                onChange={(e) => {
                  if (!groupId) {
                    throw new Error("missing groupId");
                  }
                  updateGroup(
                    groupId,
                    "filters.showCheckedsFirst",
                    e.target.checked
                  );
                }}
                size="small"
              />
            }
            label={t("actions.list.showCheckedsFirst")}
          />
        </DialogContent>
        <DialogActions sx={{ paddingBottom: "25px" }}>
          <Button
            fullWidth
            onClick={() => setSearchParams({ filterModal: "closed" })}
            variant="contained"
          >
            {t("common.ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const IngredientsListFromRecipes = memo(IngredientsListFromRecipesBase);
