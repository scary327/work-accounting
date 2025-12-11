import apiClient from "./apiClient";
import type { StudentDetailsResponse } from "./types";

export const studentApi = {
  getStudentDetails: async (
    id: string | number
  ): Promise<StudentDetailsResponse> => {
    const response = await apiClient.get<StudentDetailsResponse>(
      `/participants/${id}/details`
    );
    return response.data;
  },
};
