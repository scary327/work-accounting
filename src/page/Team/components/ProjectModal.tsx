import { memo, useCallback } from "react";
import styles from "./ProjectModal.module.css";

interface Checkpoint {
  name: string;
  score: number;
  comment: string;
}

interface Project {
  id: string;
  semester: string;
  title: string;
  mentor: string;
  stack: string[];
  teamComposition: string[];
  grade: number;
  description: string;
  checkpoints: Checkpoint[];
}

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ProjectModal component - модальное окно с детальной информацией о проекте
 */
export const ProjectModal = memo(
  ({ project, isOpen, onClose }: ProjectModalProps) => {
    const handleBackdropClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      },
      [onClose]
    );

    return (
      <div
        className={`${styles.modal} ${isOpen ? styles.active : ""}`}
        onClick={handleBackdropClick}
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <h2>{project.title}</h2>
            <button
              className={styles.closeBtn}
              onClick={onClose}
              type="button"
              aria-label="Закрыть модальное окно"
            >
              ×
            </button>
          </div>

          <div className={styles.body}>
            <div className={styles.section}>
              <h3>Команда</h3>
              <p>
                <a href="#team" className={styles.link}>
                  Команда Alpha
                </a>
              </p>
              <ul className={styles.list}>
                {project.teamComposition.map((member, idx) => (
                  <li key={idx}>
                    <a href="#student" className={styles.link}>
                      • {member}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.section}>
              <h3>Автор и описание</h3>
              <p>
                <strong>Наставник:</strong> {project.mentor}
                <br />
                <br />
                {project.description}
              </p>
            </div>

            <div className={styles.section}>
              <h3>Стек технологий</h3>
              <p>{project.stack.join(", ")}</p>
            </div>

            <div className={styles.section}>
              <h3>Результаты и оценки</h3>
              <div className={styles.checkpoints}>
                {project.checkpoints.map((checkpoint, idx) => (
                  <div
                    key={idx}
                    className={`${styles.checkpoint} ${
                      idx === project.checkpoints.length - 1 ? styles.final : ""
                    }`}
                  >
                    <div className={styles.checkpointHeader}>
                      <div className={styles.checkpointTitle}>
                        {checkpoint.name}
                      </div>
                      <div
                        className={`${styles.checkpointScore} ${
                          idx === project.checkpoints.length - 1
                            ? styles.finalScore
                            : ""
                        }`}
                      >
                        {checkpoint.score}
                      </div>
                    </div>
                    <div className={styles.checkpointComment}>
                      {checkpoint.comment}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.btnSecondary}
              onClick={onClose}
              type="button"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ProjectModal.displayName = "ProjectModal";
