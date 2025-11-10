import styles from "./CaseCard.module.css";

export interface CaseCardData {
  id: string;
  title: string;
  author: string;
  authorInitials: string;
  description: string;
  stack: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  userVote?: "up" | "down" | null;
}

interface CaseCardProps {
  card: CaseCardData;
  onCardClick?: (cardId: string) => void;
  onUpvote?: (cardId: string) => void;
  onDownvote?: (cardId: string) => void;
  onComments?: (cardId: string) => void;
}

/**
 * CaseCard component - карточка с описанием кейса
 */
export const CaseCard = ({
  card,
  onCardClick,
  onUpvote,
  onDownvote,
  onComments,
}: CaseCardProps) => {
  const handleClick = () => {
    onCardClick?.(card.id);
  };

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpvote?.(card.id);
  };

  const handleDownvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownvote?.(card.id);
  };

  const handleCommentsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComments?.(card.id);
  };

  return (
    <article
      className={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className={styles.header}>
        <div className={styles.avatar}>{card.authorInitials}</div>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>{card.title}</h3>
          <p className={styles.author}>{card.author}</p>
        </div>
      </div>

      <p className={styles.description}>{card.description}</p>
      <span className={styles.stack}>{card.stack}</span>

      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${
            card.userVote === "up" ? styles.activeUp : ""
          }`}
          onClick={handleUpvoteClick}
          type="button"
          title="Поддержать кейс"
        >
          👍 <span>{card.upvotes}</span>
        </button>
        <button
          className={`${styles.actionBtn} ${
            card.userVote === "down" ? styles.activeDown : ""
          }`}
          onClick={handleDownvoteClick}
          type="button"
          title="Не поддержать кейс"
        >
          👎 <span>{card.downvotes}</span>
        </button>
        <button
          className={styles.actionBtn}
          onClick={handleCommentsClick}
          type="button"
          title="Комментарии"
        >
          💬 <span>{card.comments}</span>
        </button>
      </div>
    </article>
  );
};
