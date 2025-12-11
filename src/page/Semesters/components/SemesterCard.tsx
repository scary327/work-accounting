import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Tooltip } from "../../../components/ui/tooltip";
import type { Semester } from "../types";
import styles from "../Semesters.module.css";

interface SemesterCardProps {
  semester: Semester;
  onEdit: (semester: Semester) => void;
  onDelete: (id: number) => void;
  onActivate: (id: number) => void;
}

export const SemesterCard = ({
  semester,
  onEdit,
  onDelete,
  onActivate,
}: SemesterCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`${styles.semesterCard} ${
        semester.isActive ? styles.activeCard : ""
      }`}
    >
      <div className={styles.cardHeader}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className={styles.semesterName} style={{ marginBottom: 0 }}>
              {semester.name}
            </h3>
            {semester.isActive && (
              <Tooltip content="Это активный семестр">
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] cursor-help" />
              </Tooltip>
            )}
          </div>
          <div className={styles.semesterDates}>
            <span>{formatDate(semester.startsAt)}</span>
            <span>—</span>
            <span>{formatDate(semester.endsAt)}</span>
          </div>
        </div>
      </div>

      <div className={styles.cardActions}>
        <Button
          variant="primary"
          size="md"
          className={styles.actionBtn}
          onClick={() => onEdit(semester)}
        >
          Изменить
        </Button>
        <Button
          variant="outline"
          size="md"
          className={styles.actionBtn}
          onClick={() => onDelete(semester.id)}
        >
          Удалить
        </Button>
      </div>
    </motion.div>
  );
};
