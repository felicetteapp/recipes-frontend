import { RouteObject, useRoutes } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { LoggedRoute } from "./LoggedRoute";
import { NoLoggedRoute } from "./NoLoggedRoute";
import { LoggedRouter } from "./LoggedRouter";

const homeElement = (
  <LoggedRoute>
    <LoggedRouter />
  </LoggedRoute>
);

const authElement = (
  <NoLoggedRoute>
    <LoginForm />
  </NoLoggedRoute>
);

export const Router = () => {
  const routes: RouteObject[] = [
    {
      path: "/",
      children: [
        {
          index: true,
          element: homeElement,
        },
        {
          path: "/login",
          element: authElement,
          children: [
            {
              path: "register",
              element: authElement,
            },
          ],
        },
        {
          path: "/list",
          element: homeElement,
          children: [
            {
              path: "edit",
              element: homeElement,
            },
          ],
        },
        {
          path: "/ingredients",
          element: homeElement,
          children: [
            {
              path: "new",
              element: homeElement,
            },
            {
              path: "edit/:id",
              element: homeElement,
            },
          ],
        },
        {
          path: "/recipes",
          element: homeElement,
          children: [
            {
              path: "new",
              element: homeElement,
            },
            {
              path: "edit/:id",
              element: homeElement,
            },
          ],
        },
      ],
    },
  ];
  return useRoutes(routes);
};
