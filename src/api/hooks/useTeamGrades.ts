import { useState, useCallback } from "react";
import { teamsApi } from "../teamsApi";
import type { Grade } from "../types";

export const useTeamGrades = () => {
  const [gradesCache, setGradesCache] = useState<Record<string, Grade[]>>({});
  const [loadingTeams, setLoadingTeams] = useState<Set<string>>(new Set());
  const [errorTeams, setErrorTeams] = useState<Set<string>>(new Set());

  const loadGrades = useCallback(
    async (teamId: string | number, projectId: string | number) => {
      const cacheKey = `${teamId}_${projectId}`;

      // Если уже загружено, ничего не делаем
      if (gradesCache[cacheKey]) {
        return gradesCache[cacheKey];
      }

      // Если уже загружается, ничего не делаем
      if (loadingTeams.has(cacheKey)) {
        return undefined;
      }

      setLoadingTeams((prev) => new Set([...prev, cacheKey]));
      setErrorTeams((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cacheKey);
        return newSet;
      });

      try {
        const grades = await teamsApi.getProjectGrades(teamId, projectId);
        setGradesCache((prev) => ({
          ...prev,
          [cacheKey]: grades,
        }));
        return grades;
      } catch (error) {
        console.error(
          `Failed to load grades for team ${teamId}, project ${projectId}:`,
          error
        );
        setErrorTeams((prev) => new Set([...prev, cacheKey]));
        return undefined;
      } finally {
        setLoadingTeams((prev) => {
          const newSet = new Set(prev);
          newSet.delete(cacheKey);
          return newSet;
        });
      }
    },
    [gradesCache, loadingTeams]
  );

  const isLoading = useCallback(
    (teamId: string | number, projectId: string | number) =>
      loadingTeams.has(`${teamId}_${projectId}`),
    [loadingTeams]
  );

  const hasError = useCallback(
    (teamId: string | number, projectId: string | number) =>
      errorTeams.has(`${teamId}_${projectId}`),
    [errorTeams]
  );

  const getGrades = useCallback(
    (teamId: string | number, projectId: string | number) =>
      gradesCache[`${teamId}_${projectId}`],
    [gradesCache]
  );

  return {
    loadGrades,
    isLoading,
    hasError,
    getGrades,
  };
};
