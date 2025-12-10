import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";
import styles from "./ProjectDetailsModal.module.css";

export interface ProjectDetails {
  id: string;
  title: string;
  mentor: string;
  description: string;
  stack: string[];
  teamName: string;
  teamId?: string;
  teamMembers: string[];
  grade: number;
  checkpoints: Array<{
    id?: string;
    title: string;
    score: number;
    comment: string;
  }>;
  status?: string;
}

interface ProjectDetailsModalProps {
  isOpen: boolean;
  data: ProjectDetails | null;
  onClose: () => void;
}

export const ProjectDetailsModal = ({
  isOpen,
  data,
  onClose,
}: ProjectDetailsModalProps) => {
  const getGradeLabel = (score: number): string => {
    if (score >= 85) return "Отлично";
    if (score >= 70) return "Хорошо";
    if (score >= 55) return "Удовлетворительно";
    return "Неудовлетворительно";
  };

  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{data.title}</h2>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
      </div>

      <div className={styles.content}>
        {/* Status badge */}
        {data.status && (
          <motion.div
            className={styles.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <span className={styles.statusBadge}>{data.status}</span>
          </motion.div>
        )}

        {/* Team */}
        <motion.div
          className={styles.section}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className={styles.sectionTitle}>Команда</h3>
          <div className={styles.detailText}>
            {data.teamId ? (
              <Link to={`/team/${data.teamId}`} className={styles.teamLink}>
                {data.teamName}
              </Link>
            ) : (
              <p className={styles.teamLink}>{data.teamName}</p>
            )}
          </div>
          <div className={styles.studentsList}>
            {data.teamMembers.map((member, idx) => (
              <span key={idx} className={styles.studentLink}>
                • {member}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Mentor and description */}
        <motion.div
          className={styles.section}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className={styles.sectionTitle}>Автор и описание</h3>
          <div className={styles.detailText}>
            <strong>Наставник:</strong> {data.mentor}
            <br />
            <br />
            {data.description}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          className={styles.section}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className={styles.sectionTitle}>Стек технологий</h3>
          <div className={styles.detailText}>{data.stack.join(", ")}</div>
        </motion.div>

        {/* Checkpoints */}
        <motion.div
          className={styles.section}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className={styles.sectionTitle}>Результаты и оценки</h3>
          <div className={styles.checkpointList}>
            {data.checkpoints.map((checkpoint, idx) => (
              <motion.div
                key={checkpoint.id || idx}
                className={styles.checkpointItem}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
              >
                <div className={styles.checkpointHeader}>
                  <span className={styles.checkpointTitle}>
                    {checkpoint.title}
                  </span>
                  <span className={styles.checkpointScore}>
                    {checkpoint.score}/100
                  </span>
                </div>
                {checkpoint.comment && (
                  <p className={styles.checkpointComment}>
                    {checkpoint.comment}
                  </p>
                )}
              </motion.div>
            ))}

            {/* Final grade */}
            <motion.div
              className={styles.finalGrade}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + data.checkpoints.length * 0.05 }}
            >
              <div className={styles.checkpointHeader}>
                <span className={styles.checkpointTitle}>Итоговая оценка</span>
                <span className={styles.checkpointScore}>
                  {data.grade}/100 — {getGradeLabel(data.grade)}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className={styles.footer}>
        <Button onClick={onClose} variant="outline">
          Закрыть
        </Button>
      </div>
    </Modal>
  );
};
