import { useEffect, useState } from "react";
type NonUndefined<T> = T extends undefined ? never : T;

export const usePeristentState = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>();

  useEffect(() => {
    try {
      if (value !== undefined) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {}
  }, [key, value]);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue === null && defaultValue === null) {
        setValue(storedValue as T);
        return;
      }

      if (storedValue !== null) {
        setValue(JSON.parse(storedValue));
        return;
      }

      setValue(defaultValue);
    } catch (e) {}
  }, [key, defaultValue]);

  return [value === undefined ? defaultValue : value, setValue] as [
    NonUndefined<typeof value>,
    typeof setValue
  ];
};
