import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../usersApi";

export const useUsers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
};
