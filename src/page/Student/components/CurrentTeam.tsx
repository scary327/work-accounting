import { useState } from "react";
import { motion } from "framer-motion";
import { Users, User } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { ConfirmDialog } from "../../../components/ui/confirm-dialog";
import { teamsApi } from "../../../api/teamsApi";
import styles from "./CurrentTeam.module.css";

interface CurrentTeamProps {
  currentTeam: string | null;
  currentTeamId?: number | null;
  studentId?: number | null;
  currentProject: string | null;
  onSelectCurrentProject?: () => void;
  stats: {
    projectsCompleted: number;
    averageGrade: number;
    teamsCount: number;
  };
  onRemoveSuccess?: () => void;
  addNotification?: (message: string, type?: "success" | "error") => void;
}

/**
 * CurrentTeam component - текущая команда студента и статистика
 */
export const CurrentTeam = ({
  currentTeam,
  currentTeamId,
  studentId,
  currentProject,
  onSelectCurrentProject,
  stats,
  onRemoveSuccess,
  addNotification,
}: CurrentTeamProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleRemoveFromTeam = async () => {
    if (!currentTeamId || !studentId) return;

    try {
      await teamsApi.removeParticipant(currentTeamId, studentId);
      addNotification?.("Вы удалены из команды", "success");
      onRemoveSuccess?.();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to remove student from team", error);
      addNotification?.("Не удалось удалить студента из команды", "error");
    }
  };

  return (
    <>
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
                  <button
                    onClick={onSelectCurrentProject}
                    className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    title="Просмотр подробностей"
                  >
                    {currentProject || "Нет активного проекта"}
                  </button>
                </div>
                {currentTeamId && studentId && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className={styles.removeButton}
                    onClick={() => setIsDeleteDialogOpen(true)}
                    title="Удалить из команды"
                  >
                    Удалить из команды
                  </Button>
                )}
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

      {currentTeam && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title="Удаление из команды"
          message={`Вы уверены, что хотите удалить студента из команды "${currentTeam}"? Это действие необратимо.`}
          onConfirm={handleRemoveFromTeam}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </>
  );
};
