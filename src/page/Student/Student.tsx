import { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { StudentHeader, CurrentTeam, ProjectHistory } from "./components";
import { ProjectDetailsModal } from "../../components/ProjectDetailsModal/ProjectDetailsModal";
import { ProjectInfoModal } from "../../components/ProjectInfoModal/ProjectInfoModal";
import { studentApi, projectsApi } from "../../api";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationContainer } from "../../components/Notification";
import styles from "./Student.module.css";
import type {
  StudentDetailsResponse,
  ProjectDetailsResponse,
} from "../../api/types";

/**
 * Student page component - профиль студента с его командами и проектами
 * Поддерживает динамический ID студента через /student/:id
 */
export const Student = () => {
  const { id: studentId } = useParams<{ id: string }>();
  const [studentData, setStudentData] = useState<StudentDetailsResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notifications, addNotification, removeNotification } =
    useNotifications();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [selectedProjectDetails, setSelectedProjectDetails] =
    useState<ProjectDetailsResponse | null>(null);
  const [isCurrentProjectOpen, setIsCurrentProjectOpen] = useState(false);
  const [currentProjectDetails, setCurrentProjectDetails] =
    useState<ProjectDetailsResponse | null>(null);

  const fetchStudentData = useCallback(async () => {
    if (!studentId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await studentApi.getStudentDetails(studentId);
      setStudentData(data);
    } catch (err) {
      console.error("Failed to fetch student details:", err);
      setError("Не удалось загрузить данные студента");
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const handleSelectProject = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProjectId(null);
    setSelectedProjectDetails(null);
  }, []);

  const handleSelectCurrentProject = useCallback(() => {
    if (studentData?.currentProject?.projectId) {
      setIsCurrentProjectOpen(true);
    }
  }, [studentData]);

  const handleCloseCurrentProjectModal = useCallback(() => {
    setIsCurrentProjectOpen(false);
    setCurrentProjectDetails(null);
  }, []);

  // Загружаем данные текущего проекта когда открывается модальное окно
  useEffect(() => {
    if (isCurrentProjectOpen && studentData?.currentProject?.projectId) {
      const fetchCurrentProjectDetails = async () => {
        try {
          const details = await projectsApi.getProjectById(
            studentData.currentProject!.projectId
          );
          setCurrentProjectDetails(details);
        } catch (error) {
          console.error("Failed to fetch current project details:", error);
          addNotification("Не удалось загрузить подробности проекта", "error");
        }
      };
      fetchCurrentProjectDetails();
    }
  }, [isCurrentProjectOpen, studentData, addNotification]);

  // Загружаем данные проекта когда открывается модальное окно
  useEffect(() => {
    if (selectedProjectId) {
      const fetchProjectDetails = async () => {
        try {
          const details = await projectsApi.getProjectById(
            parseInt(selectedProjectId)
          );
          setSelectedProjectDetails(details);
        } catch (error) {
          console.error("Failed to fetch project details:", error);
          addNotification("Не удалось загрузить подробности проекта", "error");
        }
      };
      fetchProjectDetails();
    }
  }, [selectedProjectId, addNotification]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">
          {error || "Студент не найден"}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.student}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        <StudentHeader
          student={{
            name: studentData.fullname,
            avatar: "",
            projectsCompleted: studentData.completedProjectsCount,
            averageGrade: studentData.averageGrade,
            currentTeam: studentData.currentTeam,
            description: studentData.bio,
            telegram: studentData.telegram,
          }}
        />

        <div className="flex flex-col gap-6">
          <CurrentTeam
            currentTeam={studentData.currentTeam}
            currentTeamId={studentData.currentTeamId}
            studentId={studentData.id}
            currentProject={studentData.currentProject?.projectTitle || null}
            onSelectCurrentProject={handleSelectCurrentProject}
            stats={{
              projectsCompleted: studentData.completedProjectsCount,
              averageGrade: studentData.averageGrade,
              teamsCount: studentData.teamsCount,
            }}
            onRemoveSuccess={fetchStudentData}
            addNotification={addNotification}
          />
          <ProjectHistory
            projects={studentData.projectHistory}
            onSelectProject={handleSelectProject}
          />
        </div>

        <ProjectDetailsModal
          isOpen={!!selectedProjectId}
          onClose={handleCloseModal}
          data={
            selectedProjectDetails
              ? {
                  id: selectedProjectDetails.id.toString(),
                  title: selectedProjectDetails.title,
                  mentor: selectedProjectDetails.creatorFio,
                  description: selectedProjectDetails.description,
                  stack: selectedProjectDetails.techStack.split(", "),
                  teamName: "",
                  teamMembers: [],
                  grade: 0,
                  checkpoints: [],
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
                  teams: (selectedProjectDetails.teams || []).map((team) => ({
                    id: team.id.toString(),
                    name: team.name,
                    members: (team.participants || []).map((p) => p.fio),
                    grade: team.averageRating,
                  })),
                }
              : null
          }
        />

        <ProjectInfoModal
          isOpen={isCurrentProjectOpen}
          onClose={handleCloseCurrentProjectModal}
          readOnly={true}
          data={
            currentProjectDetails
              ? {
                  id: currentProjectDetails.id.toString(),
                  title: currentProjectDetails.title,
                  author: currentProjectDetails.creatorFio,
                  description: currentProjectDetails.description,
                  semester: currentProjectDetails.semesterName,
                  stack: currentProjectDetails.techStack,
                  upvotes: currentProjectDetails.likesCount,
                  downvotes: currentProjectDetails.dislikesCount,
                  comments: [],
                  rawStatus: currentProjectDetails.status,
                  status: (() => {
                    switch (currentProjectDetails.status) {
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
                        return currentProjectDetails.status;
                    }
                  })(),
                  mentorsList: currentProjectDetails.mentors || [],
                  mentorIds: (currentProjectDetails.mentors || []).map(
                    (m) => m.id
                  ),
                  teams: (currentProjectDetails.teams || []).map((team) => ({
                    id: team.id.toString(),
                    name: team.name,
                    members: (team.participants || []).map((p) => p.fio),
                    grade: team.averageRating,
                  })),
                  teamSize: currentProjectDetails.teamSize,
                  userVote: currentProjectDetails.userVote,
                  projectId: currentProjectDetails.id,
                }
              : undefined
          }
        />

        <NotificationContainer
          notifications={notifications}
          onClose={removeNotification}
        />
      </div>
    </motion.div>
  );
};
