import apiClient from "./apiClient";
import type { CreateProjectRequest, ProjectResponse } from "./types";

export const projectsApi = {
  createProject: async (
    data: CreateProjectRequest
  ): Promise<ProjectResponse> => {
    const response = await apiClient.post<ProjectResponse>("/projects", data);
    return response.data;
  },
};
