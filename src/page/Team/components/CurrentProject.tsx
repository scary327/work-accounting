import { memo } from "react";
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
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.icon}>🚀</span>
        <h2 className={styles.title}>Текущий семестр</h2>
      </div>

      <div className={styles.projectBox}>
        <div className={styles.badge}>{project.status}</div>
        <div className={styles.projectTitle}>{project.title}</div>
        <div className={styles.mentor}>Наставник: {project.mentor}</div>
        <div className={styles.stack}>{project.stack.join(", ")}</div>
      </div>
    </section>
  );
});

CurrentProject.displayName = "CurrentProject";
