import React, { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { URLS } from "./urls";

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

const headerProps = {
  logo: "Проектный Практикум",
  navigationLinks: [
    { id: "dashboard", label: "Дашборд", href: URLS.DASHBOARD },
    { id: "cases", label: "Отбор кейсов", href: URLS.CASES_SELECTION },
    { id: "archive", label: "Архив", href: URLS.ARCHIVE },
  ],
  userInfo: { initials: "АП", name: "Александр Петров" },
};

const createPageWithLayout = (pageElement: React.ReactNode) =>
  React.createElement(Layout, { headerProps, children: pageElement });

export const PublicRoutes: RouteObject[] = [
  {
    path: URLS.DASHBOARD,
    element: createPageWithLayout(React.createElement(Dashboard)),
  },
  {
    path: URLS.CASES_SELECTION,
    element: createPageWithLayout(React.createElement(CasesSelection)),
  },
  {
    path: URLS.TEAM,
    element: createPageWithLayout(React.createElement(Team)),
  },
  {
    path: URLS.ARCHIVE,
    element: createPageWithLayout(React.createElement(Archive)),
  },
  {
    path: URLS.STUDENT,
    element: createPageWithLayout(
      React.createElement("div", null, "Student Page")
    ),
  },
];
