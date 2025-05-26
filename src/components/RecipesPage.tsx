import {
  Box,
  Button,
  Dialog,
  Fab,
  Icon,
  IconButton,
  Typography,
} from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDataContext } from "../context/DataContext";
import { useTranslation } from "react-i18next";
import { RecipesList } from "./RecipesList";
import { useAppStateContext } from "../context/AppStateContext";
import type { IRecipe } from "../interfaces/IRecipe";
import { useGroup } from "../hooks/useGroup";
import { updateGroup } from "../services/api/groups";
import { RecipeInputDisplay } from "./RecipeInputDisplay";
import { FullScreenSpinner } from "./FullScreenSpinner";
import { GroupNameSubHeader } from "./GroupNameSubHeader";
import {
  generatePath,
  useMatch,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const RecipesPageBase = () => {
  const { listRecipes } = useDataContext();
  const [selectedRecipes, setSelectedRecipes] = useState(listRecipes);
  const [processing, setProcessing] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Partial<IRecipe>>({});
  const { t } = useTranslation();

  const isEditingRecipe = useMatch("recipes/edit/:id");
  const isCreatingRecipe = useMatch("recipes/new");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const open = useMemo(() => {
    return Boolean(Object.keys(recipeToEdit).length);
  }, [recipeToEdit]);

  const handleCloseEditModal = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const { id: groupId } = useGroup();

  const handleOnSaveClick = useCallback(async () => {
    setProcessing(true);
    if (!groupId) {
      throw new Error("missing groupId");
    }
    await updateGroup(groupId, "currentRecipes", selectedRecipes);
    setEnableSelection(false);
    setProcessing(false);
  }, [groupId, selectedRecipes]);

  const {
    setTitle,
    clearState,
    setAction,
    setColor,
    setDisableMenu,
    setDisableBottomNavigation,
    disableBottomNavigation,
    setBackButton,
  } = useAppStateContext();

  const { recipes } = useDataContext();

  const [enableSelection, setEnableSelection] = useState(false);

  useEffect(() => {
    if (isCreatingRecipe) {
      setRecipeToEdit({ id: "" });
      return;
    }

    if (isEditingRecipe) {
      setRecipeToEdit(
        recipes.find((i) => i.id === isEditingRecipe.params.id) || {}
      );
      return;
    }

    setRecipeToEdit({});
  }, [isEditingRecipe, recipes, isCreatingRecipe]);

  useEffect(() => {
    setTitle(t("common.recipe", { count: Number.POSITIVE_INFINITY }));
    return () => {
      clearState();
    };
  }, [t, setTitle, clearState, setAction]);

  useEffect(() => {
    setColor(enableSelection ? "secondary" : "default");
    setDisableMenu(enableSelection);
    setDisableBottomNavigation(enableSelection);
    setBackButton(
      !enableSelection ? null : (
        <IconButton
          color="inherit"
          onClick={() => setSearchParams({ selectable: "false" })}
          edge="start"
          sx={{ mr: 2 }}
        >
          <Icon>arrow_back</Icon>
        </IconButton>
      )
    );
  }, [
    setColor,
    enableSelection,
    setDisableMenu,
    setDisableBottomNavigation,
    setBackButton,
    setSearchParams,
  ]);

  useEffect(() => {
    setAction(
      enableSelection ? null : (
        <Button
          color="inherit"
          onClick={() => {
            setSearchParams({ selectable: "true" });
          }}
        >
          {t("actions.recipe.selectRecipes")}
        </Button>
      )
    );
  }, [setAction, enableSelection, t, setColor, setSearchParams]);

  useEffect(() => {
    if (enableSelection) {
      setTitle(t("common.recipesCount", { count: selectedRecipes.length }));
    } else {
      setTitle(t("common.recipe", { count: Number.POSITIVE_INFINITY }));
    }
  }, [setTitle, enableSelection, selectedRecipes, t]);

  useEffect(() => {
    if (!enableSelection) {
      setSelectedRecipes(listRecipes);
    }
  }, [listRecipes, enableSelection]);

  useEffect(() => {
    if (searchParams.get("selectable") === "true") {
      setEnableSelection(true);
    } else {
      setEnableSelection(false);
    }
  }, [searchParams]);

  return (
    <>
      <Typography variant="h4">
        {t("common.recipe", { count: Number.POSITIVE_INFINITY })}
      </Typography>
      <GroupNameSubHeader />
      <Box sx={{ paddingBottom: "75px" }}>
        <RecipesList
          enableSelection={enableSelection}
          onEditClick={(recipe) =>
            navigate(generatePath("edit/:id", { id: recipe.id }))
          }
          checkeds={selectedRecipes}
          onChangeCheckeds={setSelectedRecipes}
          showIsInList
        />
      </Box>
      <Dialog fullScreen open={open}>
        <RecipeInputDisplay
          data={recipeToEdit}
          onCancel={handleCloseEditModal}
          onDelete={handleCloseEditModal}
          onSave={handleCloseEditModal}
        />
      </Dialog>

      {enableSelection ? (
        <Fab
          variant="extended"
          color="secondary"
          onClick={handleOnSaveClick}
          sx={{
            position: "fixed",
            bottom: disableBottomNavigation ? "25px" : "100px",

            right: "2rem",
          }}
        >
          <Icon sx={{ mr: 1 }}>save</Icon>
          {t("actions.save")}
        </Fab>
      ) : (
        <Fab
          variant="extended"
          color="default"
          onClick={() => navigate("new")}
          sx={{
            position: "fixed",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Icon sx={{ mr: 1 }}>add</Icon>
          {t("actions.recipe.new")}
        </Fab>
      )}

      {processing && <FullScreenSpinner />}
    </>
  );
};

export const RecipesPage = memo(RecipesPageBase);
