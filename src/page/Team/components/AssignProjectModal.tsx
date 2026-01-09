import { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/ui/button";
import { projectsApi } from "../../../api";
import { teamsApi } from "../../../api/teamsApi";
import type { ProjectResponse } from "../../../api/types";

interface AssignProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
  onSuccess: () => void;
  addNotification: (message: string, type?: "success" | "error") => void;
}

export const AssignProjectModal = ({
  isOpen,
  onClose,
  teamId,
  onSuccess,
  addNotification,
}: AssignProjectModalProps) => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchProjects = async () => {
        try {
          const response = await projectsApi.getProjects({ size: 100 });
          setProjects(response);
        } catch (error) {
          console.error("Failed to fetch projects", error);
        }
      };
      fetchProjects();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    setIsLoading(true);
    try {
      await teamsApi.assignProject(teamId, {
        projectId: Number(selectedProjectId),
      });
      addNotification("Проект успешно назначен", "success");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to assign project", error);
      addNotification("Не удалось назначить проект", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md m-auto">
        <h2 className="text-xl font-bold mb-4">Назначить проект</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Проект</label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              required
            >
              <option value="" disabled>
                Выберите проект
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading || !selectedProjectId}>
              {isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
