import Cookies from "js-cookie";
import type { AuthTokens } from "./types";

export const tokenManager = {
  setTokens: (accessToken: string, refreshToken: string): void => {
    Cookies.set("accessToken", accessToken, {
      secure: true,
      sameSite: "strict",
    });
    Cookies.set("refreshToken", refreshToken, {
      secure: true,
      sameSite: "strict",
    });
  },

  getTokens: (): AuthTokens => {
    return {
      accessToken: Cookies.get("accessToken") || "",
      refreshToken: Cookies.get("refreshToken") || "",
    };
  },

  getAccessToken: (): string | null => {
    return Cookies.get("accessToken") || null;
  },

  getRefreshToken: (): string | null => {
    return Cookies.get("refreshToken") || null;
  },

  clearTokens: (): void => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  },
};
