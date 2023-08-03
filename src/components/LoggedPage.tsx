import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Icon,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ListsPage } from "./ListsPage";
import { RecipesPage } from "./RecipesPage";
import { useTranslation } from "react-i18next";
import { useAppStateContext } from "../context/AppStateContext";
import { MainMenu } from "./MainMenu";
import { useLocation, useNavigate } from "react-router-dom";
import { IngredientsPage } from "./IngredientsPage";

const TABS = {
  "/ingredients": IngredientsPage,
  "/list": ListsPage,
  "/recipes": RecipesPage,
};

const LoggedPageBase = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === "/") {
      navigate("/list");
    }
  }, [navigate, pathname]);

  const parsedPathName = useMemo(() => {
    return `/${pathname.split("/")[1]}`;
  }, [pathname]);

  const Content = useMemo(() => {
    if (!TABS[parsedPathName as keyof typeof TABS]) {
      return () => <></>;
    }
    return TABS[parsedPathName as keyof typeof TABS];
  }, [parsedPathName]);

  const anchorEl = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const handleCloseMenuClick = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpenMenuClick = useCallback(() => {
    setOpen(true);
  }, []);

  const {
    title,
    action,
    color,
    disableMenu,
    disableBottomNavigation,
    backButton,
  } = useAppStateContext();

  return (
    <>
      <Container maxWidth="sm" sx={{ paddingTop: 10, paddingBottom: 10 }}>
        <Content />
      </Container>
      <AppBar
        enableColorOnDark
        color={color}
        position="fixed"
        sx={{ top: 0, bottom: 0, zIndex: 5, maxHeight: "56px" }}
      >
        <Toolbar>
          {!disableMenu && (
            <IconButton
              color="inherit"
              ref={anchorEl}
              onClick={handleOpenMenuClick}
              edge="start"
              sx={{ mr: 2 }}
            >
              <Icon>menu</Icon>
            </IconButton>
          )}
          {backButton}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {action}
        </Toolbar>
      </AppBar>

      {!disableBottomNavigation && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 4,
            paddingBottom: 4,
          }}
          elevation={2}
        >
          <BottomNavigation
            sx={{ background: "transparent" }}
            showLabels
            value={parsedPathName}
            onChange={(_, value) => {
              navigate(value);
            }}
          >
            <BottomNavigationAction
              label={t("common.recipe", { count: Number.POSITIVE_INFINITY })}
              icon={<Icon>menu_book</Icon>}
              value={"/recipes"}
            />
            <BottomNavigationAction
              label={t("common.list", { count: 1 })}
              icon={<Icon>list</Icon>}
              value={"/list"}
            />
            <BottomNavigationAction
              label={t("common.ingredient", {
                count: Number.POSITIVE_INFINITY,
              })}
              icon={<Icon>egg_alt</Icon>}
              value={"/ingredients"}
            />
          </BottomNavigation>
        </Paper>
      )}

      <MainMenu
        open={open}
        handleClose={handleCloseMenuClick}
        anchorEl={anchorEl.current}
      />
    </>
  );
};

export const LoggedPage = memo(LoggedPageBase);
