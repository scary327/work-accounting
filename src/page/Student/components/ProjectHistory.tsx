import { useMemo } from "react";
import { motion } from "framer-motion";
import { History, BookOpen } from "lucide-react";
import styles from "./ProjectHistory.module.css";
import type { ProjectHistoryItem } from "../../../api/types";

interface ProjectHistoryProps {
  projects: ProjectHistoryItem[];
  onSelectProject: (projectId: string) => void;
}

/**
 * ProjectHistory component - список завершённых проектов студента
 */
export const ProjectHistory = ({
  projects,
  onSelectProject,
}: ProjectHistoryProps) => {
  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) =>
        b.semesterName.localeCompare(a.semesterName)
      ),
    [projects]
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className={styles.sectionHeader}>
        <History className="w-6 h-6 mr-2 text-primary" />
        <h2 className={styles.sectionTitle}>История проектов</h2>
      </div>

      {sortedProjects.length > 0 ? (
        <motion.div
          className={styles.projectsGrid}
          variants={container}
          initial="hidden"
          animate="show"
        >
          {sortedProjects.map((project) => (
            <motion.div
              key={project.projectId}
              className={styles.card}
              onClick={() => onSelectProject(project.projectId.toString())}
              whileHover={{ y: -5 }}
            >
              <div className={styles.semester}>{project.semesterName}</div>
              <div className={styles.projectTitle}>{project.projectTitle}</div>
              <div className={styles.dates}>
                {new Date(project.assignedAt).toLocaleDateString()} -{" "}
                {project.unassignedAt
                  ? new Date(project.unassignedAt).toLocaleDateString()
                  : "..."}
              </div>
              {project.averageGrade !== undefined &&
                project.averageGrade !== null &&
                project.averageGrade > 0 && (
                  <div className={styles.grade}>
                    🏆 Оценка:{" "}
                    <span className={styles.gradeValue}>
                      {project.averageGrade.toFixed(2)}
                    </span>
                  </div>
                )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className={styles.placeholder}>
          <BookOpen className="w-12 h-12 text-muted-foreground m-[0_auto_1rem]" />
          <div className={styles.placeholderText}>
            Студент ещё не завершил ни одного проекта
          </div>
        </div>
      )}
    </motion.div>
  );
};
