import React from "react";
import type { RouteObject } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { URLS } from "./urls";

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
    element: createPageWithLayout(
      React.createElement("div", null, "Dashboard Page")
    ),
  },
  {
    path: URLS.CASES_SELECTION,
    element: createPageWithLayout(
      React.createElement("div", null, "Cases Selection Page")
    ),
  },
  {
    path: URLS.TEAM,
    element: createPageWithLayout(
      React.createElement("div", null, "Team Page")
    ),
  },
  {
    path: URLS.ARCHIVE,
    element: createPageWithLayout(
      React.createElement("div", null, "Archive Page")
    ),
  },
  {
    path: URLS.STUDENT,
    element: createPageWithLayout(
      React.createElement("div", null, "Student Page")
    ),
  },
];
