import { Link } from "react-router-dom";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: {
    id: string;
    semester: string;
    title: string;
    mentor: string;
    teamName: string;
    teamId: string;
    stack: string[];
    grade: number;
  };
  onClick: () => void;
}

/**
 * ProjectCard component - карточка завершённого проекта
 */
export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  return (
    <div className={styles.projectCard} onClick={onClick}>
      <div className={styles.cardSemester}>{project.semester}</div>
      <div className={styles.cardTitle}>{project.title}</div>
      <div className={styles.cardMentor}>Наставник: {project.mentor}</div>
      <div className={styles.cardTeam}>
        Команда:{" "}
        <Link
          to={`/team/${project.teamId}`}
          className={styles.teamLink}
          onClick={(e) => e.stopPropagation()}
        >
          {project.teamName}
        </Link>
      </div>
      <div className={styles.cardStack}>{project.stack.join(", ")}</div>
      <div className={styles.cardGrade}>
        🏆 Итоговая оценка: {project.grade}/100
      </div>
    </div>
  );
};
