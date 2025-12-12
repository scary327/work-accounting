import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { semestersApi } from "../semestersApi";
import type { CreateSemesterRequest } from "../types";

const SEMESTERS_QUERY_KEY = ["semesters"];

export const useSemesters = () => {
  return useQuery({
    queryKey: SEMESTERS_QUERY_KEY,
    queryFn: () => semestersApi.getSemesters(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSemesterRequest) =>
      semestersApi.createSemester(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SEMESTERS_QUERY_KEY });
    },
  });
};

export const useActivateSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => semestersApi.activateSemester(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SEMESTERS_QUERY_KEY });
    },
  });
};

export const useDeleteSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => semestersApi.deleteSemester(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SEMESTERS_QUERY_KEY });
    },
  });
};

export const useUpdateSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateSemesterRequest }) =>
      semestersApi.updateSemester(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SEMESTERS_QUERY_KEY });
    },
  });
};
