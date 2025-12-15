import { NewCalendar } from "./components/NewCalendar";
import { NotesList } from "./components/NotesList";
import styles from "./Dashboard.module.css";

/**
 * Dashboard component - главная страница приложения
 * Отображает календарь и список ближайших дел
 */
export const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.contentWrapper}>
        <div className={styles.calendarSection}>
          <NewCalendar />
        </div>
        <div className={styles.notesSection}>
          <NotesList />
        </div>
      </div>
    </div>
  );
};
