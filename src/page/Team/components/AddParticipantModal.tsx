import { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/ui/button";
import { studentApi } from "../../../api/studentApi";
import { teamsApi } from "../../../api/teamsApi";
import type { ParticipantResponse } from "../../../api/types";

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
  onSuccess: () => void;
  addNotification: (message: string, type?: "success" | "error") => void;
}

export const AddParticipantModal = ({
  isOpen,
  onClose,
  teamId,
  onSuccess,
  addNotification,
}: AddParticipantModalProps) => {
  const [students, setStudents] = useState<ParticipantResponse[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchStudents = async () => {
        try {
          const response = await studentApi.getParticipants({ size: 100 });
          setStudents(response.content);
        } catch (error) {
          console.error("Failed to fetch students", error);
        }
      };
      fetchStudents();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    setIsLoading(true);
    try {
      await teamsApi.addParticipant(teamId, selectedStudentId);
      addNotification("Участник успешно добавлен", "success");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to add participant", error);
      addNotification("Не удалось добавить участника", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getFio = (s: ParticipantResponse) =>
    `${s.lastName} ${s.firstName} ${s.middleName || ""}`.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md m-auto">
        <h2 className="text-xl font-bold mb-4">Добавить участника</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Студент</label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              required
            >
              <option value="" disabled>
                Выберите студента
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {getFio(student)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading || !selectedStudentId}>
              {isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
