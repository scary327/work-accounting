import React, { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { URLS } from "./urls";
import { RequireAuth, RequireGuest } from "../components/RequireAuth";
import { ErrorBoundary } from "../components/ErrorBoundary";

const Login = lazy(() =>
  import("../../page/Auth/Login").then((module) => ({
    default: module.Login,
  }))
);

const Registration = lazy(() =>
  import("../../page/Auth/Registration").then((module) => ({
    default: module.Registration,
  }))
);

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

const Semesters = lazy(() =>
  import("../../page/Semesters/Semesters").then((module) => ({
    default: module.Semesters,
  }))
);

const TeamsList = lazy(() =>
  import("../../page/Team/TeamsList").then((module) => ({
    default: module.TeamsList,
  }))
);

const StudentsList = lazy(() =>
  import("../../page/Student/StudentsList").then((module) => ({
    default: module.StudentsList,
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
  {
    path: URLS.SEMESTERS,
    element: React.createElement(RequireAuth, {
      children: React.createElement(Semesters),
    }),
  },
  {
    path: URLS.TEAMS_LIST,
    element: React.createElement(RequireAuth, {
      children: React.createElement(TeamsList),
    }),
  },
  {
    path: URLS.STUDENTS_LIST,
    element: React.createElement(RequireAuth, {
      children: React.createElement(StudentsList),
    }),
  },
];

export const RootRoute: RouteObject = {
  path: "/",
  element: React.createElement(Navigate, { to: URLS.DASHBOARD, replace: true }),
};
