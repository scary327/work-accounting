import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { tokenManager } from "./tokenManager";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

class ApiClient {
  private static instance: AxiosInstance;
  private static isRefreshing = false;
  private static refreshSubscribers: Array<(token: string) => void> = [];

  static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: API_URL,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      this.setupInterceptors();
    }
    return this.instance;
  }

  private static setupInterceptors(): void {
    // Request interceptor
    this.instance!.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = tokenManager.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance!.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.instance!(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = tokenManager.getRefreshToken();
            if (!refreshToken) {
              this.logout();
              return Promise.reject(error);
            }

            const response = await axios.post<RefreshTokenResponse>(
              `${API_URL}/auth/refresh`,
              { refreshToken }
            );

            const { accessToken, refreshToken: newRefreshToken } =
              response.data;

            tokenManager.setTokens(accessToken, newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            this.refreshSubscribers.forEach((callback) =>
              callback(accessToken)
            );
            this.refreshSubscribers = [];

            return this.instance!(originalRequest);
          } catch (refreshError) {
            this.logout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    tokenManager.setTokens(accessToken, refreshToken);
  }

  static getTokens() {
    return tokenManager.getTokens();
  }

  static logout(): void {
    tokenManager.clearTokens();
    window.location.href = "/login";
  }

  static getAccessToken(): string | null {
    return tokenManager.getAccessToken();
  }
}

export default ApiClient.getInstance();
