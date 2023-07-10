import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDataContext } from "../context/DataContext";

export const useMonetaryInputState = (defaultValue = 0) => {
  const [value, setValue] = useState(defaultValue);
  const {
    i18n: { language },
  } = useTranslation();

  const { currency } = useDataContext();

  const formater = new Intl.NumberFormat([language], {
    currency,
    style: "currency",
  });

  const formatedValue = formater.format(value);

  const onChange = (stringNumber: string) => {
    setValue(parseFloat(stringNumber));
  };
  return [value, formatedValue, onChange, setValue] as [
    typeof value,
    typeof formatedValue,
    typeof onChange,
    typeof setValue
  ];
};
