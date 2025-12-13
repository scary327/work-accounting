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

export interface ProjectDetailsResponse {
  id: number;
  title: string;
  description: string;
  techStack: string;
  status: string;
  semesterId: number;
  semesterName: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  creatorId: number;
  creatorFio: string;
  userVote: boolean | null;
  mentors: Array<{
    id: number;
    fullName: string;
  }>;
}

export interface ProjectComment {
  id: number;
  body: string;
  authorId: number;
  authorName: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface GetProjectsRequest {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface GetCommentsRequest {
  page?: number;
  size?: number;
  sort?: string[];
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

export interface TeamParticipant {
  id: number;
  fio: string;
}

export interface TeamProject {
  semesterName: string;
  title: string;
  mentors: string[];
  techStack: string;
  description: string;
  averageGrade: number;
}

export interface Team {
  id: number;
  name: string;
  participants: TeamParticipant[];
  currentProject: TeamProject | null;
  projectHistory: TeamProject[];
}

export interface Student {
  id: number;
  fio: string;
  email: string;
  about: string;
  tlgUsername: string;
  skills: string[];
  projects: TeamProject[];
}

export interface CreateParticipantRequest {
  firstName: string;
  lastName: string;
  middleName: string;
  bio: string;
  telegram: string;
}

export interface ParticipantResponse {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  bio: string;
  telegram: string;
  createdById: number;
  createdByName: string;
}

export interface CreateTeamRequest {
  name: string;
  description: string;
  participantIds: number[];
}

export interface UpdateTeamRequest {
  name: string;
  description: string;
}

export interface TeamResponse {
  id: number;
  name: string;
  description: string;
  createdById: number;
  createdByName: string;
  createdAt: string;
  participants: ParticipantResponse[];
  currentProjectId: number;
  currentProjectTitle: string;
  projectHistory: ProjectHistoryItem[];
}

export interface AssignProjectRequest {
  projectId: number;
}

export interface GradeTeamRequest {
  score: number;
  feedback: string;
  comment: string;
}
