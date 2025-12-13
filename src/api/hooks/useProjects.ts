import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../projectsApi";
import type { GetProjectsRequest, GetCommentsRequest } from "../types";

const PROJECTS_QUERY_KEY = ["projects"];
const PROJECT_DETAILS_QUERY_KEY = (id: number) => ["project", id];
const PROJECT_COMMENTS_QUERY_KEY = (id: number) => ["projectComments", id];

export const useProjects = (params?: GetProjectsRequest) => {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, params],
    queryFn: () => projectsApi.getProjects(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProjectById = (id: number) => {
  return useQuery({
    queryKey: PROJECT_DETAILS_QUERY_KEY(id),
    queryFn: () => projectsApi.getProjectById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: id > 0, // Only fetch if id is valid
  });
};

export const useProjectComments = (id: number, params?: GetCommentsRequest) => {
  return useQuery({
    queryKey: [...PROJECT_COMMENTS_QUERY_KEY(id), params],
    queryFn: () => projectsApi.getProjectComments(id, params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: id > 0, // Only fetch if id is valid
  });
};

export const useVoteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, value }: { id: number; value: boolean | null }) =>
      projectsApi.voteProject(id, value),
    onSuccess: (data) => {
      // Invalidate both project details and projects list
      queryClient.invalidateQueries({
        queryKey: PROJECT_DETAILS_QUERY_KEY(data.id),
      });
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: string }) =>
      projectsApi.addComment(id, body),
    onSuccess: (data, variables) => {
      // Invalidate comments for this project
      queryClient.invalidateQueries({
        queryKey: PROJECT_COMMENTS_QUERY_KEY(variables.id),
      });
    },
  });
};
