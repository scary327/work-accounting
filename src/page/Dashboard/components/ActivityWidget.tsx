import { motion } from "framer-motion";
import { Activity as ActivityIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

/**
 * ActivityWidget component - виджет с последней активностью
 * Показывает недавние события в системе
 */
export const ActivityWidget = ({ activities }: ActivityWidgetProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className={styles.widget}>
        <CardHeader className={styles.header}>
          <CardTitle className={`${styles.title} flex items-center gap-2`}>
            <ActivityIcon className="h-5 w-5" />
            Последняя активность
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <motion.div
            className={styles.activityList}
            variants={container}
            initial="hidden"
            animate="show"
          >
            {activities.length > 0 ? (
              activities.map((activity) => (
                <motion.article
                  key={activity.id}
                  variants={item}
                  className={styles.activityItem}
                  whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.02)" }}
                >
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
                </motion.article>
              ))
            ) : (
              <div className={styles.emptyState}>Нет активности</div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
