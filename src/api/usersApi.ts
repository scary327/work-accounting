import apiClient from "./apiClient";

export interface UserDto {
  id: number;
  roles: string[];
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
}

export const usersApi = {
  getUsers: async (): Promise<UserDto[]> => {
    const response = await apiClient.get<UserDto[]>("/users");
    return response.data;
  },
};
