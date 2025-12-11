import { useMemo, useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { StudentHeader, CurrentTeam, ProjectHistory } from "./components";
import { ProjectDetailsModal } from "../../components/ProjectDetailsModal/ProjectDetailsModal";
import { studentApi } from "../../api";
import styles from "./Student.module.css";

interface Project {
  id: string;
  semester: string;
  title: string;
  mentor: string;
  teamName: string;
  teamId: string;
  stack: string[];
  grade: number;
  description: string;
  checkpoints: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  teamComposition: string[];
}

interface StudentData {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  github: string;
  projectsCompleted: number;
  averageGrade: number;
  teamsCount: number;
  currentTeam: {
    id: string;
    name: string;
    currentProject: string;
  } | null;
  projects: Project[];
}

/**
 * Student page component - профиль студента с его командами и проектами
 * Поддерживает динамический ID студента через /student/:id
 */
export const Student = () => {
  const { id: studentId } = useParams<{ id: string }>();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await studentApi.getStudentDetails(studentId);

        // Helper to get initials
        const getInitials = (name: string) => {
          return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
        };

        const mappedData: StudentData = {
          id: data.id.toString(),
          name: data.fullname,
          avatar: getInitials(data.fullname),
          email: "Нет данных", // Missing in API
          phone: "Нет данных", // Missing in API
          github: "Нет данных", // Missing in API
          projectsCompleted: data.completedProjectsCount,
          averageGrade: data.averageGrade,
          teamsCount: data.teamsCount,
          currentTeam: data.currentTeam
            ? {
                id: "unknown", // Missing in API
                name: data.currentTeam,
                currentProject:
                  data.currentProject?.projectTitle || "Нет активного проекта",
              }
            : null,
          projects: data.projectHistory.map((p) => ({
            id: p.projectId.toString(),
            semester: p.semesterName,
            title: p.projectTitle,
            mentor: "Нет данных", // Missing in API
            teamName: "Нет данных", // Missing in API
            teamId: "unknown", // Missing in API
            stack: [], // Missing in API
            grade: 0, // Missing in API
            description: "Нет описания", // Missing in API
            checkpoints: [], // Missing in API
            teamComposition: [], // Missing in API
          })),
        };

        setStudentData(mappedData);
      } catch (err) {
        console.error("Failed to fetch student details:", err);
        setError("Не удалось загрузить данные студента");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const handleSelectProject = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProjectId(null);
  }, []);

  const selectedProject = useMemo(
    () => studentData?.projects.find((p) => p.id === selectedProjectId),
    [selectedProjectId, studentData]
  );

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
        <StudentHeader student={studentData} />

        <div className="flex flex-col gap-6">
          <CurrentTeam
            currentTeam={studentData.currentTeam}
            stats={{
              projectsCompleted: studentData.projectsCompleted,
              averageGrade: studentData.averageGrade,
              teamsCount: studentData.teamsCount,
            }}
          />
          <ProjectHistory
            projects={studentData.projects}
            onSelectProject={handleSelectProject}
          />
        </div>

        <ProjectDetailsModal
          isOpen={!!selectedProjectId}
          onClose={handleCloseModal}
          data={
            selectedProject
              ? {
                  id: selectedProject.id,
                  title: selectedProject.title,
                  mentor: selectedProject.mentor,
                  description: selectedProject.description,
                  stack: selectedProject.stack,
                  teamName: selectedProject.teamName,
                  teamId: selectedProject.teamId,
                  teamMembers: selectedProject.teamComposition,
                  grade: selectedProject.grade,
                  checkpoints: selectedProject.checkpoints.map((cp) => ({
                    title: cp.name,
                    score: cp.score,
                    comment: cp.comment,
                  })),
                  status: "✅ Завершен",
                }
              : null
          }
        />
      </div>
    </motion.div>
  );
};
