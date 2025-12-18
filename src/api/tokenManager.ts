import Cookies from "js-cookie";
import type { AuthTokens } from "./types";

export const tokenManager = {
  setTokens: (accessToken: string, refreshToken: string): void => {
    const isSecure = window.location.protocol === "https:";
    Cookies.set("accessToken", accessToken, {
      secure: isSecure,
      sameSite: "strict",
    });
    Cookies.set("refreshToken", refreshToken, {
      secure: isSecure,
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
