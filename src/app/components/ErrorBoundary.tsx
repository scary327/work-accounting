import { useRouteError } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import styles from "./SystemPage.module.css";

export const ErrorBoundary = () => {
  useRouteError();

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={styles.card}
      >
        <h2 className={styles.title} style={{ color: "#ef4444" }}>
          Что-то пошло не так
        </h2>
        <p className={styles.description}>
          Произошла непредвиденная ошибка. Пожалуйста, попробуйте обновить
          страницу.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="w-full"
          variant="default"
        >
          Обновить страницу
        </Button>
      </motion.div>
    </div>
  );
};
