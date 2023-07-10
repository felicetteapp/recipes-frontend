import { AppBar } from "@mui/material";
import {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  createContext,
  memo,
  useCallback,
  useContext,
  useState,
} from "react";

type colorProp = ComponentPropsWithoutRef<typeof AppBar>["color"];

interface AppStateContextValue {
  title: string;
  color: colorProp;
  action: null | JSX.Element;
  backButton: null | JSX.Element;
  disableMenu: boolean;
  disableBottomNavigation: boolean;
  clearState: () => void;
  setTitle: (title: string) => void;
  setColor: (color: colorProp) => void;
  setAction: (newAction: null | JSX.Element) => void;
  setBackButton: (newBackButton: null | JSX.Element) => void;
  setDisableMenu: (newState: boolean) => void;
  setDisableBottomNavigation: (newState: boolean) => void;
}

export const initialValue: AppStateContextValue = {
  title: "Felicette cooking",
  color: "default",
  action: null,
  backButton: null,
  disableMenu: false,
  disableBottomNavigation: false,
  setBackButton: () => {},
  clearState: () => {},
  setTitle: () => {},
  setColor: () => {},
  setAction: () => {},
  setDisableMenu: () => {},
  setDisableBottomNavigation: () => {},
};

export const AppStateContext =
  createContext<AppStateContextValue>(initialValue);

const AppStateContextProviderBase = ({ children }: PropsWithChildren) => {
  const [title, setTitle] = useState(initialValue.title);
  const [color, setColor] = useState<colorProp>(initialValue.color);
  const [action, setAction] = useState<null | JSX.Element>(initialValue.action);
  const [disableMenu, setDisableMenu] = useState(initialValue.disableMenu);
  const [disableBottomNavigation, setDisableBottomNavigation] = useState(
    initialValue.disableBottomNavigation
  );
  const [backButton, setBackButton] = useState<null | JSX.Element>(
    initialValue.backButton
  );

  const clearState = useCallback(() => {
    setTitle(initialValue.title);
    setColor(initialValue.color);
    setAction(initialValue.action);
    setDisableMenu(initialValue.disableMenu);
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        disableMenu,
        setDisableMenu,
        title,
        setTitle,
        color,
        setColor,
        action,
        setAction,
        clearState,
        disableBottomNavigation,
        setDisableBottomNavigation,
        backButton,
        setBackButton,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const AppStateContextProvider = memo(AppStateContextProviderBase);

export const useAppStateContext = () => useContext(AppStateContext);
