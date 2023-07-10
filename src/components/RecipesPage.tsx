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
import { IRecipe } from "../interfaces/IRecipe";
import { useGroup } from "../hooks/useGroup";
import { updateGroup } from "../services/api/groups";
import { RecipeInputDisplay } from "./RecipeInputDisplay";
import { FullScreenSpinner } from "./FullScreenSpinner";
import { GroupNameSubHeader } from "./GroupNameSubHeader";

const RecipesPageBase = () => {
  const { listRecipes } = useDataContext();
  const [selectedRecipes, setSelectedRecipes] = useState(listRecipes);
  const [processing, setProcessing] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Partial<IRecipe>>({});
  const { t } = useTranslation();

  const open = useMemo(() => {
    return Boolean(Object.keys(recipeToEdit).length);
  }, [recipeToEdit]);

  const handleCloseEditModal = useCallback(() => {
    setRecipeToEdit({});
  }, []);

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

  const [enableSelection, setEnableSelection] = useState(false);

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
          onClick={() => setEnableSelection(false)}
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
  ]);

  useEffect(() => {
    setAction(
      enableSelection ? null : (
        <Button
          color="inherit"
          onClick={() => setEnableSelection((currentState) => !currentState)}
        >
          {t("actions.recipe.selectRecipes")}
        </Button>
      )
    );
  }, [setAction, enableSelection, t, setColor]);

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

  return (
    <>
      <Typography variant="h4">
        {t("common.recipe", { count: Number.POSITIVE_INFINITY })}
      </Typography>
      <GroupNameSubHeader />
      <Box sx={{ paddingBottom: "75px" }}>
        <RecipesList
          enableSelection={enableSelection}
          onEditClick={setRecipeToEdit}
          checkeds={selectedRecipes}
          onChangeCheckeds={setSelectedRecipes}
          showIsInList
        />
      </Box>
      <Dialog fullScreen open={open} onClose={() => setRecipeToEdit({})}>
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
          onClick={() => setRecipeToEdit({ id: "" })}
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
