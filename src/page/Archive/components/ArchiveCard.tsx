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

interface ArchiveCardProps {
  card: ArchiveCardData;
  onViewDetails?: (cardId: string) => void;
  onNominate?: (cardTitle: string) => void;
}

/**
 * ArchiveCard component - карточка архивированного кейса
 */
export const ArchiveCard = ({
  card,
  onViewDetails,
  onNominate,
}: ArchiveCardProps) => {
  const statusEmoji = card.status === "accepted" ? "✅" : "❌";
  const isAccepted = card.status === "accepted";

  const handleClick = () => {
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
      onClick={handleClick}
      role={isAccepted ? "button" : undefined}
      tabIndex={isAccepted ? 0 : undefined}
      onKeyDown={
        isAccepted
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
    >
      <div className={styles.status}>{statusEmoji}</div>

      <h3 className={styles.title}>{card.title}</h3>
      <p className={styles.author}>{card.author}</p>
      <span className={styles.stack}>{card.stack}</span>

      {isAccepted ? (
        <>
          {card.teamName && (
            <div className={styles.team}>
              <div className={styles.teamLabel}>{card.teamName}</div>
              {card.teamMembers && (
                <div className={styles.teamMembers}>
                  {card.teamMembers.join(", ")}
                </div>
              )}
            </div>
          )}

          {card.grade !== undefined && (
            <div className={styles.grade}>
              <div className={styles.gradeScore}>{card.grade}</div>
              <div className={styles.gradeLabel}>
                {getGradeLabel(card.grade)}
              </div>
            </div>
          )}
        </>
      ) : (
        <button
          className={`${styles.btn} ${styles.secondary}`}
          onClick={handleNominateClick}
          type="button"
        >
          Выдвинуть на новый семестр
        </button>
      )}
    </div>
  );
};

function getGradeLabel(score: number): string {
  if (score >= 85) return "Отлично";
  if (score >= 70) return "Хорошо";
  if (score >= 55) return "Удовлетворительно";
  return "Неудовлетворительно";
}
