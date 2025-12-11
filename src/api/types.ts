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

export interface ProjectHistoryItem {
  projectId: number;
  projectTitle: string;
  semesterId: number;
  semesterName: string;
  assignedAt: string;
  unassignedAt: string | null;
  isActive: boolean;
}

export interface StudentDetailsResponse {
  id: number;
  fullname: string;
  bio: string;
  currentTeam: string;
  currentProject: ProjectHistoryItem | null;
  completedProjectsCount: number;
  averageGrade: number;
  teamsCount: number;
  projectHistory: ProjectHistoryItem[];
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  techStack: string;
  teamSize: number;
  mentorIds: number[];
}

export interface ProjectResponse {
  id: number;
  title: string;
  description: string;
  techStack: string;
  status: string;
  semesterId: number;
  semesterName: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
  userVote: boolean | null;
}

// Semester types
export interface CreateSemesterRequest {
  name: string;
  startsAt: string;
  endsAt: string;
}

export interface SemesterResponse {
  id: number;
  name: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}
