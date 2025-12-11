import apiClient from "./apiClient";
import type { CreateSemesterRequest, SemesterResponse } from "./types";

export const semestersApi = {
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
};
