export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

// Registration types
export interface RegistrationRequest {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  middleName: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface RegistrationResponse {
  id: number;
  email: string;
  createdAt: string;
  roles: Role[];
  lastName: string;
  firstName: string;
  middleName: string;
}

// Login types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
