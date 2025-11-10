import styles from "./CaseModal.module.css";

export interface Comment {
  id: string;
  author: string;
  text: string;
}

export interface CaseModalData {
  id: string;
  title: string;
  author: string;
  description: string;
  goals: string[];
  stack: string;
  teamSize: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  userVote?: "up" | "down" | null;
}

interface CaseModalProps {
  isOpen: boolean;
  data?: CaseModalData;
  onClose: () => void;
  onVoteUp?: (caseId: string) => void;
  onVoteDown?: (caseId: string) => void;
  onCommentSubmit?: (caseId: string, comment: string) => void;
}

/**
 * CaseModal component - модальное окно с детальной информацией о кейсе
 */
export const CaseModal = ({
  isOpen,
  data,
  onClose,
  onVoteUp,
  onVoteDown,
  onCommentSubmit,
}: CaseModalProps) => {
  if (!isOpen || !data) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleVoteUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVoteUp?.(data.id);
  };

  const handleVoteDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVoteDown?.(data.id);
  };

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector(
      "textarea"
    ) as HTMLTextAreaElement;
    if (input && input.value.trim()) {
      onCommentSubmit?.(data.id, input.value);
      input.value = "";
    }
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
          <div className={styles.left}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Автор</h3>
              <p className={styles.text}>{data.author}</p>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Описание</h3>
              <p className={styles.text}>{data.description}</p>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Цели проекта</h3>
              <ul className={styles.goalsList}>
                {data.goals.map((goal, idx) => (
                  <li key={idx} className={styles.goalsItem}>
                    {goal}
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Стек технологий</h3>
              <p className={styles.text}>{data.stack}</p>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Требуемый размер команды</h3>
              <p className={styles.text}>{data.teamSize}</p>
            </section>
          </div>

          <div className={styles.right}>
            <div className={styles.votingSection}>
              <h3 className={styles.votingTitle}>Голосование</h3>
              <div className={styles.voteButtons}>
                <button
                  className={`${styles.voteBtn} ${
                    data.userVote === "up" ? styles.votedUp : ""
                  }`}
                  onClick={handleVoteUp}
                  type="button"
                  title="Поддержать"
                >
                  👍
                </button>
                <button
                  className={`${styles.voteBtn} ${
                    data.userVote === "down" ? styles.votedDown : ""
                  }`}
                  onClick={handleVoteDown}
                  type="button"
                  title="Не поддержать"
                >
                  👎
                </button>
              </div>
              <div className={styles.voteStats}>
                За: {data.upvotes} • Против: {data.downvotes}
              </div>
            </div>

            <div className={styles.commentsSection}>
              <h3 className={styles.commentsTitle}>
                Комментарии ({data.comments.length})
              </h3>
              <div className={styles.commentsList}>
                {data.comments.map((comment) => (
                  <div key={comment.id} className={styles.comment}>
                    <div className={styles.commentAuthor}>{comment.author}</div>
                    <div className={styles.commentText}>{comment.text}</div>
                  </div>
                ))}
              </div>
              <form
                onSubmit={handleCommentSubmit}
                className={styles.commentForm}
              >
                <textarea
                  className={styles.commentInput}
                  placeholder="Написать комментарий..."
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  Отправить комментарий
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
