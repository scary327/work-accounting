import { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import type { NotificationType } from "../../../components/Notification";
import type {
  CreateTeamRequest,
  UpdateTeamRequest,
  Team,
} from "../../../api/types";
import { teamsApi } from "../../../api/teamsApi";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team?: Team | null; // For editing
  onSuccess: () => void;
  addNotification: (message: string, type?: NotificationType) => void;
}

export const TeamModal = ({
  isOpen,
  onClose,
  team,
  onSuccess,
  addNotification,
}: TeamModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
      });
    } else {
      setFormData({
        name: "",
      });
    }
  }, [team, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (team) {
        const updateData: UpdateTeamRequest = {
          name: formData.name,
          description: "",
        };
        await teamsApi.updateTeam(team.id, updateData);

        addNotification(
          `Команда "${formData.name}" успешно обновлена`,
          "success"
        );
      } else {
        const createData: CreateTeamRequest = {
          name: formData.name,
          description: "",
          participantIds: [],
        };
        await teamsApi.createTeam(createData);
        addNotification(
          `Команда "${formData.name}" успешно создана`,
          "success"
        );
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save team:", error);
      addNotification("Ошибка при сохранении команды", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md m-[0_auto]">
        <h2 className="text-xl font-bold mb-4">
          {team ? "Редактировать команду" : "Создать команду"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Команда Alpha"
            />
          </div>
          <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
            Добавление участников в команду происходит на странице студентов
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
