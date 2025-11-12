import { Link } from "react-router-dom";
import styles from "./ProjectModal.module.css";

interface ProjectModalProps {
  project: {
    id: string;
    semester: string;
    title: string;
    mentor: string;
    teamName: string;
    teamId: string;
    stack: string[];
    grade: number;
    description: string;
    checkpoints: Array<{
      name: string;
      score: number;
      comment: string;
    }>;
    teamComposition: string[];
  };
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ProjectModal component - модальное окно с подробной информацией о проекте
 */
export const ProjectModal = ({
  project,
  isOpen,
  onClose,
}: ProjectModalProps) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`${styles.modal} ${isOpen ? styles.active : ""}`}
      onClick={handleBackdropClick}
    >
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{project.title}</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            type="button"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.detailSection}>
            <h3>Команда</h3>
            <div className={styles.detailText}>
              <Link to={`/team/${project.teamId}`} className={styles.teamLink}>
                {project.teamName}
              </Link>
            </div>
            <div className={styles.studentsList}>
              {project.teamComposition.map((member, index) => (
                <span key={index} className={styles.studentLink}>
                  • {member}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3>Автор и описание</h3>
            <div className={styles.detailText}>
              <strong>Наставник:</strong> {project.mentor}
              <br />
              <br />
              {project.description}
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3>Стек технологий</h3>
            <div className={styles.detailText}>{project.stack.join(", ")}</div>
          </div>

          <div className={styles.detailSection}>
            <h3>Результаты и оценки</h3>
            <div className={styles.checkpointList}>
              {project.checkpoints.map((checkpoint, index) => (
                <div key={index} className={styles.checkpointItem}>
                  <div className={styles.checkpointHeader}>
                    <span className={styles.checkpointTitle}>
                      {checkpoint.name}
                    </span>
                    <span className={styles.checkpointScore}>
                      {checkpoint.score}
                    </span>
                  </div>
                  <div className={styles.checkpointComment}>
                    {checkpoint.comment}
                  </div>
                </div>
              ))}

              <div className={`${styles.checkpointItem} ${styles.finalGrade}`}>
                <div className={styles.checkpointHeader}>
                  <span className={styles.checkpointTitle}>
                    Итоговая оценка
                  </span>
                  <span className={styles.checkpointScore}>
                    {project.grade}/100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
