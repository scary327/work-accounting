import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, Github } from "lucide-react";
import styles from "./StudentHeader.module.css";

interface StudentHeaderProps {
  student: {
    name: string;
    avatar: string;
    email: string;
    phone: string;
    github: string;
    projectsCompleted: number;
    averageGrade: number;
    currentTeam: {
      id: string;
      name: string;
    } | null;
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
        {student.currentTeam && (
          <>
            <Link
              to={`/team/${student.currentTeam.id}`}
              className={styles.breadcrumbLink}
            >
              {student.currentTeam.name}
            </Link>
            <span className={styles.breadcrumbSeparator}>→</span>
          </>
        )}
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
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <Mail className="w-4 h-4 mr-2" />
              <span>{student.email}</span>
            </div>
            <div className={styles.contactItem}>
              <Phone className="w-4 h-4 mr-2" />
              <span>{student.phone}</span>
            </div>
            <div className={styles.contactItem}>
              <Github className="w-4 h-4 mr-2" />
              <span>{student.github}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
