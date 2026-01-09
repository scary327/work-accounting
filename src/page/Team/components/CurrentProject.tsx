import { memo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import styles from "./CurrentProject.module.css";
import type { TeamParticipant } from "../../../api/types";

interface CurrentProjectProps {
  project: {
    title: string;
    mentors: TeamParticipant[];
    techStack: string;
    averageGrade?: number | null;
  } | null;
}

/**
 * CurrentProject component - отображение текущего проекта семестра
 */
export const CurrentProject = memo(({ project }: CurrentProjectProps) => {
  if (!project) {
    return (
      <Card className={styles.section}>
        <CardHeader className="pb-2">
          <CardTitle className={styles.sectionHeader}>
            <span className={styles.icon}>🚀</span>
            <span className={styles.title}>Текущий семестр</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500 italic">Нет активного проекта</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={styles.section}>
      <CardHeader className="pb-2">
        <CardTitle className={styles.sectionHeader}>
          <span className={styles.icon}>🚀</span>
          <span className={styles.title}>Текущий семестр</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <motion.div
          className={styles.projectBox}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Badge className={styles.badge}>В работе</Badge>
          <div className={styles.projectTitle}>{project.title}</div>
          <div className={styles.mentor}>
            Наставники: {project.mentors.map((m) => m.fio).join(", ")}
          </div>
          <div className={styles.stack}>{project.techStack}</div>
          {project.averageGrade !== undefined &&
            project.averageGrade !== null &&
            project.averageGrade > 0 && (
              <div className={styles.grade}>
                🏆 Текущая оценка: {project.averageGrade.toFixed(2)}
              </div>
            )}
        </motion.div>
      </CardContent>
    </Card>
  );
});

CurrentProject.displayName = "CurrentProject";
