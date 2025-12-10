import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import styles from "./ProjectHistory.module.css";

interface Project {
  id: string;
  semester: string;
  title: string;
  mentor: string;
  stack: string[];
  teamComposition: string[];
  grade: number;
}

interface ProjectHistoryProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

/**
 * ProjectHistory component - история проектов команды в виде сетки карточек
 */
export const ProjectHistory = memo(
  ({ projects, onSelectProject }: ProjectHistoryProps) => {
    const handleCardClick = useCallback(
      (projectId: string) => {
        onSelectProject(projectId);
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
                key={project.id}
                className={styles.card}
                onClick={() => handleCardClick(project.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(project.id);
                  }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={styles.semester}>{project.semester}</div>
                <div className={styles.cardTitle}>{project.title}</div>
                <div className={styles.mentor}>Наставник: {project.mentor}</div>

                <div className={styles.stack}>
                  {project.stack.map((tech) => (
                    <span key={tech} className={styles.stackTag}>
                      {tech}
                    </span>
                  ))}
                </div>

                <div className={styles.teamComposition}>
                  <div className={styles.label}>Состав на тот момент:</div>
                  <div className={styles.members}>
                    {project.teamComposition.join(", ")}
                  </div>
                </div>

                <div className={styles.grade}>
                  🏆 Итоговая оценка: {project.grade}/100
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
