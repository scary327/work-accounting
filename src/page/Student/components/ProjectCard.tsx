import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
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
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card
        className={`${styles.projectCard} h-full cursor-pointer hover:shadow-md transition-shadow flex flex-col`}
        onClick={onClick}
      >
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className={styles.cardSemester}>
              {project.semester}
            </Badge>
            <Badge
              variant={project.grade >= 80 ? "default" : "secondary"}
              className={styles.cardGrade}
            >
              {project.grade.toFixed(2)}/100
            </Badge>
          </div>

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

          <div className={`${styles.cardStack} mt-auto pt-4`}>
            {project.stack.map((tech, index) => (
              <span
                key={index}
                className="inline-block bg-muted px-2 py-1 rounded text-xs mr-1 mb-1"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
