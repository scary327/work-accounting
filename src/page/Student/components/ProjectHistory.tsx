import { useMemo } from "react";
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

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>📚</span>
        <h2 className={styles.sectionTitle}>История проектов</h2>
      </div>

      {sortedProjects.length > 0 ? (
        <div className={styles.projectsGrid}>
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onSelectProject(project.id)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>📚</div>
          <div className={styles.placeholderText}>
            Студент ещё не завершил ни одного проекта
          </div>
        </div>
      )}
    </div>
  );
};
