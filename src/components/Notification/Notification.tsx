import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Notification.module.css";

export type NotificationType = "success" | "error" | "info";

export interface NotificationProps {
  id: string;
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose: (id: string) => void;
}

const Notification = ({
  id,
  message,
  type = "info",
  duration = 4000,
  onClose,
}: NotificationProps) => {
  // Используем useEffect для таймера закрытия
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <motion.div
      layout
      // Начальное состояние: справа за экраном, прозрачное
      initial={{ x: "100%", opacity: 0 }}
      // Анимация появления: выезжает налево, полная непрозрачность
      animate={{ x: 0, opacity: 1 }}
      // Анимация исчезновения: уезжает обратно направо
      exit={{ x: "120%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`${styles.notification} ${styles[type]}`}
    >
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
      </div>

      <button
        className={styles.closeButton}
        onClick={() => onClose(id)}
        aria-label="Close notification"
      >
        ✕
      </button>

      {/* Полоска прогресса */}
      <motion.div
        className={styles.progressBar}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        style={{ transformOrigin: "left" }} // Уменьшается к левому краю
      />
    </motion.div>
  );
};

interface NotificationContainerProps {
  notifications: NotificationProps[];
  onClose: (id: string) => void;
}

export const NotificationContainer = ({
  notifications,
  onClose,
}: NotificationContainerProps) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Создаем контейнер один раз при маунте
    let element = document.getElementById("notification-portal");

    if (!element) {
      element = document.createElement("div");
      element.id = "notification-portal";
      element.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        z-index: 9999;
        pointer-events: none; /* Пропускаем клики сквозь контейнер */
        width: auto;
        max-width: 100vw;
        overflow-x: hidden; /* Чтобы вылетающие элементы не создавали скролл */
        padding-right: 4px; /* Небольшой отступ для теней */
      `;
      document.body.appendChild(element);
    }

    setContainer(element);

    // Опционально: очистка при размонтировании всего приложения
    // return () => {
    //   if (element && document.body.contains(element)) {
    //     document.body.removeChild(element);
    //   }
    // };
  }, []);

  if (!container) return null;

  return createPortal(
    <AnimatePresence mode="popLayout" initial={false}>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={onClose}
        />
      ))}
    </AnimatePresence>,
    container
  );
};
