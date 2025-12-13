import apiClient from "./apiClient";
import type {
  StudentDetailsResponse,
  CreateParticipantRequest,
  ParticipantResponse,
} from "./types";

export const studentApi = {
  getStudentDetails: async (
    id: string | number
  ): Promise<StudentDetailsResponse> => {
    const response = await apiClient.get<StudentDetailsResponse>(
      `/participants/${id}/details`
    );
    return response.data;
  },

  createParticipant: async (
    data: CreateParticipantRequest
  ): Promise<ParticipantResponse> => {
    const response = await apiClient.post<ParticipantResponse>(
      "/participant",
      data
    );
    return response.data;
  },

  updateParticipant: async (
    id: string | number,
    data: CreateParticipantRequest
  ): Promise<ParticipantResponse> => {
    const response = await apiClient.put<ParticipantResponse>(
      `/participants/${id}`,
      data
    );
    return response.data;
  },

  deleteParticipant: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/participants/${id}`);
  },
};
