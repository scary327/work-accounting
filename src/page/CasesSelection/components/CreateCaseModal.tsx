import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import styles from "./CreateCaseModal.module.css";

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (formData: {
    title: string;
    description: string;
    stack: string;
    teamSize: number;
  }) => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export const CreateCaseModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateCaseModalProps) => {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit?.({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      stack: formData.get("stack") as string,
      teamSize: parseInt(formData.get("teamSize") as string, 10),
    });
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
              <h2 className={styles.headerTitle}>Предложить новый кейс</h2>
              <Button
                variant="ghost"
                size="icon"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                  Название кейса <span className={styles.required}>*</span>
                </label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  className={styles.input}
                  placeholder="Введите название проекта"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  Описание <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Опишите суть проекта, задачи и ожидаемые результаты"
                  rows={5}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="stack" className={styles.label}>
                  Стек технологий
                </label>
                <Input
                  id="stack"
                  type="text"
                  name="stack"
                  className={styles.input}
                  placeholder="React, Node.js, PostgreSQL, Docker..."
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="teamSize" className={styles.label}>
                  Размер команды <span className={styles.required}>*</span>
                </label>
                <Input
                  id="teamSize"
                  type="number"
                  name="teamSize"
                  className={styles.input}
                  placeholder="4"
                  min="1"
                  required
                />
              </div>

              <div className={styles.actions}>
                <Button
                  type="button"
                  variant="outline"
                  className={`${styles.btn} ${styles.secondary}`}
                  onClick={onClose}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  className={`${styles.btn} ${styles.primary}`}
                >
                  Создать кейс
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
