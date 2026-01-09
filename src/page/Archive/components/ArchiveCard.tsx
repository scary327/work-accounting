import { Button } from "../../../components/ui/button";
import styles from "./ArchiveCard.module.css";

export interface ArchiveCardData {
  id: string;
  title: string;
  author: string;
  stack: string;
  status: "completed" | "canceled" | "voting" | "approved" | "in_progress";
  teams?: Array<{
    id: string; // or number
    name: string;
    members: string[];
    grade?: number;
  }>;
  // Deprecated fields, kept for compatibility if needed, but better to migrate
  grade?: number;
  teamName?: string;
  teamMembers?: string[];
}

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

interface ArchiveCardProps {
  card: ArchiveCardData;
  onViewDetails?: (cardId: string) => void;
  onNominate?: (cardTitle: string) => void;
}

const statusConfig = {
  completed: { icon: "✅", label: "Завершен" },
  canceled: { icon: "❌", label: "Отменен" },
  voting: { icon: "🗳️", label: "Голосование" },
  approved: { icon: "👍", label: "Одобрен" },
  in_progress: { icon: "🚧", label: "В работе" },
};

/**
 * ArchiveCard component - карточка для страницы архива
 */
export const ArchiveCard = ({
  card,
  onViewDetails,
  onNominate,
}: ArchiveCardProps) => {
  const isCompleted = card.status === "completed";
  const { icon, label } = statusConfig[card.status];

  const handleCardClick = () => {
    onViewDetails?.(card.id);
  };

  const handleNominateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNominate?.(card.title);
  };

  return (
    <div
      className={`${styles.card} ${styles[card.status]}`}
      onClick={handleCardClick}
    >
      {/* Status */}
      <div className={styles.status} title={label}>
        {icon}
      </div>

      {/* Title */}
      <h3 className={styles.title}>{card.title}</h3>

      {/* Team Info (New Format) */}
      {(isCompleted || card.status === "in_progress") &&
        card.teams &&
        card.teams.length > 0 &&
        card.teams.map((team, idx) => (
          <div key={idx} className={styles.team}>
            <div className={styles.teamInfo}>
              <div className={styles.teamLabel}>{team.name}</div>
              <div className={styles.teamMembers}>
                {team.members?.join(", ")}
              </div>
            </div>
            {isCompleted && team.grade !== undefined && team.grade > 0 && (
              <div className={styles.teamGrade} title="Оценка команды">
                {team.grade.toFixed(2)}
              </div>
            )}
          </div>
        ))}

      {/* Team Info (Old Format - Fallback) */}
      {(isCompleted || card.status === "in_progress") &&
        !card.teams &&
        card.teamName && (
          <div className={styles.team}>
            <div className={styles.teamInfo}>
              <div className={styles.teamLabel}>{card.teamName}</div>
              <div className={styles.teamMembers}>
                {card.teamMembers?.join(", ")}
              </div>
            </div>
            {/* Grade is now rendered next to team name if possible, or below if kept as separate block. 
                But since we want "grade right of team", let's move it here or keep it below? 
                The user requested "grade right of team". */}
          </div>
        )}

      {/* Grade (Old Format - Only if no teams array provided to avoid duplication) */}
      {isCompleted &&
        !card.teams &&
        card.grade !== undefined &&
        card.grade > 0 && (
          <div className={styles.grade}>
            <span className={styles.gradeScore}>
              {(card.grade ?? 0).toFixed(2)}/100
            </span>
            <span className={styles.gradeLabel}>
              {card.grade >= 85
                ? "Отлично"
                : card.grade >= 70
                ? "Хорошо"
                : card.grade >= 40
                ? "Удовлетворительно"
                : "Неудовлетворительно"}
            </span>
          </div>
        )}

      {/* Button for canceled cases */}
      {card.status === "canceled" && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNominateClick}
          className={styles.btn}
        >
          Выдвинуть на новый семестр
        </Button>
      )}
    </div>
  );
};
