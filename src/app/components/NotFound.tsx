import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import styles from "./SystemPage.module.css";

export const NotFound = () => {
  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={styles.card}
      >
        <div className={styles.errorCode}>404</div>
        <h2 className={styles.title}>Страница не найдена</h2>
        <p className={styles.description}>
          К сожалению, запрашиваемая вами страница не существует или была
          перемещена.
        </p>
        <Button asChild className="w-full" size="lg">
          <Link to="/">Вернуться на главную</Link>
        </Button>
      </motion.div>
    </div>
  );
};
