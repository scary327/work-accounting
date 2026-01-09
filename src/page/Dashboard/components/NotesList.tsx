import { useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import styles from "./NotesList.module.css";
import type { CalendarEvent } from "../../../lib/calendarUtils";

interface Task {
  id: string;
  title: string;
  date: Date;
  type: "deadline" | "meeting" | "review";
  time?: string;
  description?: string;
}

interface NotesListProps {
  events?: CalendarEvent[];
}

export const NotesList = ({ events = [] }: NotesListProps) => {
  const tasks = useMemo(() => {
    // Convert calendar events to Task structure
    return events
      .map((event) => ({
        id: event.id,
        title: event.title,
        date: event.start,
        // Simple heuristic for type, can be improved or removed
        type: "meeting" as const,
        time: event.allDay
          ? "Весь день"
          : event.start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
        description: event.description,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events]);

  const todayRef = useRef<HTMLDivElement>(null);

  // Group tasks by date string
  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {};
    tasks.forEach((task) => {
      const dateKey = task.date.toLocaleDateString("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(task);
    });
    return groups;
  }, [tasks]);

  // Scroll to today on mount
  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className={styles.notesListContainer}>
      <h3 className={styles.title}>Ближайшие дела</h3>
      <div className={styles.listContent}>
        {Object.entries(groupedTasks).map(([dateString, groupTasks]) => {
          const dateObj = groupTasks[0].date;
          const today = isToday(dateObj);

          return (
            <div
              key={dateString}
              className={styles.dateGroup}
              ref={today ? todayRef : null}
            >
              <div
                className={`${styles.dateHeader} ${
                  today ? styles.todayHeader : ""
                }`}
              >
                {today ? "Сегодня, " : ""}
                {dateString}
              </div>
              {groupTasks.map((task) => (
                <motion.div
                  key={task.id}
                  className={styles.taskCard}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className={styles.taskHeader}>
                    <span className={styles.taskTitle}>{task.title}</span>
                    {task.time && (
                      <span className={styles.taskTime}>
                        <Clock size={12} className="inline mr-1" />
                        {task.time}
                      </span>
                    )}
                  </div>
                  <span
                    className={`${styles.taskType} ${
                      styles[`type_${task.type}`]
                    }`}
                  >
                    {task.type === "deadline" && "Дедлайн"}
                    {task.type === "meeting" && "Встреча"}
                    {task.type === "review" && "Ревью"}
                  </span>
                </motion.div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
