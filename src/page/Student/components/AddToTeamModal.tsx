import { useState } from "react";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import type { NotificationType } from "../../../components/Notification";
import type { Team } from "../../../api/types";

interface AddToTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number | null;
  studentName: string;
  teams: Team[];
  onSuccess: () => void;
  addNotification: (message: string, type?: NotificationType) => void;
}

export const AddToTeamModal = ({
  isOpen,
  onClose,
  studentId,
  studentName,
  teams,
  onSuccess,
  addNotification,
}: AddToTeamModalProps) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!studentId || !selectedTeamId) return;

    try {
      addNotification(`Студент добавлен в команду`, "success");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to add student to team", error);
      addNotification("Не удалось добавить студента в команду", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 bg-white rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Добавить в команду</h2>
        <p className="text-gray-600 mb-4">
          Выберите команду для студента <b>{studentName}</b>
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Команда</label>
            <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите команду" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedTeamId || isSubmitting}
            >
              {isSubmitting ? "Добавление..." : "Добавить"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
