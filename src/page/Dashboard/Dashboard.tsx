import { CalendarComponent } from "./components/CustomCalendar/CalendarComponent";

import styles from "./Dashboard.module.css";

/**
 * Dashboard component - главная страница приложения
 * Отображает календарь с событиями
 */
export const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.contentWrapper}>
        <div className={styles.calendarSection}>
          <div className="relative h-full flex flex-col">
            {/* <NewCalendar url={CALENDAR_URL_KEY} /> */}
            <CalendarComponent></CalendarComponent>
          </div>
        </div>
      </div>
    </div>
  );
};
