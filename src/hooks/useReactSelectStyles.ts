import { useTheme } from "@mui/material";
import { StylesConfig } from "react-select";

export const useReactSelectStyles = <T>() => {
  const theme = useTheme();

  const styles: StylesConfig<T> = {
    indicatorSeparator: (base) => {
      return {
        ...base,
        backgroundColor: theme.palette.grey[700],
      };
    },
    dropdownIndicator: (base) => {
      return {
        ...base,
        width: 75,
        justifyContent: "center",
      };
    },
    container: (base) => {
      return { ...base, marginTop: "10px" };
    },
    valueContainer: (base) => {
      return {
        ...base,
        maxHeight: "175px",
        overflowY: "auto",
        paddingLeft: 2,
      };
    },
    placeholder: (teste) => {
      return {
        ...teste,
        paddingLeft: 8,
        paddingRight: 8,
      };
    },
    multiValue: (base) => {
      return {
        ...base,
        background: "transparent",
      };
    },
    multiValueRemove: (base) => {
      return {
        ...base,
        background: theme.palette.grey[800],
        border: "none",
        borderRadius: 4,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        paddingLeft: 4,
        paddingRight: 6,
      };
    },
    multiValueLabel: (base) => {
      return {
        ...base,
        color: theme.palette.grey[100],
        border: "2px solid",
        borderColor: theme.palette.grey[800],
        borderRadius: 4,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      };
    },
    input: (base) => {
      return {
        ...base,
        color: theme.palette.grey[300],
        paddingLeft: 8,
        paddingTop: 2,
        paddingBottom: 2,
        paddingRight: 4,
        borderRadius: 4,
        border: "2px solid",
        borderColor: theme.palette.grey[800],
      };
    },
    control: (control) => {
      return {
        ...control,
        background: "transparent",
        borderColor: theme.palette.grey[600],
      };
    },
    menuPortal: (base) => {
      return {
        ...base,
        zIndex: 999999,
      };
    },
    menu: (menu) => {
      return {
        ...menu,
        background: theme.palette.grey[900],
      };
    },
    option: (option, a) => {
      return {
        ...option,
        background: a.isFocused
          ? theme.palette.primary.dark
          : theme.palette.grey[900],
      };
    },
  };
  return styles;
};
