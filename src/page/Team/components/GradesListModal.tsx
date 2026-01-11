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
  projectId?: number; // Optional filter
  addNotification: (message: string, type?: "success" | "error") => void;
  onSuccess?: () => void;
}

export const GradesListModal = ({
  isOpen,
  onClose,
  teamId,
  projectId,
  addNotification,
  onSuccess,
}: GradesListModalProps) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGrades = useCallback(async () => {
    setLoading(true);
    try {
      let data: Grade[] = [];
      if (projectId) {
        // If projectId is present, use the specific endpoint which likely returns more details (IDs)
        const response = await teamsApi.getProjectGrades(teamId, projectId);
        data = Array.isArray(response) ? response : [];
      } else {
        const response = await teamsApi.getGrades(teamId);
        data = Array.isArray(response) ? response : [];
      }
      setGrades(data);
    } catch (error) {
      console.error("Failed to fetch grades", error);
    } finally {
      setLoading(false);
    }
  }, [teamId, projectId]);

  useEffect(() => {
    if (isOpen) {
      fetchGrades();
    }
  }, [isOpen, fetchGrades]);

  const handleDelete = async (gradeId: number) => {
    try {
      await teamsApi.deleteGrade(teamId, gradeId);
      addNotification("Оценка удалена", "success");
      fetchGrades();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to delete grade", error);
      addNotification("Не удалось удалить оценку", "error");
    }
  };

  // Group grades by project
  const groupedGrades = grades.reduce((acc, grade) => {
    const projectKey = grade.projectTitle || "Без проекта";
    if (!acc[projectKey]) {
      acc[projectKey] = [];
    }
    acc[projectKey].push(grade);
    return acc;
  }, {} as Record<string, Grade[]>);

  const projectNames = Object.keys(groupedGrades).sort();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl m-auto max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Оценки команды</h2>

        {loading ? (
          <div className="flex justify-center p-4">Загрузка...</div>
        ) : grades.length === 0 ? (
          <div className="text-center text-gray-500 py-4">Нет оценок</div>
        ) : (
          <div className="space-y-6">
            {projectNames.map((projectName) => (
              <div key={projectName} className="border-b pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">
                  {projectName}
                </h3>
                <div className="space-y-3 ml-4">
                  {groupedGrades[projectName].map((grade, index) => (
                    <div
                      key={grade.id || index}
                      className="border p-3 rounded-md bg-gray-50 relative group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-lg mr-2">
                            {grade.score}/100
                          </span>
                          <span className="text-sm text-gray-500">
                            от {grade.authorName || grade.evaluatorName}
                            {grade.createdAt &&
                              ` (${new Date(
                                grade.createdAt
                              ).toLocaleDateString()})`}
                          </span>
                        </div>
                        {grade.id ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="ml-2"
                            onClick={() => handleDelete(grade.id!)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Удалить
                          </Button>
                        ) : (
                          <span className="text-xs text-red-400">Нет ID</span>
                        )}
                      </div>
                      {(grade.feedback || grade.comment) && (
                        <div className="mt-2">
                          <span className="font-semibold text-sm block">
                            Отзыв:
                          </span>
                          <p className="text-gray-700 whitespace-pre-wrap text-sm">
                            {grade.feedback || grade.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
