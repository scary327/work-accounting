import { Link } from "react-router-dom";
import styles from "./CurrentTeam.module.css";

interface CurrentTeamProps {
  currentTeam: {
    id: string;
    name: string;
    currentProject: string;
  } | null;
  stats: {
    projectsCompleted: number;
    averageGrade: number;
    teamsCount: number;
  };
}

/**
 * CurrentTeam component - текущая команда студента и статистика
 */
export const CurrentTeam = ({ currentTeam, stats }: CurrentTeamProps) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>👥</span>
        <h2 className={styles.sectionTitle}>Текущая команда</h2>
      </div>

      {currentTeam ? (
        <>
          <div className={styles.currentTeamCard}>
            <div className={styles.teamBadge}>Активна</div>
            <div className={styles.teamName}>
              <Link to={`/team/${currentTeam.id}`} className={styles.teamLink}>
                {currentTeam.name}
              </Link>
            </div>
            <div className={styles.teamProject}>
              <strong>Текущий проект:</strong> {currentTeam.currentProject}
            </div>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.projectsCompleted}</div>
              <div className={styles.statLabel}>Завершённых проектов</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.averageGrade}</div>
              <div className={styles.statLabel}>Средняя оценка</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.teamsCount}</div>
              <div className={styles.statLabel}>Команды</div>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>👤</div>
          <div className={styles.placeholderText}>
            Студент пока не состоит в команде
          </div>
        </div>
      )}
    </div>
  );
};
