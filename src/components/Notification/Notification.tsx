import { useEffect } from "react";
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

export const Notification = ({
  id,
  message,
  type = "info",
  duration = 4000,
  onClose,
}: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const containerVariants = {
    initial: { opacity: 0, x: 400, y: 0 },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 400, y: 0 },
  };

  return createPortal(
    <motion.div
      key={id}
      className={`${styles.notification} ${styles[type]}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
    </motion.div>,
    document.body
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
  return createPortal(
    <div className={styles.container}>
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};
