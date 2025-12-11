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

// User types
export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string;
  createdAt: string;
  roles: Role[];
  lastName: string;
  firstName: string;
  middleName: string;
}

// Auth Response types (unified for login and register)
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Registration types
export interface RegistrationRequest {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  middleName: string;
}

export type RegistrationResponse = AuthResponse;

// Login types
export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = AuthResponse;
