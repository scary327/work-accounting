import { useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/ui/button";
import {
  useSemesterDetails,
  useSemesters,
} from "../../../api/hooks/useSemesters";
import { projectsApi } from "../../../api/projectsApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Trash2 } from "lucide-react";
import styles from "./DeleteSemesterModal.module.css";

interface DeleteSemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  semesterId: number | null;
  onDelete: (id: number) => void;
}

export const DeleteSemesterModal = ({
  isOpen,
  onClose,
  semesterId,
  onDelete,
}: DeleteSemesterModalProps) => {
  const { data: semesterDetails, refetch } = useSemesterDetails(semesterId);
  const { data: allSemesters } = useSemesters();

  useEffect(() => {
    if (isOpen && semesterId) {
      refetch();
    }
  }, [isOpen, semesterId, refetch]);

  const handleDeleteProject = async (projectId: number) => {
    try {
      await projectsApi.deleteProject(projectId);
      refetch();
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const handleMoveProject = async (
    projectId: number,
    targetSemesterId: string
  ) => {
    try {
      await projectsApi.moveProjectToSemester(
        projectId,
        parseInt(targetSemesterId)
      );
      refetch();
    } catch (error) {
      console.error("Failed to move project", error);
    }
  };

  const handleConfirmDelete = () => {
    if (semesterId) {
      onDelete(semesterId);
    }
  };

  if (!semesterDetails) return null;

  const otherSemesters = allSemesters?.filter((s) => s.id !== semesterId) || [];
  const hasProjects =
    semesterDetails.projects && semesterDetails.projects.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>
          Удаление семестра: {semesterDetails.name}
        </h2>

        {semesterDetails.isActive ? (
          <div className={styles.warning}>
            <p>
              Этот семестр активен. Пожалуйста, сделайте другой семестр активным
              перед удалением.
            </p>
            <div className="flex justify-end mt-4">
              <Button onClick={onClose}>Закрыть</Button>
            </div>
          </div>
        ) : (
          <>
            {hasProjects ? (
              <div className={styles.projectsSection}>
                <p className={styles.description}>
                  В этом семестре есть проекты. Вы должны удалить их или
                  перенести в другой семестр перед удалением самого семестра.
                </p>
                <div className={styles.projectsList}>
                  {semesterDetails.projects.map((project) => (
                    <div key={project.id} className={styles.projectItem}>
                      <span className={styles.projectTitle}>
                        {project.title}
                      </span>
                      <div className={styles.actions}>
                        <Select
                          onValueChange={(value) =>
                            handleMoveProject(project.id, value)
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Перенести в..." />
                          </SelectTrigger>
                          <SelectContent className="z-[1001]">
                            {otherSemesters.map((s) => (
                              <SelectItem key={s.id} value={s.id.toString()}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          variant="danger"
                          size="icon"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.confirmation}>
                Вы уверены, что хотите удалить этот семестр? Это действие нельзя
                отменить.
                <div className={styles.footer}>
                  <Button variant="ghost" onClick={onClose}>
                    Отмена
                  </Button>
                  <Button variant="danger" onClick={handleConfirmDelete}>
                    Удалить
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
