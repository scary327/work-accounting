import { useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import styles from "./NotesList.module.css";

interface Task {
  id: string;
  title: string;
  date: Date;
  type: "deadline" | "meeting" | "review";
  time?: string;
}

const generateMockTasks = (): Task[] => {
  const tasks: Task[] = [];
  const today = new Date();

  // Helper to add days
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Past tasks
  tasks.push({
    id: "p1",
    title: "Ревью кода: Команда Alpha",
    date: addDays(today, -2),
    type: "review",
    time: "14:00",
  });
  tasks.push({
    id: "p2",
    title: "Сдача спринта: Команда Beta",
    date: addDays(today, -1),
    type: "deadline",
    time: "18:00",
  });

  // Today's tasks
  tasks.push({
    id: "t1",
    title: "Дейли митинг",
    date: today,
    type: "meeting",
    time: "10:00",
  });
  tasks.push({
    id: "t2",
    title: "Проверка отчетов",
    date: today,
    type: "review",
    time: "16:30",
  });

  // Future tasks
  tasks.push({
    id: "f1",
    title: "Презентация проекта",
    date: addDays(today, 1),
    type: "meeting",
    time: "11:00",
  });
  tasks.push({
    id: "f2",
    title: "Дедлайн по документации",
    date: addDays(today, 2),
    type: "deadline",
    time: "23:59",
  });
  tasks.push({
    id: "f3",
    title: "Встреча с менторами",
    date: addDays(today, 3),
    type: "meeting",
    time: "15:00",
  });
  tasks.push({
    id: "f4",
    title: "Ревью архитектуры",
    date: addDays(today, 5),
    type: "review",
    time: "13:00",
  });

  return tasks;
};

export const NotesList = () => {
  const tasks = useMemo(() => generateMockTasks(), []);
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
