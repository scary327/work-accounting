import styles from "./NewCalendar.module.css";

interface NewCalendarProps {
  url: string;
}

export const NewCalendar = ({ url }: NewCalendarProps) => {
  return (
    <div className={styles.calendarContainer}>
      <iframe
        src={url}
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: "1px solid #eee", minHeight: "600px" }}
        title="Yandex Calendar"
      ></iframe>
    </div>
  );
};
