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
  teams?: Array<{
    id: string;
    name: string;
    members: string[];
    grade?: number | null;
  }>;
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
  const getGradeLabel = (score: number | null | undefined): string => {
    if (score === null || score === undefined) return "Не оценено";
    if (score >= 85) return "Отлично";
    if (score >= 70) return "Хорошо";
    if (score >= 40) return "Удовлетворительно";
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
          {data.teams && data.teams.length > 0 ? (
            data.teams.map((team, idx) => (
              <div key={idx} className="mb-4">
                <div className={styles.teamNameLabel}>{team.name}</div>
                {team.members && team.members.length > 0 && (
                  <div className={styles.teamContainer}>
                    {team.members.map((member, mIdx) => (
                      <div key={mIdx} className={styles.teamMember}>
                        <div className={styles.memberAvatar}>
                          {member
                            .split(" ")
                            .filter((n) => n.length > 0)
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className={styles.memberInfo}>
                          <div className={styles.memberName}>{member}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {team.grade !== undefined && team.grade !== null && (
                  <div className={styles.detailText}>
                    Оценка: {(team.grade ?? 0).toFixed(2)}/100 —{" "}
                    {getGradeLabel(team.grade)}
                  </div>
                )}
              </div>
            ))
          ) : data.teamName ? (
            <>
              <div className={styles.teamNameLabel}>
                {data.teamId ? (
                  <a href={`/team/${data.teamId}`} className={styles.teamLink}>
                    {data.teamName}
                  </a>
                ) : (
                  <p>{data.teamName}</p>
                )}
              </div>
              <div className={styles.teamContainer}>
                {data.teamMembers.map((member, idx) => (
                  <div key={idx} className={styles.teamMember}>
                    <div className={styles.memberAvatar}>
                      {member
                        .split(" ")
                        .filter((n) => n.length > 0)
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className={styles.memberInfo}>
                      <div className={styles.memberName}>{member}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className={styles.detailText}>Команда не назначена</p>
          )}
        </motion.div>

        {/* Mentor */}
        <motion.div
          className={styles.section}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className={styles.sectionTitle}>Автор проекта</h3>
          <div className={styles.detailText}>{data.mentor}</div>
        </motion.div>

        {/* Description */}
        <motion.div
          className={styles.section}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className={styles.sectionTitle}>Описание</h3>
          <div className={styles.detailText}>{data.description}</div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          className={styles.section}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className={styles.sectionTitle}>Стек технологий</h3>
          <div className={styles.detailText}>{data.stack.join(", ")}</div>
        </motion.div>

        {/* Checkpoints
        <motion.div
          className={styles.section}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className={styles.sectionTitle}>Результаты и оценки</h3>
          <div className={styles.checkpointList}>
            {data.checkpoints.map((checkpoint, idx) => (
              <motion.div
                key={checkpoint.id || idx}
                className={styles.checkpointItem}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + idx * 0.05 }}
              >
                <div className={styles.checkpointHeader}>
                  <span className={styles.checkpointTitle}>
                    {checkpoint.title}
                  </span>
                  <span className={styles.checkpointScore}>
                    {(checkpoint.score ?? 0).toFixed(2)}/100
                  </span>
                </div>
                {checkpoint.comment && (
                  <p className={styles.checkpointComment}>
                    {checkpoint.comment}
                  </p>
                )}
              </motion.div>
            ))}

            
            <motion.div
              className={styles.finalGrade}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + data.checkpoints.length * 0.05 }}
            >
              <div className={styles.checkpointHeader}>
                <span className={styles.checkpointTitle}>Итоговая оценка</span>
                <span className={styles.checkpointScore}>
                  {(data.grade ?? 0).toFixed(2)}/100 —{" "}
                  {getGradeLabel(data.grade ?? 0)}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div> */}
      </div>

      <div className={styles.footer}>
        <Button onClick={onClose} variant="outline">
          Закрыть
        </Button>
      </div>
    </Modal>
  );
};
