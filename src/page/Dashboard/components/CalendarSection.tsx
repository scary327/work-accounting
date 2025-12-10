import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={styles.calendarSection}>
        <CardHeader
          className={`${styles.calendarHeader} flex-row items-center justify-between space-y-0 pb-4`}
        >
          <CardTitle className={styles.title}>Календарь событий</CardTitle>
          <div className={styles.controls}>
            <Button
              variant="outline"
              className={`${styles.btn} ${styles.secondary}`}
              onClick={onTodayClick}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Сегодня
            </Button>
            <Button
              className={`${styles.btn} ${styles.primary}`}
              onClick={onCreateEventClick}
            >
              <Plus className="mr-2 h-4 w-4" />
              Создать событие
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className={styles.placeholder}>
            <span className={styles.placeholderText}>
              Google Calendar интеграция
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
