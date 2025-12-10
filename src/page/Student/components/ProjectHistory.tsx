import { useMemo } from "react";
import { motion } from "framer-motion";
import { History, BookOpen } from "lucide-react";
import styles from "./ProjectHistory.module.css";
import { ProjectCard } from "./ProjectCard";

interface Project {
  id: string;
  semester: string;
  title: string;
  mentor: string;
  teamName: string;
  teamId: string;
  stack: string[];
  grade: number;
}

interface ProjectHistoryProps {
  projects: Project[];
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
    () => [...projects].sort((a, b) => b.semester.localeCompare(a.semester)),
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
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onSelectProject(project.id)}
            />
          ))}
        </motion.div>
      ) : (
        <div className={styles.placeholder}>
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <div className={styles.placeholderText}>
            Студент ещё не завершил ни одного проекта
          </div>
        </div>
      )}
    </motion.div>
  );
};
