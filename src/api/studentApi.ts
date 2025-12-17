import apiClient from "./apiClient";
import type {
  StudentDetailsResponse,
  CreateParticipantRequest,
  ParticipantResponse,
  GetParticipantsRequest,
  PaginatedResponse,
} from "./types";

export const studentApi = {
  getParticipants: async (
    params?: GetParticipantsRequest
  ): Promise<PaginatedResponse<ParticipantResponse>> => {
    const response = await apiClient.get<
      PaginatedResponse<ParticipantResponse>
    >("/participants", { params });
    return response.data;
  },

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
      "/participants",
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
