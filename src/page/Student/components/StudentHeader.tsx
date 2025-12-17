import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import styles from "./StudentHeader.module.css";

interface StudentHeaderProps {
  student: {
    name: string;
    avatar: string;
    projectsCompleted: number;
    averageGrade: number;
    currentTeam: string | null;
    description: string;
    telegram?: string;
  };
}

/**
 * StudentHeader component - шапка профиля студента с основной информацией
 */
export const StudentHeader = ({ student }: StudentHeaderProps) => {
  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.breadcrumb}>
        <Link to="/" className={styles.breadcrumbLink}>
          Дашборд
        </Link>
        <span className={styles.breadcrumbSeparator}>→</span>
        <Link to="/student" className={styles.breadcrumbLink}>
          Студенты
        </Link>
        <span className={styles.breadcrumbSeparator}>→</span>
        <span className={styles.breadcrumbCurrent}>{student.name}</span>
      </div>

      <div className={styles.profileHeader}>
        <div className={styles.profileAvatar}>{student.avatar}</div>
        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>{student.name}</h1>
          <div className={styles.profileMeta}>
            Студент • Участник {student.projectsCompleted} проектов • Средняя
            оценка: {student.averageGrade}/100
          </div>
          {student.description && (
            <div className="text-sm text-gray-600 mt-2 mb-2">
              {student.description}
            </div>
          )}
          <div className={styles.contactInfo}>
            {student.telegram && (
              <div className={styles.contactItem}>
                <Send className="w-4 h-4 mr-2" />
                <span>{student.telegram}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
