import apiClient from "./apiClient";
import type {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  RegistrationResponse,
} from "./types";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  register: async (
    data: RegistrationRequest
  ): Promise<RegistrationResponse> => {
    const response = await apiClient.post<RegistrationResponse>(
      "/registration",
      data
    );
    return response.data;
  },
};
