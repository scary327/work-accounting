import { AnimatePresence, motion } from "framer-motion";
import { X, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { type UserDto } from "../../../api/usersApi";
import { useUsers } from "../../../api/hooks/useUsers";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
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
  status?: string;
  mentorIds?: number[];
  mentors?: { id: number; fio: string }[];
}

interface CaseModalProps {
  isOpen: boolean;
  data?: CaseModalData;
  onClose: () => void;
  onVoteUp?: (caseId: string) => void;
  onVoteDown?: (caseId: string) => void;
  onCommentSubmit?: (caseId: string, comment: string) => void;
  onDeleteProject?: (caseId: string) => void;
  onEditProject?: (
    caseId: string,
    data: {
      title: string;
      description: string;
      techStack: string;
      mentorIds: number[];
    }
  ) => void;
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
  onDeleteProject,
  onEditProject,
}: CaseModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    stack: "",
  });

  // Use cached users query
  const { data: users = [] } = useUsers(isOpen && isEditing);
  const [selectedMentors, setSelectedMentors] = useState<UserDto[]>([]);
  const [mentorSearch, setMentorSearch] = useState("");

  useEffect(() => {
    if (isOpen && data) {
      setEditFormData({
        title: data.title,
        description: data.description,
        stack: data.stack,
      });
      setIsEditing(false);
    }
  }, [isOpen, data]);

  // Update selected mentors when users are loaded or modal opens
  useEffect(() => {
    if (isOpen && isEditing && users.length > 0 && data?.mentorIds) {
      const initialMentors = users.filter((user) =>
        data.mentorIds?.includes(user.id)
      );
      setSelectedMentors(initialMentors);
    } else if (isOpen && isEditing && users.length > 0 && !data?.mentorIds) {
      setSelectedMentors([]);
    }
  }, [isOpen, isEditing, users, data?.mentorIds]);

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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onEditProject && data) {
      onEditProject(data.id, {
        title: editFormData.title,
        description: editFormData.description,
        techStack: editFormData.stack,
        mentorIds: selectedMentors.map((m) => m.id),
      });
      setIsEditing(false);
    }
  };

  const toggleMentor = (user: UserDto) => {
    if (selectedMentors.find((m) => m.id === user.id)) {
      setSelectedMentors(selectedMentors.filter((m) => m.id !== user.id));
    } else {
      setSelectedMentors([...selectedMentors, user]);
    }
  };

  const filteredUsers = users.filter((u) => {
    const fullName =
      `${u.lastName} ${u.firstName} ${u.middleName}`.toLowerCase();
    return (
      !selectedMentors.find((m) => m.id === u.id) &&
      fullName.includes(mentorSearch.toLowerCase())
    );
  });

  const handleDelete = () => {
    if (window.confirm("Удалить проект?")) {
      onDeleteProject?.(data!.id);
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
                {!isEditing && (
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                    >
                      Удалить
                    </Button>
                  </div>
                )}

                {isEditing ? (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Название
                      </label>
                      <Input
                        value={editFormData.title}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            title: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Описание
                      </label>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={editFormData.description}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            description: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Стек
                      </label>
                      <Input
                        value={editFormData.stack}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            stack: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Менторы
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedMentors.map((mentor) => (
                          <Badge
                            key={mentor.id}
                            variant="secondary"
                            className="pr-1 gap-1"
                          >
                            {mentor.lastName} {mentor.firstName}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 rounded-full hover:bg-transparent"
                              onClick={() => toggleMentor(mentor)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Поиск ментора..."
                          value={mentorSearch}
                          onChange={(e) => setMentorSearch(e.target.value)}
                        />
                        {mentorSearch && (
                          <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto z-50">
                            {filteredUsers.length > 0 ? (
                              filteredUsers.map((user) => (
                                <div
                                  key={user.id}
                                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                                  onClick={() => {
                                    toggleMentor(user);
                                    setMentorSearch("");
                                  }}
                                >
                                  {user.lastName} {user.firstName}{" "}
                                  {user.middleName}
                                </div>
                              ))
                            ) : (
                              <div className="p-2 text-sm text-gray-500">
                                Ничего не найдено
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Сохранить</Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                      >
                        Отмена
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <section className={styles.section}>
                      <h3 className={styles.sectionTitle}>Автор проекта</h3>
                      <p className={styles.text}>{data.author}</p>
                    </section>

                    {data.mentors && data.mentors.length > 0 && (
                      <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Менторы</h3>
                        <div className={styles.mentorsList}>
                          {data.mentors.map((m) => {
                            const mentorName = m.fio || "";
                            return (
                              <div key={m.id} className={styles.mentorItem}>
                                {mentorName}
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}

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
                  </>
                )}
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
