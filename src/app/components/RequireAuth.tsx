import { useAtom } from "@reatom/npm-react";
import { Navigate } from "react-router-dom";
import { isRegisteredAtom } from "../../model/user";
import { URLS } from "../router/urls";
import type { JSX } from "react";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const [isRegistered] = useAtom(isRegisteredAtom);

  if (!isRegistered) {
    return <Navigate to={URLS.LOGIN} replace />;
  }

  return children;
};

export const RequireGuest = ({ children }: { children: JSX.Element }) => {
  const [isRegistered] = useAtom(isRegisteredAtom);

  if (isRegistered) {
    return <Navigate to={URLS.DASHBOARD} replace />;
  }

  return children;
};
