import styles from "./ArchiveModal.module.css";

export interface ModalData {
  id: string;
  title: string;
  author: string;
  description: string;
  stack: string;
  teamName: string;
  teamMembers: string[];
  grade: number;
  checkpoints: Array<{
    id: string;
    title: string;
    score: number;
    comment: string;
  }>;
}

interface ArchiveModalProps {
  isOpen: boolean;
  data?: ModalData;
  onClose: () => void;
}

/**
 * ArchiveModal component - модальное окно с деталями кейса
 */
export const ArchiveModal = ({ isOpen, data, onClose }: ArchiveModalProps) => {
  if (!isOpen || !data) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getGradeLabel = (score: number): string => {
    if (score >= 85) return "Отлично";
    if (score >= 70) return "Хорошо";
    if (score >= 55) return "Удовлетворительно";
    return "Неудовлетворительно";
  };

  return (
    <div className={styles.modal} onClick={handleBackdropClick}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>{data.title}</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            type="button"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Информация о кейсе</h3>
            <p className={styles.text}>{data.description}</p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Наставник</h3>
            <p className={styles.text}>{data.author}</p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Стек технологий</h3>
            <p className={styles.text}>{data.stack}</p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Команда</h3>
            <div className={styles.team}>
              <div className={styles.teamName}>{data.teamName}</div>
              <div className={styles.members}>
                {data.teamMembers.map((member) => (
                  <div key={member} className={styles.member}>
                    {member}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Оценки</h3>
            <div className={styles.checkpoints}>
              {data.checkpoints.map((checkpoint) => (
                <div key={checkpoint.id} className={styles.checkpoint}>
                  <div className={styles.checkpointHeader}>
                    <span className={styles.checkpointTitle}>
                      {checkpoint.title}
                    </span>
                    <span className={styles.checkpointScore}>
                      {checkpoint.score}
                    </span>
                  </div>
                  {checkpoint.comment && (
                    <p className={styles.checkpointComment}>
                      {checkpoint.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.finalGrade}>
              <div className={styles.checkpointHeader}>
                <span className={styles.checkpointTitle}>Финальная оценка</span>
                <span className={styles.finalScore}>{data.grade}</span>
              </div>
              <div className={styles.gradeLabel}>
                {getGradeLabel(data.grade)}
              </div>
            </div>
          </section>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.secondary}`}
            onClick={onClose}
            type="button"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
