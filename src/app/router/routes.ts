import React, { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { URLS } from "./urls";
import { Login, Registration } from "../../page/Auth";
import { RequireAuth, RequireGuest } from "../components/RequireAuth";
import { ErrorBoundary } from "../components/ErrorBoundary";

const Dashboard = lazy(() =>
  import("../../page/Dashboard/Dashboard").then((module) => ({
    default: module.Dashboard,
  }))
);

const Archive = lazy(() =>
  import("../../page/Archive/Archive").then((module) => ({
    default: module.Archive,
  }))
);

const CasesSelection = lazy(() =>
  import("../../page/CasesSelection/CasesSelection").then((module) => ({
    default: module.CasesSelection,
  }))
);

const Team = lazy(() =>
  import("../../page/Team/Team").then((module) => ({
    default: module.Team,
  }))
);

const Student = lazy(() =>
  import("../../page/Student/Student").then((module) => ({
    default: module.Student,
  }))
);

export const AuthRoutes: RouteObject[] = [
  {
    path: URLS.LOGIN,
    element: React.createElement(RequireGuest, {
      children: React.createElement(Login),
    }),
    errorElement: React.createElement(ErrorBoundary),
  },
  {
    path: URLS.REGISTRATION,
    element: React.createElement(RequireGuest, {
      children: React.createElement(Registration),
    }),
    errorElement: React.createElement(ErrorBoundary),
  },
];

export const PublicRoutes: RouteObject[] = [
  {
    path: URLS.DASHBOARD,
    element: React.createElement(RequireAuth, {
      children: React.createElement(Dashboard),
    }),
  },
  {
    path: URLS.CASES_SELECTION,
    element: React.createElement(RequireAuth, {
      children: React.createElement(CasesSelection),
    }),
  },
  {
    path: URLS.TEAM,
    element: React.createElement(RequireAuth, {
      children: React.createElement(Team),
    }),
  },
  {
    path: URLS.ARCHIVE,
    element: React.createElement(RequireAuth, {
      children: React.createElement(Archive),
    }),
  },
  {
    path: URLS.STUDENT,
    element: React.createElement(RequireAuth, {
      children: React.createElement(Student),
    }),
  },
];

export const RootRoute: RouteObject = {
  path: "/",
  element: React.createElement(Navigate, { to: URLS.DASHBOARD, replace: true }),
};
