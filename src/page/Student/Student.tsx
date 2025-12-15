import { useMemo, useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { StudentHeader, CurrentTeam, ProjectHistory } from "./components";
import { ProjectDetailsModal } from "../../components/ProjectDetailsModal/ProjectDetailsModal";
import { studentApi } from "../../api";
import styles from "./Student.module.css";
import type { StudentDetailsResponse } from "../../api/types";

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
        setStudentData(data);
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
    () =>
      studentData?.projectHistory.find(
        (p) => p.projectId.toString() === selectedProjectId
      ),
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
        <StudentHeader
          student={{
            name: studentData.fullname,
            avatar: "",
            projectsCompleted: studentData.completedProjectsCount,
            averageGrade: studentData.averageGrade,
            currentTeam: studentData.currentTeam,
            email: "student@example.com", // Placeholder
            phone: "+7 (999) 000-00-00", // Placeholder
            github: "@student", // Placeholder
          }}
        />

        <div className="flex flex-col gap-6">
          <CurrentTeam
            currentTeam={studentData.currentTeam}
            currentProject={studentData.currentProject?.projectTitle || null}
            stats={{
              projectsCompleted: studentData.completedProjectsCount,
              averageGrade: studentData.averageGrade,
              teamsCount: studentData.teamsCount,
            }}
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
            selectedProject
              ? {
                  id: selectedProject.projectId.toString(),
                  title: selectedProject.projectTitle,
                  mentor: "",
                  description: "",
                  stack: [],
                  teamName: "",
                  teamMembers: [],
                  grade: 0,
                  checkpoints: [],
                  status: selectedProject.isActive ? "В работе" : "Завершен",
                }
              : null
          }
        />
      </div>
    </motion.div>
  );
};
