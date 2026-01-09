import { useCallback, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "@reatom/npm-react";
import { Button } from "../../components/ui/button";
import { projectsApi } from "../../api";
import { userAtom } from "../../model/user";
import {
  useProjects,
  useProjectById,
  useProjectComments,
  useVoteProject,
  useAddComment,
  useUpdateProjectStatus,
} from "../../api/hooks/useProjects";
import { NotificationContainer } from "../../components/Notification";
import { useNotifications } from "../../hooks/useNotifications";
import {
  CasesFeed,
  CaseModal,
  CreateCaseModal,
  type CaseCardData,
  type CaseModalData,
} from "./components";
import styles from "./CasesSelection.module.css";

/**
 * CasesSelection component - страница отбора кейсов
 * Отображает ленту с доступными кейсами для выбора команд
 */
export const CasesSelection = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userVotes, setUserVotes] = useState<
    Record<number, "up" | "down" | null>
  >({});
  const [selectedModalData, setSelectedModalData] = useState<
    CaseModalData | undefined
  >();

  const [user] = useAtom(userAtom);
  const { notifications, addNotification, removeNotification } =
    useNotifications();
  const queryClient = useQueryClient();

  // Загрузка списка проектов
  const { data: projects = [] } = useProjects({
    page: 0,
    size: 50,
  });

  // Загрузка деталей выбранного проекта
  const { data: projectDetails } = useProjectById(selectedCaseId ?? 0);

  // Загрузка комментариев к выбранному проекту
  const { data: comments = [] } = useProjectComments(selectedCaseId ?? 0, {
    page: 0,
    size: 50,
  });

  // Мутации для голосования и комментариев
  const voteProjectMutation = useVoteProject();
  const addCommentMutation = useAddComment();
  const updateStatusMutation = useUpdateProjectStatus();

  // Обновление данных модалки при загрузке деталей проекта
  useEffect(() => {
    if (projectDetails) {
      setSelectedModalData({
        id: String(projectDetails.id),
        title: projectDetails.title,
        author: projectDetails.creatorFio,
        description: projectDetails.description,
        semester: projectDetails.semesterName,
        stack: projectDetails.techStack,
        teamSize: "не указано",
        upvotes: projectDetails.likesCount,
        downvotes: projectDetails.dislikesCount,
        comments: comments.map((comment) => ({
          id: String(comment.id),
          author: comment.authorName,
          text: comment.body,
        })),
        userVote: projectDetails.userVote ?? null,
        status: projectDetails.status,
        mentorIds: projectDetails.mentors?.map((m) => m.id) || [],
        mentors: projectDetails.mentors || [],
      });
    }
  }, [projectDetails, comments]);

  // Преобразование данных проектов в формат карточек
  const cases: CaseCardData[] = projects.map((project) => {
    // Получаем инициалы из деталей проекта, если они загружены
    let author = "";
    let authorInitials = "";

    if (selectedCaseId === project.id && projectDetails) {
      author = projectDetails.creatorFio;
      // Извлекаем инициалы из полного имени
      const nameParts = projectDetails.creatorFio.split(" ");
      authorInitials = nameParts
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }

    return {
      id: String(project.id),
      title: project.title,
      author,
      authorInitials,
      description: project.description,
      stack: project.techStack,
      upvotes: project.likes,
      downvotes: project.dislikes,
      comments: project.commentsCount,
      userVote: project.userVote ?? null,
    };
  });

  // Обработчики
  const handleCaseClick = useCallback((caseId: string) => {
    const numId = parseInt(caseId, 10);
    setSelectedCaseId(numId);
  }, []);

  const handleVoteUp = useCallback(
    async (caseId: string) => {
      const numId = parseInt(caseId, 10);
      const currentVote = userVotes[numId];
      const newVote = currentVote === "up" ? null : true;

      try {
        await voteProjectMutation.mutateAsync({ id: numId, value: newVote });
        setUserVotes((prev) => ({
          ...prev,
          [numId]: newVote ? "up" : null,
        }));
        // Обновляем selectedModalData если это выбранный случай
        if (selectedCaseId === numId && selectedModalData) {
          setSelectedModalData({
            ...selectedModalData,
            userVote: newVote,
          });
        }
      } catch (error) {
        console.error("Ошибка при голосовании:", error);
        addNotification("Ошибка при голосовании", "error");
      }
    },
    [
      userVotes,
      voteProjectMutation,
      addNotification,
      selectedCaseId,
      selectedModalData,
    ]
  );

  const handleVoteDown = useCallback(
    async (caseId: string) => {
      const numId = parseInt(caseId, 10);
      const currentVote = userVotes[numId];
      const newVote = currentVote === "down" ? null : false;

      try {
        await voteProjectMutation.mutateAsync({ id: numId, value: newVote });
        setUserVotes((prev) => ({
          ...prev,
          [numId]: newVote !== null ? "down" : null,
        }));
        // Обновляем selectedModalData если это выбранный случай
        if (selectedCaseId === numId && selectedModalData) {
          setSelectedModalData({
            ...selectedModalData,
            userVote: newVote,
          });
        }
      } catch (error) {
        console.error("Ошибка при голосовании:", error);
        addNotification("Ошибка при голосовании", "error");
      }
    },
    [
      userVotes,
      voteProjectMutation,
      addNotification,
      selectedCaseId,
      selectedModalData,
    ]
  );

  const handleCreateCase = useCallback(
    async (formData: {
      title: string;
      description: string;
      stack: string;
      teamSize: number;
      mentorIds: number[];
    }) => {
      try {
        await projectsApi.createProject({
          title: formData.title,
          description: formData.description,
          techStack: formData.stack,
          teamSize: formData.teamSize,
          mentorIds: formData.mentorIds,
        });
        await queryClient.invalidateQueries({ queryKey: ["projects"] });
        addNotification(
          `Кейс "${formData.title}" успешно создан и добавлен в ленту!`,
          "success"
        );
        setIsCreateModalOpen(false);
      } catch (error) {
        console.error("Failed to create project:", error);
        const apiError = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const errorMessage =
          apiError?.response?.data?.message ||
          apiError?.message ||
          "Не удалось создать кейс. Попробуйте позже.";
        addNotification(errorMessage, "error");
      }
    },
    [addNotification, queryClient]
  );

  const handleCommentSubmit = useCallback(
    async (caseId: string, comment: string) => {
      const numId = parseInt(caseId, 10);
      try {
        await addCommentMutation.mutateAsync({
          id: numId,
          body: comment,
        });
        addNotification("Комментарий успешно добавлен", "success");
      } catch (error) {
        console.error("Ошибка при добавлении комментария:", error);
        addNotification("Ошибка при добавлении комментария", "error");
      }
    },
    [addCommentMutation, addNotification]
  );

  const handleStatusChange = useCallback(
    async (caseId: string, status: string) => {
      const numId = parseInt(caseId, 10);
      try {
        await updateStatusMutation.mutateAsync({ id: numId, status });
        addNotification("Статус проекта обновлен", "success");
        if (selectedModalData) {
          setSelectedModalData({ ...selectedModalData, status });
        }
      } catch (error) {
        console.error("Failed to update status:", error);
        addNotification("Не удалось обновить статус", "error");
      }
    },
    [updateStatusMutation, addNotification, selectedModalData]
  );

  const handleDeleteProject = useCallback(
    async (caseId: string) => {
      const numId = parseInt(caseId, 10);
      try {
        await projectsApi.deleteProject(numId);
        await queryClient.invalidateQueries({ queryKey: ["projects"] });
        setSelectedCaseId(null);
        addNotification("Проект успешно удален", "success");
      } catch (error) {
        console.error("Failed to delete project:", error);
        addNotification("Не удалось удалить проект", "error");
      }
    },
    [addNotification, queryClient]
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
      const numId = parseInt(caseId, 10);
      try {
        await projectsApi.updateProject(numId, {
          title: data.title,
          description: data.description,
          techStack: data.techStack,
          teamSize: 5,
          mentorIds: data.mentorIds,
        });

        await projectsApi.updateProjectMentors(numId, data.mentorIds);

        await queryClient.invalidateQueries({ queryKey: ["projects"] });
        await queryClient.invalidateQueries({ queryKey: ["project", numId] });

        addNotification("Проект успешно обновлен", "success");
      } catch (error) {
        console.error("Failed to update project:", error);
        addNotification("Не удалось обновить проект", "error");
      }
    },
    [addNotification, queryClient]
  );

  return (
    <div className={styles.casesSelection}>
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />

      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Отбор кейсов</h1>
          <Button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Предложить новый кейс
          </Button>
        </header>

        <CasesFeed
          cases={cases}
          onCaseClick={handleCaseClick}
          onUpvote={handleVoteUp}
          onDownvote={handleVoteDown}
          onComments={handleCaseClick}
        />
      </div>

      <CaseModal
        isOpen={selectedCaseId !== null}
        data={selectedModalData}
        isOwner={
          !!user &&
          !!projectDetails &&
          String(user.id) === String(projectDetails.creatorId)
        }
        onClose={() => setSelectedCaseId(null)}
        onVoteUp={handleVoteUp}
        onVoteDown={handleVoteDown}
        onCommentSubmit={handleCommentSubmit}
        onStatusChange={handleStatusChange}
        onDeleteProject={handleDeleteProject}
        onEditProject={handleEditProject}
      />

      <CreateCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCase}
      />
    </div>
  );
};
