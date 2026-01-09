import { motion } from "framer-motion";
import { Users, User } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import styles from "./CurrentTeam.module.css";

interface CurrentTeamProps {
  currentTeam: string | null;
  currentProject: string | null;
  stats: {
    projectsCompleted: number;
    averageGrade: number;
    teamsCount: number;
  };
}

/**
 * CurrentTeam component - текущая команда студента и статистика
 */
export const CurrentTeam = ({
  currentTeam,
  currentProject,
  stats,
}: CurrentTeamProps) => {
  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className={styles.sectionHeader}>
        <Users className="w-6 h-6 mr-2 text-primary" />
        <h2 className={styles.sectionTitle}>Текущая команда</h2>
      </div>

      {currentTeam ? (
        <>
          <Card className={styles.currentTeamCard}>
            <CardContent className="p-6 relative">
              <Badge className={`${styles.teamBadge} absolute top-6 right-6`}>
                Активна
              </Badge>
              <div className={styles.teamName}>{currentTeam}</div>
              <div className={styles.teamProject}>
                <strong>Текущий проект:</strong>{" "}
                {currentProject || "Нет активного проекта"}
              </div>
            </CardContent>
          </Card>

          <div className={styles.statsGrid}>
            <Card className={styles.statCard}>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <div className={styles.statValue}>
                  {stats.projectsCompleted}
                </div>
                <div className={styles.statLabel}>Завершённых проектов</div>
              </CardContent>
            </Card>
            <Card className={styles.statCard}>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <div className={styles.statValue}>
                  {stats.averageGrade.toFixed(2)}
                </div>
                <div className={styles.statLabel}>Средняя оценка</div>
              </CardContent>
            </Card>
            <Card className={styles.statCard}>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <div className={styles.statValue}>{stats.teamsCount}</div>
                <div className={styles.statLabel}>Команды</div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className={styles.placeholder}>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <User className="w-12 h-12 text-muted-foreground mb-4" />
            <div className={styles.placeholderText}>
              Студент пока не состоит в команде
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};
