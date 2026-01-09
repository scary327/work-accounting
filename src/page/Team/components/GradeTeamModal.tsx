import { useState } from "react";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { teamsApi } from "../../../api/teamsApi";

interface GradeTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
  onSuccess: () => void;
  addNotification: (message: string, type?: "success" | "error") => void;
}

export const GradeTeamModal = ({
  isOpen,
  onClose,
  teamId,
  onSuccess,
  addNotification,
}: GradeTeamModalProps) => {
  const [formData, setFormData] = useState({
    score: "",
    feedback: "",
    comment: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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
      await teamsApi.gradeTeam(teamId, {
        score: Number(formData.score),
        feedback: formData.feedback,
        comment: formData.comment,
      });
      addNotification("Оценка успешно поставлена", "success");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to grade team", error);
      addNotification("Не удалось поставить оценку", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md m-auto">
        <h2 className="text-xl font-bold mb-4">Оценить команду</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Оценка (0-10)
            </label>
            <Input
              type="number"
              name="score"
              value={formData.score}
              onChange={handleChange}
              min="0"
              max="10"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Отзыв (публичный)
            </label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
              placeholder="Публичный отзыв о работе команды..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Комментарий (приватный)
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
              placeholder="Приватный комментарий..."
            />
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
