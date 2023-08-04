import { memo, useMemo, useState, useEffect } from "react";
import { useDataContext } from "../context/DataContext";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { RecipesList } from "./RecipesList";
import { useSearchParams, useNavigate } from "react-router-dom";

interface Props {
  value: Array<string>;
  onChange: (newValues: Array<string>) => void;
}

const RecipesSelectBase = ({ value, onChange }: Props) => {
  const { recipes } = useDataContext();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const labels = useMemo(() => {
    return recipes
      .filter(({ id }) => value.includes(id))
      .map(({ name }) => name)
      .join(", ");
  }, [value, recipes]);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const isRecipeSelectOpen = searchParams.get("recipeSelectOpen") === "true";
    if (isRecipeSelectOpen) {
      setDialogIsOpen(true);
    } else {
      setDialogIsOpen(false);
    }
  }, [searchParams]);

  return (
    <>
      <Card>
        <CardActionArea
          onClick={() => setSearchParams({ recipeSelectOpen: "true" })}
        >
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t("common.recipe", {
                count: Number.POSITIVE_INFINITY,
              })}
            </Typography>
            <Typography variant="body1">{labels}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Dialog open={dialogIsOpen} fullScreen>
        <DialogTitle>
          {t("common.recipesCount", { count: value.length })}
        </DialogTitle>
        <DialogContent>
          <RecipesList
            checkeds={value}
            onChangeCheckeds={onChange}
            showIsInList={false}
            enableSelection
            onEditClick={() => {}}
          />
        </DialogContent>
        <DialogActions sx={{ paddingBottom: "25px" }}>
          <Button fullWidth onClick={() => navigate(-1)} variant="contained">
            {t("common.ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const RecipesSelect = memo(RecipesSelectBase);
