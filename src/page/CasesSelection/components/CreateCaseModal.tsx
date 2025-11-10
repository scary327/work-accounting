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

/**
 * CreateCaseModal component - модальное окно для создания нового кейса
 */
export const CreateCaseModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateCaseModalProps) => {
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
    <div
      className={`${styles.modal} ${isOpen ? styles.active : ""}`}
      onClick={handleBackdropClick}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>Предложить новый кейс</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            type="button"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Название кейса <span className={styles.required}>*</span>
            </label>
            <input
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
              className={styles.textarea}
              placeholder="Опишите суть проекта, задачи и ожидаемые результаты"
              rows={5}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="stack" className={styles.label}>
              Стек технологий
            </label>
            <input
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
            <input
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
            <button
              type="button"
              className={`${styles.btn} ${styles.secondary}`}
              onClick={onClose}
            >
              Отмена
            </button>
            <button type="submit" className={`${styles.btn} ${styles.primary}`}>
              Создать кейс
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
