import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CalendarSection,
  TeamWidget,
  ActivityWidget,
  type Team,
  type Activity,
} from "./components";
import styles from "./Dashboard.module.css";

/**
 * Dashboard component - главная страница приложения
 * Отображает календарь, команды пользователя и последнюю активность
 */
export const Dashboard = () => {
  // Моковые данные команд
  const teams: Team[] = useMemo(
    () => [
      {
        id: "team-1",
        name: "Команда Alpha",
        caseTitle: "Система аналитики транзакций",
      },
      {
        id: "team-2",
        name: "Команда Beta",
        caseTitle: "Мобильное приложение для инвестиций",
      },
    ],
    []
  );

  // Моковые данные активности
  const activities: Activity[] = useMemo(
    () => [
      {
        id: "activity-1",
        icon: "💬",
        text: 'Новый комментарий к кейсу "API Gateway"',
        timeAgo: "2 часа назад",
      },
      {
        id: "activity-2",
        icon: "✅",
        text: 'Кейс "Система аналитики" утверждён',
        timeAgo: "5 часов назад",
      },
      {
        id: "activity-3",
        icon: "👍",
        text: "Иван Петров поддержал ваш кейс",
        timeAgo: "1 день назад",
      },
    ],
    []
  );

  // Обработчики событий
  const handleTodayClick = useCallback(() => {
    console.log('Нажата кнопка "Сегодня"');
    // TODO: Реализовать логику
  }, []);

  const handleCreateEventClick = useCallback(() => {
    console.log('Нажата кнопка "Создать событие"');
    // TODO: Реализовать логику
  }, []);

  const handleTeamClick = useCallback((teamId: string) => {
    console.log("Клик на команду:", teamId);
    // TODO: Реализовать логику навигации
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Main content */}
          <motion.main
            className={styles.mainContent}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CalendarSection
              onTodayClick={handleTodayClick}
              onCreateEventClick={handleCreateEventClick}
            />
          </motion.main>

          {/* Sidebar */}
          <motion.aside
            className={styles.sidebar}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <TeamWidget teams={teams} onTeamClick={handleTeamClick} />
            <ActivityWidget activities={activities} />
          </motion.aside>
        </div>
      </div>
    </div>
  );
};
