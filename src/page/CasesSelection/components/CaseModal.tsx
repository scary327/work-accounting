import { AnimatePresence, motion } from "framer-motion";
import { X, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../../../components/ui/button";
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
  semester: string;
  stack: string;
  teamSize: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  userVote?: boolean | null;
}

interface CaseModalProps {
  isOpen: boolean;
  data?: CaseModalData;
  onClose: () => void;
  onVoteUp?: (caseId: string) => void;
  onVoteDown?: (caseId: string) => void;
  onCommentSubmit?: (caseId: string, comment: string) => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export const CaseModal = ({
  isOpen,
  data,
  onClose,
  onVoteUp,
  onVoteDown,
  onCommentSubmit,
}: CaseModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleVoteUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVoteUp?.(data!.id);
  };

  const handleVoteDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVoteDown?.(data!.id);
  };

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector(
      "textarea"
    ) as HTMLTextAreaElement;
    if (input && input.value.trim()) {
      onCommentSubmit?.(data!.id, input.value);
      input.value = "";
    }
  };

  console.log(data);

  return (
    <AnimatePresence>
      {isOpen && data && (
        <motion.div
          className={styles.modal}
          onClick={handleBackdropClick}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={styles.content}
            variants={modalVariants}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2 className={styles.headerTitle}>{data.title}</h2>
              <Button
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </Button>
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
                  <h3 className={styles.sectionTitle}>Семестр</h3>
                  <p className={styles.text}>{data.semester}</p>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Стек технологий</h3>
                  <p className={styles.text}>{data.stack}</p>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    Требуемый размер команды
                  </h3>
                  <p className={styles.text}>{data.teamSize}</p>
                </section>
              </div>

              <div className={styles.right}>
                <div className={styles.votingSection}>
                  <h3 className={styles.votingTitle}>Голосование</h3>
                  <div className={styles.voteButtons}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${styles.actionBtn} ${
                        data.userVote === true ? styles.activeUp : ""
                      } hover:bg-transparent`}
                      onClick={handleVoteUp}
                      title="Поддержать кейс"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      <span>{data.upvotes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${styles.actionBtn} ${
                        data.userVote === false ? styles.activeDown : ""
                      } hover:bg-transparent`}
                      onClick={handleVoteDown}
                      title="Не поддержать кейс"
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      <span>{data.downvotes}</span>
                    </Button>
                  </div>
                </div>

                <div className={styles.commentsSection}>
                  <h3 className={styles.commentsTitle}>
                    Комментарии ({data.comments.length})
                  </h3>
                  <div className={styles.commentsList}>
                    {data.comments.map((comment) => (
                      <div key={comment.id} className={styles.comment}>
                        <div className={styles.commentAuthor}>
                          {comment.author}
                        </div>
                        <div className={styles.commentText}>{comment.text}</div>
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={handleCommentSubmit}
                    className={styles.commentForm}
                  >
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Написать комментарий..."
                      rows={3}
                      required
                    />
                    <Button
                      type="submit"
                      className={`${styles.btn} ${styles.btnPrimary} mt-2 w-full`}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Отправить комментарий
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
