import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDataContext } from "../context/DataContext";
import { useCreate } from "../hooks/useCreate";
import { useDelete } from "../hooks/useDelete";
import { useTranslation } from "react-i18next";
import { useAppStateContext } from "../context/AppStateContext";
import {
  deleteIngredient,
  editOrCreateIngredient,
} from "../services/api/ingredients";
import { useGroup } from "../hooks/useGroup";
import { IIngredient } from "../interfaces/IIngredient";
import { GroupNameSubHeader } from "./GroupNameSubHeader";

const IngredientInputDisplayBase = ({
  data: { id, name },
  onClose,
}: {
  data: Partial<IIngredient>;
  onClose: () => void;
}) => {
  const [inputName, setInputName] = useState(name || "");

  const [creating, handleCreationg] = useCreate();
  const [deleting, handleDeletion] = useDelete();

  const { id: groupId } = useGroup();
  const { t } = useTranslation();

  const handleOnSaveClick = useCallback(async () => {
    if (!groupId) {
      throw new Error("missing group id");
    }
    return editOrCreateIngredient(groupId, { id, name: inputName });
  }, [groupId, id, inputName]);

  const handleOnDeleteClick = useCallback(async () => {
    if (!id || !groupId) {
      throw new Error("missing id");
    }
    return deleteIngredient(groupId, id);
  }, [groupId, id]);

  return (
    <>
      <DialogTitle>{!id ? t("actions.ingredient.new") : name}</DialogTitle>
      {creating || deleting ? (
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      ) : (
        <DialogContent>
          <TextField
            placeholder="Ingrediente"
            label="Ingrediente"
            size="small"
            variant="outlined"
            value={inputName}
            onChange={(e) => setInputName(e.currentTarget.value)}
            fullWidth
            sx={{ marginTop: 2 }}
          />
        </DialogContent>
      )}
      <DialogActions sx={{ paddingBottom: "25px" }}>
        <Button
          fullWidth
          color="inherit"
          onClick={onClose}
          startIcon={<Icon>arrow_back</Icon>}
        >
          {t("actions.cancel")}
        </Button>

        <Button
          fullWidth
          color="success"
          onClick={() => handleCreationg(handleOnSaveClick).then(onClose)}
          startIcon={<Icon>save</Icon>}
        >
          {t("actions.save")}
        </Button>
        {id && (
          <Button
            fullWidth
            color="error"
            startIcon={<Icon>delete</Icon>}
            onClick={() => {
              const doDelete = window.confirm(t("actions.deleteConfirm"));
              if (!doDelete) {
                return;
              }

              handleDeletion(handleOnDeleteClick).then(onClose);
            }}
          >
            {t("actions.delete")}
          </Button>
        )}
      </DialogActions>
    </>
  );
};

export const IngredientInputDisplay = memo(IngredientInputDisplayBase);

const IngredientsPageBase = () => {
  const { ingredients } = useDataContext();
  const [ingredientToEdit, setIngredientToEdit] = useState<
    Partial<IIngredient> | false
  >(false);
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { setTitle, clearState } = useAppStateContext();

  useEffect(() => {
    setTitle(t("common.ingredient", { count: ingredients.length }));
    return () => {
      clearState();
    };
  }, [clearState, ingredients.length, setTitle, t]);

  const ingredientsSorted = useMemo(() => {
    const list = [...ingredients];
    return list.sort((a, b) => a.name.localeCompare(b.name, language));
  }, [ingredients, language]);

  return (
    <>
      <Box sx={{ marginBottom: "75px" }}>
        <Typography variant="h4">
          {t("common.ingredient", { count: ingredients.length })}
        </Typography>
        <GroupNameSubHeader />
        <List>
          {ingredientsSorted.map((item) => (
            <ListItem key={item.id} disableGutters>
              <ListItemText primary={item.name} />
              <IconButton
                color="warning"
                sx={{ ml: 2 }}
                onClick={() => setIngredientToEdit(item)}
              >
                <Icon>edit</Icon>
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Fab
        variant="extended"
        color="default"
        onClick={() => setIngredientToEdit({ id: "" })}
        sx={{
          position: "fixed",
          bottom: "100px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Icon sx={{ mr: 1 }}>add</Icon>
        {t("actions.ingredient.new")}
      </Fab>

      <Dialog open={Boolean(ingredientToEdit)} fullScreen>
        {ingredientToEdit && (
          <IngredientInputDisplay
            data={ingredientToEdit}
            onClose={() => setIngredientToEdit(false)}
          />
        )}
      </Dialog>
    </>
  );
};

export const IngredientsPage = memo(IngredientsPageBase);
