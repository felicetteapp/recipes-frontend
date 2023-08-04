import { RouteObject, useRoutes } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { LoggedRoute } from "./LoggedRoute";
import { NoLoggedRoute } from "./NoLoggedRoute";
import { LoggedRouter } from "./LoggedRouter";

export const Router = () => {
  const home = (
    <LoggedRoute>
      <LoggedRouter />
    </LoggedRoute>
  );

  const routes: RouteObject[] = [
    {
      path: "/",
      children: [
        {
          index: true,
          element: home,
        },
        {
          path: "/login",
          element: (
            <NoLoggedRoute>
              <LoginForm />
            </NoLoggedRoute>
          ),
        },
        {
          path: "/list",
          element: home,
          children: [
            {
              path: "edit",
              element: home,
            },
          ],
        },
        {
          path: "/ingredients",
          element: home,
          children: [
            {
              path: "new",
              element: home,
            },
            {
              path: "edit/:id",
              element: home,
            },
          ],
        },
        {
          path: "/recipes",
          element: home,
          children: [
            {
              path: "new",
              element: home,
            },
            {
              path: "edit/:id",
              element: home,
            },
          ],
        },
      ],
    },
  ];
  return useRoutes(routes);
};
