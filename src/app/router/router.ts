import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { AuthRoutes, PublicRoutes, RootRoute } from "./routes";
import { NotFound } from "../components/NotFound";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { MainLayout } from "../components/MainLayout";

export const router = createBrowserRouter([
  {
    element: React.createElement(MainLayout),
    errorElement: React.createElement(ErrorBoundary),
    children: [RootRoute, ...PublicRoutes],
  },
  ...AuthRoutes,
  {
    path: "*",
    element: React.createElement(NotFound),
  },
]);
