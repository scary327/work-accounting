import apiClient from "./apiClient";
import type {
  CreateSemesterRequest,
  SemesterResponse,
  SemesterDetailsResponse,
  GetSemestersDetailsRequest,
  PaginatedResponse,
} from "./types";

export const semestersApi = {
  getSemesters: async (): Promise<SemesterResponse[]> => {
    const response = await apiClient.get<SemesterResponse[]>("/semesters");
    return response.data;
  },

  getSemestersDetails: async (
    params?: GetSemestersDetailsRequest
  ): Promise<PaginatedResponse<SemesterDetailsResponse>> => {
    const response = await apiClient.get<
      PaginatedResponse<SemesterDetailsResponse>
    >("/semesters/details", {
      params: {
        ...params,
        statuses: params?.statuses?.join(","),
      },
    });
    return response.data;
  },

  getSemesterDetails: async (id: number): Promise<SemesterDetailsResponse> => {
    const response = await apiClient.get<SemesterDetailsResponse>(
      `/semesters/${id}`
    );
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
