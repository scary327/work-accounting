import apiClient from "./apiClient";
import type {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  TeamResponse,
  AssignProjectRequest,
  GradeTeamRequest,
  GetTeamsRequest,
  PaginatedResponse,
  GetGradesResponse,
} from "./types";

export const teamsApi = {
  getTeams: async (
    params?: GetTeamsRequest
  ): Promise<PaginatedResponse<Team>> => {
    const response = await apiClient.get<PaginatedResponse<Team>>("/teams", {
      params,
    });
    return response.data;
  },

  createTeam: async (data: CreateTeamRequest): Promise<TeamResponse> => {
    const response = await apiClient.post<TeamResponse>("/teams", data);
    return response.data;
  },

  updateTeam: async (
    id: number | string,
    data: UpdateTeamRequest
  ): Promise<TeamResponse> => {
    const response = await apiClient.put<TeamResponse>(`/teams/${id}`, data);
    return response.data;
  },

  deleteTeam: async (id: number | string): Promise<void> => {
    await apiClient.delete(`/teams/${id}`);
  },

  assignProject: async (
    id: number | string,
    data: AssignProjectRequest
  ): Promise<void> => {
    await apiClient.post(`/teams/${id}/project`, data);
  },

  addParticipant: async (
    teamId: number | string,
    participantId: number | string
  ): Promise<void> => {
    await apiClient.post(`/teams/${teamId}/participants/${participantId}`);
  },

  removeParticipant: async (
    teamId: number | string,
    participantId: number | string
  ): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/participants/${participantId}`);
  },

  gradeTeam: async (
    id: number | string,
    data: GradeTeamRequest
  ): Promise<void> => {
    await apiClient.post(`/teams/${id}/grade`, data);
  },

  deleteGrade: async (
    teamId: number | string,
    evaluationId: number | string
  ): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/grades/${evaluationId}`);
  },

  getGrades: async (id: number | string): Promise<GetGradesResponse> => {
    const response = await apiClient.get<GetGradesResponse>(
      `/teams/${id}/grades`
    );
    return response.data;
  },

  getProjectGrades: async (
    teamId: number | string,
    projectId: number | string
  ): Promise<GetGradesResponse> => {
    const response = await apiClient.get<GetGradesResponse>(
      `/teams/${teamId}/projects/${projectId}/grades`
    );
    return response.data;
  },

  getTeamDetails: async (id: number | string): Promise<Team> => {
    const response = await apiClient.get<Team>(`/teams/${id}`);
    return response.data;
  },
};
