import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import styles from "./ProjectHistory.module.css";
import type { TeamProjectDetails } from "../../../api/types";

interface ProjectHistoryProps {
  projects: TeamProjectDetails[];
  onSelectProject: (project: TeamProjectDetails) => void;
}

/**
 * ProjectHistory component - история проектов команды в виде сетки карточек
 */
export const ProjectHistory = memo(
  ({ projects, onSelectProject }: ProjectHistoryProps) => {
    const handleCardClick = useCallback(
      (project: TeamProjectDetails) => {
        onSelectProject(project);
      },
      [onSelectProject]
    );

    return (
      <Card className={styles.section}>
        <CardHeader className="pb-2">
          <CardTitle className={styles.sectionHeader}>
            <span className={styles.icon}>📚</span>
            <span className={styles.title}>История проектов</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className={styles.grid}>
            {projects.map((project, index) => (
              <motion.div
                key={`${project.title}-${index}`}
                className={styles.card}
                onClick={() => handleCardClick(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(project);
                  }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={styles.semester}>{project.semesterName}</div>
                <div className={styles.cardTitle}>{project.title}</div>
                <div className={styles.mentor}>
                  Наставники: {project.mentors.map((m) => m.fio).join(", ")}
                </div>

                <div className={styles.stack}>
                  <span className={styles.stackTag}>{project.techStack}</span>
                </div>

                <div className={styles.grade}>
                  🏆 Итоговая оценка: {(project.averageGrade ?? 0).toFixed(2)}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
);

ProjectHistory.displayName = "ProjectHistory";
