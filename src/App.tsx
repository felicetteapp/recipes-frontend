import "./App.css";
import { AuthContextProvider } from "./context/AuthContext";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import i18n from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { Router } from "./routes";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    supportedLngs: ["en", "pt", "es", "fr"],
    interpolation: {
      escapeValue: false,
    },
  });

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#92cdcf",
      contrastText: "#1c1d21",
    },
    secondary: {
      main: "#cfa7c2",
    },
    text: {
      primary: "#eeeff7",
    },
    background: {
      default: "#1c1d21",
      paper: "#1c1d21",
    },
  },
});

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AuthContextProvider>
          <Router />
        </AuthContextProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
