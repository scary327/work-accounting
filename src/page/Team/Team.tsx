import { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Team.module.css";
import {
  TeamHeader,
  TeamMembers,
  CurrentProject,
  ProjectHistory,
} from "./components";
import { ProjectDetailsModal } from "../../components/ProjectDetailsModal/ProjectDetailsModal";
import { Team as TeamType, TeamProject } from "../../api/types";
import { teamsApi } from "../../api/teamsApi";

/**
 * Team page component - информация о команде, её членах и проектах
 * Поддерживает динамический ID команды через /team/:id
 */
export const Team = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const [teamData, setTeamData] = useState<TeamType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<TeamProject | null>(
    null
  );

  useEffect(() => {
    const fetchTeam = async () => {
      if (!teamId) return;
      try {
        setIsLoading(true);
        const data = await teamsApi.getTeamDetails(teamId);
        setTeamData(data);
      } catch (error) {
        console.error("Failed to fetch team details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  const handleSelectProject = useCallback((project: TeamProject) => {
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
                  mentor: selectedProject.mentors.join(", "),
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
      </div>
    </motion.div>
  );
};
