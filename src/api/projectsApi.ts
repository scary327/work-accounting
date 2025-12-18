import apiClient from "./apiClient";
import type {
  CreateProjectRequest,
  ProjectResponse,
  ProjectDetailsResponse,
  ProjectComment,
  PaginatedResponse,
  GetProjectsRequest,
  GetCommentsRequest,
} from "./types";

export const projectsApi = {
  getProjects: async (
    params?: GetProjectsRequest
  ): Promise<ProjectResponse[]> => {
    const response = await apiClient.get<PaginatedResponse<ProjectResponse>>(
      "/projects",
      { params }
    );
    return response.data.content;
  },

  getProjectById: async (id: number): Promise<ProjectDetailsResponse> => {
    const response = await apiClient.get<ProjectDetailsResponse>(
      `/projects/${id}`
    );
    return response.data;
  },

  getProjectComments: async (
    id: number,
    params?: GetCommentsRequest
  ): Promise<ProjectComment[]> => {
    const response = await apiClient.get<PaginatedResponse<ProjectComment>>(
      `/projects/${id}/comments`,
      { params }
    );
    return response.data.content;
  },

  voteProject: async (
    id: number,
    value: boolean | null
  ): Promise<ProjectDetailsResponse> => {
    const response = await apiClient.post<ProjectDetailsResponse>(
      `/projects/${id}/votes`,
      {},
      { params: { value } }
    );
    return response.data;
  },

  addComment: async (id: number, body: string): Promise<ProjectComment> => {
    const response = await apiClient.post<ProjectComment>(
      `/projects/${id}/comments`,
      { body }
    );
    return response.data;
  },

  createProject: async (
    data: CreateProjectRequest
  ): Promise<ProjectResponse> => {
    const response = await apiClient.post<ProjectResponse>("/projects", data);
    return response.data;
  },

  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  moveProjectToSemester: async (
    id: number,
    semesterId: number
  ): Promise<void> => {
    await apiClient.patch(`/projects/${id}/semester`, { semesterId });
  },

  updateProjectStatus: async (
    id: number,
    status: string
  ): Promise<ProjectDetailsResponse> => {
    const response = await apiClient.patch<ProjectDetailsResponse>(
      `/projects/${id}/status`,
      {},
      { params: { status } }
    );
    return response.data;
  },
};
