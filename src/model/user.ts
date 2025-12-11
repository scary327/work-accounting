import { atom } from "@reatom/framework";
import Cookies from "js-cookie";
import { User } from "../api/types";

const getUserFromCookies = (): User | null => {
  const userStr = Cookies.get("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const userAtom = atom<User | null>(getUserFromCookies(), "userAtom");

export const isRegisteredAtom = atom<boolean>(
  Cookies.get("isRegistered") === "true",
  "isRegisteredAtom"
);
