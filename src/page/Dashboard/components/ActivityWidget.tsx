import styles from "./ActivityWidget.module.css";

export interface Activity {
  id: string;
  icon: string;
  text: string;
  timeAgo: string;
}

interface ActivityWidgetProps {
  activities: Activity[];
}

/**
 * ActivityWidget component - виджет с последней активностью
 * Показывает недавние события в системе
 */
export const ActivityWidget = ({ activities }: ActivityWidgetProps) => {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3 className={styles.title}>Последняя активность</h3>
      </div>
      <div className={styles.activityList}>
        {activities.length > 0 ? (
          activities.map((activity) => (
            <article key={activity.id} className={styles.activityItem}>
              <div
                className={styles.icon}
                role="img"
                aria-label={`Иконка: ${activity.icon}`}
              >
                {activity.icon}
              </div>
              <div className={styles.content}>
                <p className={styles.text}>{activity.text}</p>
                <time className={styles.time}>{activity.timeAgo}</time>
              </div>
            </article>
          ))
        ) : (
          <div className={styles.emptyState}>Нет активности</div>
        )}
      </div>
    </div>
  );
};
