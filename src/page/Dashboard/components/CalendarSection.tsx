import styles from "./CalendarSection.module.css";

interface CalendarSectionProps {
  onTodayClick?: () => void;
  onCreateEventClick?: () => void;
}

/**
 * CalendarSection component - секция календаря событий
 * Отображает интеграцию с Google Calendar
 */
export const CalendarSection = ({
  onTodayClick,
  onCreateEventClick,
}: CalendarSectionProps) => {
  return (
    <section className={styles.calendarSection}>
      <div className={styles.calendarHeader}>
        <h2 className={styles.title}>Календарь событий</h2>
        <div className={styles.controls}>
          <button
            className={`${styles.btn} ${styles.secondary}`}
            onClick={onTodayClick}
            type="button"
          >
            Сегодня
          </button>
          <button
            className={`${styles.btn} ${styles.primary}`}
            onClick={onCreateEventClick}
            type="button"
          >
            + Создать событие
          </button>
        </div>
      </div>
      <div className={styles.placeholder}>
        <span className={styles.placeholderText}>
          Google Calendar интеграция
        </span>
      </div>
    </section>
  );
};
