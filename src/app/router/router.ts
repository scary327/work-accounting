import { createBrowserRouter } from "react-router-dom";
import { AuthRoutes, PublicRoutes, RootRoute } from "./routes";

export const router = createBrowserRouter([
  RootRoute,
  ...AuthRoutes,
  ...PublicRoutes,
]);
