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

interface CurrentProjectProps {
  project: {
    title: string;
    mentor: string;
    stack: string[];
    status: string;
  };
}

/**
 * CurrentProject component - отображение текущего проекта семестра
 */
export const CurrentProject = memo(({ project }: CurrentProjectProps) => {
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
          <Badge className={styles.badge}>{project.status}</Badge>
          <div className={styles.projectTitle}>{project.title}</div>
          <div className={styles.mentor}>Наставник: {project.mentor}</div>
          <div className={styles.stack}>{project.stack.join(", ")}</div>
        </motion.div>
      </CardContent>
    </Card>
  );
});

CurrentProject.displayName = "CurrentProject";
