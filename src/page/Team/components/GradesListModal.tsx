import { useState, useEffect, useCallback } from "react";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/ui/button";
import { teamsApi } from "../../../api/teamsApi";
import type { Grade } from "../../../api/types";
import { Trash2 } from "lucide-react";

interface GradesListModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
  addNotification: (message: string, type?: "success" | "error") => void;
}

export const GradesListModal = ({
  isOpen,
  onClose,
  teamId,
  addNotification,
}: GradesListModalProps) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGrades = useCallback(async () => {
    setLoading(true);
    try {
      const response = await teamsApi.getGrades(teamId);
      // API returns an array directly now
      setGrades(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Failed to fetch grades", error);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    if (isOpen) {
      fetchGrades();
    }
  }, [isOpen, fetchGrades]);

  const handleDelete = async (gradeId: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту оценку?")) return;
    try {
      await teamsApi.deleteGrade(teamId, gradeId);
      addNotification("Оценка удалена", "success");
      fetchGrades();
    } catch (error) {
      console.error("Failed to delete grade", error);
      addNotification("Не удалось удалить оценку", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl m-auto max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Оценки команды</h2>

        {loading ? (
          <div className="flex justify-center p-4">Загрузка...</div>
        ) : grades.length === 0 ? (
          <div className="text-center text-gray-500 py-4">Нет оценок</div>
        ) : (
          <div className="space-y-4">
            {grades.map((grade, index) => (
              <div
                key={grade.id || index}
                className="border p-4 rounded-md bg-gray-50 relative group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-lg mr-2">
                      {grade.score}/10
                    </span>
                    <span className="text-sm text-gray-500">
                      от {grade.authorName || grade.evaluatorName}
                      {grade.createdAt &&
                        ` (${new Date(grade.createdAt).toLocaleDateString()})`}
                    </span>
                  </div>
                  {grade.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(grade.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {grade.projectTitle && (
                  <div className="mb-2 text-sm text-blue-600 font-medium">
                    Проект: {grade.projectTitle}
                  </div>
                )}
                {(grade.feedback || grade.comment) && (
                  <div className="mb-2">
                    <span className="font-semibold text-sm block">Отзыв:</span>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {grade.feedback || grade.comment}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </Modal>
  );
};
