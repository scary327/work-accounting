import type { AuthTokens } from "./types";

export const tokenManager = {
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  getTokens: (): AuthTokens => {
    return {
      accessToken: localStorage.getItem("accessToken") || "",
      refreshToken: localStorage.getItem("refreshToken") || "",
    };
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem("refreshToken");
  },

  clearTokens: (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
