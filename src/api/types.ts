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
  averageGrade?: number;
}

export interface StudentDetailsResponse {
  id: number;
  fullname: string;
  bio: string;
  telegram?: string;
  currentTeam: string;
  currentTeamId?: number | null;
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
  teamSize?: number;
  mentors: Array<{
    id: number;
    fio: string;
  }>;
  teams?: Array<{
    id: number;
    name: string;
    active: boolean;
    assignedAt: string;
    unassignedAt: string | null;
    participants: Array<{
      id: number;
      fio: string;
    }>;
    averageRating: number | null;
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

export interface TeamProjectDetails {
  semesterId: number;
  semesterName: string;
  projectId: number;
  title: string;
  mentors: TeamParticipant[];
  techStack: string;
  description: string;
  averageGrade: number;
  isActive: boolean;
  assignedAt: string;
  unassignedAt: string | null;
}

export interface Grade {
  id?: number;
  score: number;
  comment?: string;
  feedback?: string;
  evaluatorId?: number;
  evaluatorName?: string;
  createdAt?: string;

  // New fields from API
  projectId?: number;
  projectTitle?: string;
  authorId?: number;
  authorName?: string;
}

export type GetGradesResponse = Grade[];

export interface Team {
  id: number;
  name: string;
  participants: TeamParticipant[];
  currentProject: TeamProjectDetails | null;
  projectHistory: TeamProjectDetails[];
}

export interface GetTeamsRequest {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface Student {
  id: number;
  fio: string;
  email: string;
  about: string;
  tlgUsername: string;
  skills: string[];
  projects: TeamProjectDetails[];
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

export interface SemesterProjectTeam {
  id: number;
  name: string;
  averageRating: number;
  members: string[];
}

export interface SemesterProject {
  id: number;
  title: string;
  status: string;
  techStack: string;
  curators: string[];
  teams: SemesterProjectTeam[];
}

export interface SemesterDetailsResponse {
  id: number;
  name: string;
  projectCount: number;
  projects: SemesterProject[];
  isActive: boolean;
}

export interface MoveProjectRequest {
  semesterId: number;
}

export interface GetSemestersDetailsRequest {
  query?: string;
  statuses?: string[];
  page?: number;
  size?: number;
  sort?: string[];
}

export interface GetParticipantsRequest {
  query?: string;
  page?: number;
  size?: number;
  sort?: string[];
}
