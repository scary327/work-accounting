import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ConfirmDialog } from "../../../components/ui/confirm-dialog";
import { teamsApi } from "../../../api/teamsApi";
import styles from "./TeamMembers.module.css";

interface Member {
  id: number;
  fio: string;
}

interface TeamMembersProps {
  members: Member[];
  teamId?: number;
  onRemoveSuccess?: () => void;
  addNotification?: (message: string, type?: "success" | "error") => void;
}

/**
 * TeamMembers component - сетка членов команды с аватарами
 */
export const TeamMembers = memo(
  ({ members, teamId, onRemoveSuccess, addNotification }: TeamMembersProps) => {
    const navigate = useNavigate();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(
      null
    );
    const [isRemoving, setIsRemoving] = useState(false);

    const selectedMember = members.find((m) => m.id === selectedMemberId);

    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const handleRemoveParticipant = async () => {
      if (!teamId || !selectedMemberId) return;

      setIsRemoving(true);
      try {
        await teamsApi.removeParticipant(teamId, selectedMemberId);
        addNotification?.("Участник успешно удален", "success");
        onRemoveSuccess?.();
        setIsDeleteDialogOpen(false);
        setSelectedMemberId(null);
      } catch (error) {
        console.error("Failed to remove participant", error);
        addNotification?.("Не удалось удалить участника", "error");
      } finally {
        setIsRemoving(false);
      }
    };

    const handleRemoveClick = (e: React.MouseEvent, memberId: number) => {
      e.stopPropagation();
      setSelectedMemberId(memberId);
      setIsDeleteDialogOpen(true);
    };

    return (
      <>
        <Card className={styles.section}>
          <CardHeader className="pb-2">
            <CardTitle className={styles.sectionHeader}>
              <span className={styles.icon}>👥</span>
              <span className={styles.title}>Текущий состав команды</span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className={styles.grid}>
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  className={styles.card}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/student/${member.id}`)}
                  style={{ cursor: "pointer", position: "relative" }}
                >
                  <div
                    className={`${styles.avatar} ${
                      styles[`avatar-${member.id}`]
                    }`}
                  >
                    {getInitials(member.fio)}
                  </div>
                  <div className={styles.name}>{member.fio}</div>
                  {teamId && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className={styles.removeButton}
                      onClick={(e) => handleRemoveClick(e, member.id)}
                      disabled={isRemoving}
                      title="Удалить участника"
                    >
                      ✕
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedMember && (
          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            title="Удаление участника"
            message={`Вы уверены, что хотите удалить участника "${selectedMember.fio}" из команды? Это действие необратимо.`}
            onConfirm={handleRemoveParticipant}
            onCancel={() => {
              setIsDeleteDialogOpen(false);
              setSelectedMemberId(null);
            }}
          />
        )}
      </>
    );
  }
);

TeamMembers.displayName = "TeamMembers";
