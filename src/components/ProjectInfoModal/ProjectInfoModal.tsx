import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { type UserDto } from "../../api/usersApi";
import { useUsers } from "../../api/hooks/useUsers";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { TeamGradesRow } from "../TeamGradesRow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import styles from "./ProjectInfoModal.module.css";

export interface Comment {
  id: string;
  author: string;
  text: string;
}

export interface ProjectInfoModalData {
  id: string;
  title: string;
  author: string;
  description: string;
  semester: string;
  stack: string;
  teamSize?: number;
  upvotes?: number;
  downvotes?: number;
  comments?: Comment[];
  userVote?: boolean | null;
  // Extra fields for Archive
  status?: string;
  rawStatus?: string;
  mentors?: string;
  mentorsList?: Array<{ id: number; fio: string }>;
  mentorIds?: number[];
  teamName?: string;
  teamMembers?: string[];
  teams?: Array<{
    id: string;
    name: string;
    members: string[];
    grade?: number | null;
  }>;
  grade?: number;
  creatorId?: string | number;
  projectId?: string | number;
}

interface ProjectInfoModalProps {
  isOpen: boolean;
  data?: ProjectInfoModalData;
  onClose: () => void;
  onVoteUp?: (caseId: string) => void;
  onVoteDown?: (caseId: string) => void;
  onCommentSubmit?: (caseId: string, comment: string) => void;
  onStatusChange?: (caseId: string, status: string) => void;
  // New props for management
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
  readOnly?: boolean;
  isOwner?: boolean;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export const ProjectInfoModal = ({
  isOpen,
  data,
  onClose,
  onVoteUp,
  onVoteDown,
  onCommentSubmit,
  onStatusChange,
  onDeleteProject,
  onEditProject,
  readOnly = false,
  isOwner = false,
}: ProjectInfoModalProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editFormData, setEditFormData] = React.useState({
    title: "",
    description: "",
    stack: "",
  });

  // Use cached users query
  const { data: users = [] } = useUsers(isOpen && isOwner && !readOnly);
  const [selectedMentors, setSelectedMentors] = React.useState<UserDto[]>([]);
  const [mentorSearch, setMentorSearch] = React.useState("");

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
    if (isOpen && isOwner && !readOnly && users.length > 0 && data?.mentorIds) {
      const initialMentors = users.filter((user) =>
        data.mentorIds?.includes(user.id)
      );
      setSelectedMentors(initialMentors);
    } else if (
      isOpen &&
      isOwner &&
      !readOnly &&
      users.length > 0 &&
      !data?.mentorIds
    ) {
      setSelectedMentors([]);
    }
  }, [isOpen, isOwner, readOnly, users, data?.mentorIds]);

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

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Вы уверены, что хотите удалить этот проект? Это действие необратимо."
      )
    ) {
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

  const handleStatusChange = (value: string) => {
    if (data && onStatusChange && value !== data.rawStatus) {
      onStatusChange(data.id, value);
    }
  };

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
                {!readOnly && !isEditing && (
                  <div className={styles.actionButtons}>
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
                  <form onSubmit={handleEditSubmit} className={styles.editForm}>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Название
                      </label>
                      <input
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Описание
                      </label>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditChange}
                        required
                        rows={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Стек технологий
                      </label>
                      <input
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        name="stack"
                        value={editFormData.stack}
                        onChange={handleEditChange}
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
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
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
                    <div className="flex gap-2 justify-end mt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                      >
                        Отмена
                      </Button>
                      <Button type="submit">Сохранить</Button>
                    </div>
                  </form>
                ) : (
                  <>
                    {isOwner ? (
                      <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Статус проекта</h3>
                        <Select
                          value={data.rawStatus}
                          onValueChange={handleStatusChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите статус" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VOTING">Голосование</SelectItem>
                            <SelectItem value="APPROVED">Принятые</SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              В процессе
                            </SelectItem>
                            <SelectItem value="ARCHIVED_COMPLETED">
                              Завершенные
                            </SelectItem>
                            <SelectItem value="ARCHIVED_CANCELED">
                              Отмененные
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </section>
                    ) : (
                      data.status && (
                        <section className={styles.section}>
                          <h3 className={styles.sectionTitle}>Статус</h3>
                          <p className={styles.text}>{data.status}</p>
                        </section>
                      )
                    )}

                    <section className={styles.section}>
                      <h3 className={styles.sectionTitle}>Автор</h3>
                      <p className={styles.text}>{data.author}</p>
                    </section>

                    {(data.mentorsList && data.mentorsList.length > 0) ||
                    data.mentors ? (
                      <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Менторы</h3>
                        {data.mentorsList && data.mentorsList.length > 0 ? (
                          <div className={styles.mentorsList}>
                            {data.mentorsList.map((m) => (
                              <div key={m.id} className={styles.mentorItem}>
                                {m.fio}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className={styles.text}>
                            {data.mentors || "Не указаны"}
                          </p>
                        )}
                      </section>
                    ) : null}

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

                    {data.teamSize && (
                      <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                          Требуемый размер команды
                        </h3>
                        <p className={styles.text}>{data.teamSize}</p>
                      </section>
                    )}

                    {data.teams && data.teams.length > 0 ? (
                      <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Команды</h3>
                        <div className={styles.teamsList}>
                          {data.teams.map((team, idx) => (
                            <TeamGradesRow
                              key={team.id || idx}
                              teamId={team.id}
                              projectId={data.id}
                              teamName={team.name}
                              averageRating={team.grade}
                              members={team.members}
                            />
                          ))}
                        </div>
                      </section>
                    ) : data.teamName ? (
                      <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Команда</h3>
                        <div className={styles.teamNameLabel}>
                          {data.teamName}
                        </div>
                        {data.teamMembers && data.teamMembers.length > 0 && (
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
                                  <div className={styles.memberName}>
                                    {member}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    ) : null}

                    {data.grade !== undefined && data.grade > 0 && (
                      <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Оценка</h3>
                        <p className={styles.text}>
                          {(data.grade ?? 0).toFixed(2)}/100
                        </p>
                      </section>
                    )}
                  </>
                )}
              </div>

              <div className={styles.right}>
                {!readOnly && (
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
                        <span>{data.upvotes || 0}</span>
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
                        <span>{data.downvotes || 0}</span>
                      </Button>
                    </div>
                  </div>
                )}

                <div className={styles.commentsSection}>
                  <h3 className={styles.commentsTitle}>
                    Комментарии ({data.comments?.length || 0})
                  </h3>
                  <div className={styles.commentsList}>
                    {data.comments?.map((comment) => (
                      <div key={comment.id} className={styles.comment}>
                        <div className={styles.commentAuthor}>
                          {comment.author}
                        </div>
                        <div className={styles.commentText}>{comment.text}</div>
                      </div>
                    ))}
                    {(!data.comments || data.comments.length === 0) && (
                      <div className="text-gray-500 text-sm text-center py-4">
                        Нет комментариев
                      </div>
                    )}
                  </div>
                  {!readOnly && (
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
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
