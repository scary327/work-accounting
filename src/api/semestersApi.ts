import apiClient from "./apiClient";
import type { CreateSemesterRequest, SemesterResponse } from "./types";

export const semestersApi = {
  getSemesters: async (): Promise<SemesterResponse[]> => {
    const response = await apiClient.get<SemesterResponse[]>("/semesters");
    return response.data;
  },

  createSemester: async (
    data: CreateSemesterRequest
  ): Promise<SemesterResponse> => {
    const response = await apiClient.post<SemesterResponse>("/semesters", data);
    return response.data;
  },

  activateSemester: async (id: number): Promise<SemesterResponse> => {
    const response = await apiClient.post<SemesterResponse>(
      `/semesters/${id}/active`
    );
    return response.data;
  },

  deleteSemester: async (id: number): Promise<void> => {
    await apiClient.delete(`/semesters/${id}`);
  },

  updateSemester: async (
    id: number,
    data: CreateSemesterRequest
  ): Promise<SemesterResponse> => {
    const response = await apiClient.put<SemesterResponse>(
      `/semesters/${id}`,
      data
    );
    return response.data;
  },
};
