import { memo, useEffect, useMemo, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { useDataContext } from "../context/DataContext";
import { useReactSelectStyles } from "../hooks/useReactSelectStyles";
import { useCreate } from "../hooks/useCreate";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGroup } from "../hooks/useGroup";
import { IIngredient } from "../interfaces/IIngredient";
import { editOrCreateIngredient } from "../services/api/ingredients";

interface Props {
  value: string[];
  onChange: (newValue: string[]) => void;
}
const IngredientsSelectBase = ({ value: ingredients, onChange }: Props) => {
  const { ingredients: dataIngredients } = useDataContext();

  const { id: groupId } = useGroup();

  const [creatingIngredient, handleCreatingIngredient, createdIngredient] =
    useCreate();

  const [inputIngredients, setInputIngredients] = useState(ingredients);

  const selectStyles = useReactSelectStyles<IIngredient>();

  const actualValue = useMemo(() => {
    return dataIngredients.filter(({ id }) => inputIngredients.includes(id));
  }, [dataIngredients, inputIngredients]);

  useEffect(() => {
    if (createdIngredient) {
      setInputIngredients((currentValue) => {
        return [...currentValue, createdIngredient.id];
      });
    }
  }, [createdIngredient]);

  useEffect(() => {
    onChange(inputIngredients);
  }, [inputIngredients, onChange]);

  useEffect(() => {
    setInputIngredients(ingredients);
  }, [ingredients]);

  const { t } = useTranslation();

  return (
    <>
      <Typography variant="body2" sx={{ marginTop: 2 }} color={"grey.500"}>
        {t("common.ingredient", { count: Number.POSITIVE_INFINITY })}
      </Typography>
      <CreatableSelect<IIngredient, true>
        value={actualValue}
        onChange={(value) => setInputIngredients(value.map(({ id }) => id))}
        placeholder={t("common.ingredient", {
          count: Number.POSITIVE_INFINITY,
        })}
        openMenuOnFocus
        blurInputOnSelect={false}
        menuPosition="fixed"
        menuPortalTarget={document.getElementsByTagName("body")[0]}
        isMulti
        options={dataIngredients || []}
        getOptionLabel={(
          option: IIngredient | { __isNew__: boolean; value: string }
        ) => {
          if (option.hasOwnProperty("__isNew__")) {
            const creatingOption = option as {
              __isNew__: boolean;
              value: string;
            };
            if (creatingOption.__isNew__) {
              return t("actions.createOption", { name: creatingOption.value });
            }
          }
          return (option as IIngredient).name;
        }}
        getOptionValue={(option) => option.id}
        menuPlacement="top"
        closeMenuOnSelect={false}
        isClearable={false}
        isLoading={creatingIngredient}
        onCreateOption={(newName) => {
          handleCreatingIngredient(() => {
            if (!groupId) {
              throw new Error("missing groupId");
            }
            return editOrCreateIngredient(groupId, { name: newName });
          });
        }}
        styles={selectStyles}
        theme={(theme) => {
          return {
            ...theme,
            colors: {
              ...theme.colors,
            },
          };
        }}
      />
    </>
  );
};

export const IngredientsSelect = memo(IngredientsSelectBase);
