import { Button } from "../../../components/ui/button";
import styles from "./ArchiveCard.module.css";

export interface ArchiveCardData {
  id: string;
  title: string;
  author: string;
  stack: string;
  status: "accepted" | "rejected";
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

/**
 * ArchiveCard component - карточка для страницы архива
 */
export const ArchiveCard = ({
  card,
  onViewDetails,
  onNominate,
}: ArchiveCardProps) => {
  const isAccepted = card.status === "accepted";

  const handleCardClick = () => {
    if (isAccepted) {
      onViewDetails?.(card.id);
    }
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
      <div className={styles.status}>{isAccepted ? "✅" : "❌"}</div>

      {/* Title */}
      <h3 className={styles.title}>{card.title}</h3>

      {/* Author */}
      <p className={styles.author}>{card.author}</p>

      {/* Stack */}
      <div className={styles.stack}>{card.stack}</div>

      {/* Team Info */}
      {isAccepted && card.teamName && (
        <div className={styles.team}>
          <div className={styles.teamLabel}>{card.teamName}</div>
          <div className={styles.teamMembers}>
            {card.teamMembers?.join(", ")}
          </div>
        </div>
      )}

      {/* Grade */}
      {isAccepted && card.grade !== undefined && (
        <div className={styles.grade}>
          <span className={styles.gradeScore}>{card.grade}/100</span>
          <span className={styles.gradeLabel}>
            {card.grade >= 85
              ? "Отлично"
              : card.grade >= 70
              ? "Хорошо"
              : "Удовлетворительно"}
          </span>
        </div>
      )}

      {/* Button for rejected cases */}
      {!isAccepted && (
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
