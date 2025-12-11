import { useState, useCallback } from "react";
import type {
  NotificationProps,
  NotificationType,
} from "../components/Notification";

interface UseNotificationsReturn {
  notifications: NotificationProps[];
  addNotification: (
    message: string,
    type?: NotificationType,
    duration?: number
  ) => string;
  removeNotification: (id: string) => void;
}

let notificationId = 0;

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = useCallback(
    (
      message: string,
      type: NotificationType = "info",
      duration = 4000
    ): string => {
      const id = `notification-${notificationId++}`;

      const notification: NotificationProps = {
        id,
        message,
        type,
        duration,
        onClose: () => {}, // Will be set in the component
      };

      setNotifications((prev) => [...prev, notification]);
      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  return {
    notifications: notifications.map((notif) => ({
      ...notif,
      onClose: removeNotification,
    })),
    addNotification,
    removeNotification,
  };
};
