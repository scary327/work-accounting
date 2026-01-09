import { useCallback, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Team.module.css";
import {
  TeamHeader,
  TeamMembers,
  CurrentProject,
  ProjectHistory,
} from "./components";
import { ProjectDetailsModal } from "../../components/ProjectDetailsModal/ProjectDetailsModal";
import { ConfirmDialog } from "../../components/ui/confirm-dialog";
import { Button } from "../../components/ui/button";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationContainer } from "../../components/Notification";
import type { Team as TeamType, TeamProjectDetails } from "../../api/types";
import { teamsApi } from "../../api/teamsApi";
import { AssignProjectModal } from "./components/AssignProjectModal";
import { GradeTeamModal } from "./components/GradeTeamModal";
import { AddParticipantModal } from "./components/AddParticipantModal";
import { GradesListModal } from "./components/GradesListModal";

/**
 * Team page component - информация о команде, её членах и проектах
 * Поддерживает динамический ID команды через /team/:id
 */
export const Team = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notifications, addNotification, removeNotification } =
    useNotifications();

  const [teamData, setTeamData] = useState<TeamType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] =
    useState<TeamProjectDetails | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignProjectOpen, setIsAssignProjectOpen] = useState(false);
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [isGradesListOpen, setIsGradesListOpen] = useState(false);

  const fetchTeam = useCallback(async () => {
    if (!teamId) return;
    try {
      setIsLoading(true);
      const data = await teamsApi.getTeamDetails(teamId);
      setTeamData(data);
    } catch (error) {
      console.error("Failed to fetch team details:", error);
      addNotification("Не удалось загрузить данные команды", "error");
    } finally {
      setIsLoading(false);
    }
  }, [teamId, addNotification]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleDeleteTeam = async () => {
    if (!teamId) return;
    try {
      await teamsApi.deleteTeam(teamId);
      addNotification("Команда успешно удалена", "success");
      navigate("/team");
    } catch (error) {
      console.error("Failed to delete team:", error);
      addNotification("Не удалось удалить команду", "error");
    }
  };

  const handleSelectProject = useCallback((project: TeamProjectDetails) => {
    setSelectedProject(project);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Team not found
      </div>
    );
  }

  return (
    <motion.div
      className={styles.team}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        <TeamHeader
          team={{
            name: teamData.name,
            completedProjects: teamData.projectHistory.length,
          }}
        />

        <div className={styles.controls}>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Удалить команду
          </Button>
          <div className={styles.actions}>
            <Button
              variant="outline"
              onClick={() => setIsAddParticipantOpen(true)}
            >
              Добавить участника
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsAssignProjectOpen(true)}
            >
              Назначить проект
            </Button>
            <Button variant="primary" onClick={() => setIsGradeOpen(true)}>
              Оценить
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsGradesListOpen(true)}
            >
              Оценки
            </Button>
          </div>
        </div>

        <div className={styles.content}>
          <TeamMembers members={teamData.participants} />
          <CurrentProject project={teamData.currentProject} />
          <ProjectHistory
            projects={teamData.projectHistory}
            onSelectProject={handleSelectProject}
          />
        </div>

        <ProjectDetailsModal
          isOpen={!!selectedProject}
          onClose={handleCloseModal}
          data={
            selectedProject
              ? {
                  id: selectedProject.title,
                  title: selectedProject.title,
                  mentor: selectedProject.mentors.map((m) => m.fio).join(", "),
                  description: selectedProject.description,
                  stack: selectedProject.techStack.split(", "),
                  teamName: teamData.name,
                  teamMembers: [],
                  grade: selectedProject.averageGrade,
                  checkpoints: [],
                  status: "✅ Завершен",
                }
              : null
          }
        />

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title="Удаление команды"
          message={`Вы уверены, что хотите удалить команду "${teamData.name}"? Это действие необратимо.`}
          onConfirm={handleDeleteTeam}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />

        {teamData && (
          <>
            <AssignProjectModal
              isOpen={isAssignProjectOpen}
              onClose={() => setIsAssignProjectOpen(false)}
              teamId={teamData.id}
              onSuccess={fetchTeam}
              addNotification={addNotification}
            />
            <GradeTeamModal
              isOpen={isGradeOpen}
              onClose={() => setIsGradeOpen(false)}
              teamId={teamData.id}
              onSuccess={fetchTeam}
              addNotification={addNotification}
            />
            <AddParticipantModal
              isOpen={isAddParticipantOpen}
              onClose={() => setIsAddParticipantOpen(false)}
              teamId={teamData.id}
              onSuccess={fetchTeam}
              addNotification={addNotification}
            />
            <GradesListModal
              isOpen={isGradesListOpen}
              onClose={() => setIsGradesListOpen(false)}
              teamId={teamData.id}
              addNotification={addNotification}
            />
          </>
        )}
        <NotificationContainer
          notifications={notifications}
          onClose={removeNotification}
        />
      </div>
    </motion.div>
  );
};
