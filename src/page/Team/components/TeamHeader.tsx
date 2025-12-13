import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./TeamHeader.module.css";

interface TeamHeaderProps {
  team: {
    name: string;
    completedProjects: number;
  };
}

/**
 * TeamHeader component - заголовок страницы команды с хлебными крошками
 */
export const TeamHeader = memo(({ team }: TeamHeaderProps) => {
  return (
    <motion.div
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.breadcrumb}>
        <Link to="/dashboard" className={styles.link}>
          Дашборд
        </Link>
        <span className={styles.separator}>→</span>
        <Link to="/team" className={styles.link}>
          Команды
        </Link>
        <span className={styles.separator}>→</span>
        <span className={styles.current}>{team.name}</span>
      </div>

      <h1 className={styles.title}>{team.name}</h1>

      <div className={styles.meta}>
        Завершено проектов: {team.completedProjects}
      </div>
    </motion.div>
  );
});

TeamHeader.displayName = "TeamHeader";
