import { memo } from "react";
import { Link } from "react-router-dom";
import styles from "./TeamHeader.module.css";

interface TeamHeaderProps {
  team: {
    name: string;
    createdSemester: string;
    completedProjects: number;
  };
}

/**
 * TeamHeader component - заголовок страницы команды с хлебными крошками
 */
export const TeamHeader = memo(({ team }: TeamHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.breadcrumb}>
        <Link to="/dashboard" className={styles.link}>
          Дашборд
        </Link>
        <span className={styles.separator}>→</span>
        <span className={styles.current}>{team.name}</span>
      </div>

      <h1 className={styles.title}>{team.name}</h1>

      <div className={styles.meta}>
        Создана: {team.createdSemester} • Завершено проектов:{" "}
        {team.completedProjects}
      </div>
    </div>
  );
});

TeamHeader.displayName = "TeamHeader";
