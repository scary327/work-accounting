import { useCallback, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAtom } from "@reatom/npm-react";
import { SearchBar, SemesterBlock, type ArchiveCardData } from "./components";
import { ProjectInfoModal } from "../../components/ProjectInfoModal/ProjectInfoModal";
import { useCustomSearchParams } from "../../hooks/useCustomSearchParams";
import { semestersApi } from "../../api/semestersApi";
import { projectsApi } from "../../api/projectsApi";
import {
  useProjectComments,
  useUpdateProjectStatus,
  useVoteProject,
} from "../../api/hooks/useProjects";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationContainer } from "../../components/Notification";
import { userAtom } from "../../model/user";
import type {
  SemesterDetailsResponse,
  ProjectDetailsResponse,
} from "../../api/types";
import { GradeTeamModal } from "../Team/components/GradeTeamModal";
import { GradesListModal } from "../Team/components/GradesListModal";
import styles from "./Archive.module.css";

/**
 * Archive component - страница архива кейсов
 * Отображает архивированные кейсы по семестрам с поиском и фильтрацией
 */
export const Archive = () => {
  const { getParam, setParam } = useCustomSearchParams();
  const [semestersData, setSemestersData] = useState<SemesterDetailsResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedProjectDetails, setSelectedProjectDetails] =
    useState<ProjectDetailsResponse | null>(null);

  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [selectedTeamIdForGrade, setSelectedTeamIdForGrade] = useState<
    string | null
  >(null);

  const [isGradesListOpen, setIsGradesListOpen] = useState(false);
  const [selectedTeamIdForGradesList, setSelectedTeamIdForGradesList] =
    useState<string | null>(null);

  const [user] = useAtom(userAtom);
  const { notifications, addNotification, removeNotification } =
    useNotifications();
  const updateStatusMutation = useUpdateProjectStatus();
  const voteProjectMutation = useVoteProject();

  const searchValue = getParam("query") || "";
  const filterValue = getParam("statuses") || "all";

  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchValue !== searchValue) {
        setParam("query", localSearchValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchValue, searchValue, setParam]);

  const fetchSemesters = useCallback(async () => {
    setIsLoading(true);
    try {
      const statuses =
        filterValue === "all"
          ? [
              "VOTING",
              "APPROVED",
              "ARCHIVED_CANCELED",
              "ARCHIVED_COMPLETED",
              "IN_PROGRESS",
            ]
          : [filterValue];

      const data = await semestersApi.getSemestersDetails({
        query: searchValue,
        statuses: statuses,
        page: 0,
        size: 100,
      });
      setSemestersData(data.content);
    } catch (error) {
      console.error("Failed to fetch archive data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchValue, filterValue]);

  useEffect(() => {
    fetchSemesters();
  }, [fetchSemesters]);

  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value);
  };

  const handleFilterChange = (value: string) => {
    setParam("statuses", value);
  };

  const { data: comments = [] } = useProjectComments(
    parseInt(selectedCardId || "0"),
    {
      page: 0,
      size: 50,
    }
  );

  const selectedProjectFromList = useMemo(() => {
    if (!selectedCardId) return null;
    for (const semester of semestersData) {
      const project = semester.projects.find(
        (p) => p.id.toString() === selectedCardId
      );
      if (project) return project;
    }
    return null;
  }, [selectedCardId, semestersData]);

  // Обработчики
  const handleViewCard = useCallback(async (cardId: string) => {
    setSelectedCardId(cardId);
    try {
      const details = await projectsApi.getProjectById(parseInt(cardId));
      setSelectedProjectDetails(details);
    } catch (error) {
      console.error("Failed to fetch project details:", error);
    }
  }, []);

  const handleNominateCard = useCallback((cardTitle: string) => {
    alert(
      `Кейс "${cardTitle}" выдвинут на новый семестр и появится в разделе "Отбор кейсов"`
    );
  }, []);

  const handleStatusChange = useCallback(
    async (caseId: string, status: string) => {
      const numId = parseInt(caseId, 10);
      try {
        await updateStatusMutation.mutateAsync({ id: numId, status });
        addNotification("Статус проекта обновлен", "success");
        if (selectedProjectDetails) {
          setSelectedProjectDetails({ ...selectedProjectDetails, status });
        }
        // Refresh list
        fetchSemesters();
      } catch (error) {
        console.error("Failed to update status:", error);
        addNotification("Не удалось обновить статус", "error");
      }
    },
    [
      updateStatusMutation,
      addNotification,
      selectedProjectDetails,
      fetchSemesters,
    ]
  );

  const handleDeleteProject = useCallback(
    async (caseId: string) => {
      try {
        await projectsApi.deleteProject(parseInt(caseId));
        addNotification("Проект успешно удален", "success");
        setSelectedCardId(null);
        setSelectedProjectDetails(null);
        fetchSemesters();
      } catch (error) {
        console.error("Failed to delete project:", error);
        addNotification("Не удалось удалить проект", "error");
      }
    },
    [addNotification, fetchSemesters]
  );

  const handleEditProject = useCallback(
    async (
      caseId: string,
      data: {
        title: string;
        description: string;
        techStack: string;
        mentorIds: number[];
      }
    ) => {
      try {
        await projectsApi.updateProject(parseInt(caseId), {
          ...data,
          teamSize: 0, // Assuming default or preserved
        });
        addNotification("Проект успешно обновлен", "success");
        // Refresh details
        const details = await projectsApi.getProjectById(parseInt(caseId));
        setSelectedProjectDetails(details);
        fetchSemesters();
      } catch (error) {
        console.error("Failed to update project:", error);
        addNotification("Не удалось обновить проект", "error");
      }
    },
    [addNotification, fetchSemesters]
  );

  const handleGradeTeamClick = useCallback((teamId: string) => {
    setSelectedTeamIdForGrade(teamId);
    setIsGradeOpen(true);
  }, []);

  const handleViewGradesClick = useCallback((teamId: string) => {
    setSelectedTeamIdForGradesList(teamId);
    setIsGradesListOpen(true);
  }, []);

  const handleVoteUp = useCallback(
    async (caseId: string) => {
      const numId = parseInt(caseId, 10);
      try {
        await voteProjectMutation.mutateAsync({ id: numId, value: true });
        // Refresh project details
        const details = await projectsApi.getProjectById(numId);
        setSelectedProjectDetails(details);
        addNotification("Спасибо за оценку!", "success");
      } catch (error) {
        console.error("Ошибка при голосовании:", error);
        addNotification("Ошибка при голосовании", "error");
      }
    },
    [voteProjectMutation, addNotification]
  );

  const handleVoteDown = useCallback(
    async (caseId: string) => {
      const numId = parseInt(caseId, 10);
      try {
        await voteProjectMutation.mutateAsync({ id: numId, value: false });
        // Refresh project details
        const details = await projectsApi.getProjectById(numId);
        setSelectedProjectDetails(details);
        addNotification("Спасибо за оценку!", "success");
      } catch (error) {
        console.error("Ошибка при голосовании:", error);
        addNotification("Ошибка при голосовании", "error");
      }
    },
    [voteProjectMutation, addNotification]
  );

  const handleCommentSubmit = useCallback(
    async (caseId: string, commentText: string) => {
      const numId = parseInt(caseId, 10);
      try {
        await projectsApi.addComment(numId, commentText);
        // Refresh project details
        const details = await projectsApi.getProjectById(numId);
        setSelectedProjectDetails(details);
        addNotification("Комментарий добавлен!", "success");
      } catch (error) {
        console.error("Ошибка при добавлении комментария:", error);
        addNotification("Ошибка при добавлении комментария", "error");
      }
    },
    [addNotification]
  );

  return (
    <div className={styles.archive}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Архив проектов</h1>
          <SearchBar
            searchValue={localSearchValue}
            filterValue={filterValue}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {semestersData.map((semester) => {
              // Map API data to ArchiveCardData format
              const cards: ArchiveCardData[] = semester.projects.map(
                (project) => {
                  let status: ArchiveCardData["status"] = "canceled";
                  switch (project.status) {
                    case "ARCHIVED_COMPLETED":
                      status = "completed";
                      break;
                    case "ARCHIVED_CANCELED":
                      status = "canceled";
                      break;
                    case "VOTING":
                      status = "voting";
                      break;
                    case "APPROVED":
                      status = "approved";
                      break;
                    case "IN_PROGRESS":
                      status = "in_progress";
                      break;
                  }

                  return {
                    id: project.id.toString(),
                    title: project.title,
                    author: (project.curators || []).join(", "),
                    stack: project.techStack || "",
                    status: status,
                    teams: (project.teams || [])
                      .filter((t) => t && t.id) // Ensure team and ID exist
                      .map((t) => ({
                        id: t.id.toString(),
                        name: t.name || "",
                        members: t.members || [],
                        grade: t.averageRating,
                      })),
                    // Fallback using first team
                    grade: project.teams?.[0]?.averageRating || 0,
                    teamName: project.teams?.[0]?.name || "Без команды",
                    teamMembers: project.teams?.[0]?.members || [],
                  };
                }
              );

              if (cards.length === 0) return null;

              return (
                <SemesterBlock
                  key={semester.id}
                  title={semester.name}
                  cards={cards}
                  onViewCard={handleViewCard}
                  onNominateCard={handleNominateCard}
                />
              );
            })}

            {semestersData.length === 0 && (
              <motion.div
                className={styles.emptyState}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p>Кейсы не найдены</p>
              </motion.div>
            )}
          </>
        )}
      </div>

      <ProjectInfoModal
        isOpen={selectedCardId !== null}
        onClose={() => {
          setSelectedCardId(null);
          setSelectedProjectDetails(null);
        }}
        readOnly={false}
        isOwner={
          !!user &&
          !!selectedProjectDetails &&
          String(user.id) === String(selectedProjectDetails.creatorId)
        }
        onStatusChange={handleStatusChange}
        onDeleteProject={handleDeleteProject}
        onEditProject={handleEditProject}
        onGradeTeam={handleGradeTeamClick}
        onViewGrades={handleViewGradesClick}
        onVoteUp={handleVoteUp}
        onVoteDown={handleVoteDown}
        onCommentSubmit={handleCommentSubmit}
        data={
          selectedProjectDetails
            ? {
                id: selectedProjectDetails.id.toString(),
                title: selectedProjectDetails.title,
                author: selectedProjectDetails.creatorFio,
                description: selectedProjectDetails.description,
                semester: selectedProjectDetails.semesterName,
                stack: selectedProjectDetails.techStack,
                upvotes: selectedProjectDetails.likesCount,
                downvotes: selectedProjectDetails.dislikesCount,
                comments: comments.map((c) => ({
                  id: c.id.toString(),
                  author: c.authorName,
                  text: c.body,
                })),
                rawStatus: selectedProjectDetails.status,
                status: (() => {
                  switch (selectedProjectDetails.status) {
                    case "ARCHIVED_COMPLETED":
                      return "✅ Завершен";
                    case "ARCHIVED_CANCELED":
                      return "❌ Отменен";
                    case "VOTING":
                      return "🗳️ Голосование";
                    case "APPROVED":
                      return "👍 Одобрен";
                    case "IN_PROGRESS":
                      return "🚧 В работе";
                    default:
                      return selectedProjectDetails.status;
                  }
                })(),
                mentors: (selectedProjectDetails.mentors || [])
                  .map((m) => m.fio)
                  .join(", "),
                mentorsList: selectedProjectDetails.mentors || [],
                mentorIds: (selectedProjectDetails.mentors || []).map(
                  (m) => m.id
                ),
                teams: (selectedProjectFromList?.teams || [])
                  .filter((t) => t && t.id)
                  .map((t) => ({
                    id: t.id.toString(),
                    name: t.name || "",
                    members: t.members || [],
                    grade: t.averageRating,
                  })),
                teamName: selectedProjectFromList?.teams?.[0]?.name,
                teamMembers: selectedProjectFromList?.teams?.[0]?.members,
                grade: selectedProjectFromList?.teams?.[0]?.averageRating,
                userVote: selectedProjectDetails.userVote,
              }
            : undefined
        }
      />
      {selectedTeamIdForGrade && (
        <GradeTeamModal
          isOpen={isGradeOpen}
          onClose={() => setIsGradeOpen(false)}
          teamId={parseInt(selectedTeamIdForGrade)}
          onSuccess={fetchSemesters}
          addNotification={addNotification}
        />
      )}

      {selectedTeamIdForGradesList && (
        <GradesListModal
          isOpen={isGradesListOpen}
          onClose={() => setIsGradesListOpen(false)}
          teamId={parseInt(selectedTeamIdForGradesList)}
          projectId={selectedCardId ? parseInt(selectedCardId) : undefined}
          addNotification={addNotification}
        />
      )}

      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </div>
  );
};
