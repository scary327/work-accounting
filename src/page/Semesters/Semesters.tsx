import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { NotificationContainer } from "../../components/Notification";
import { useNotifications } from "../../hooks/useNotifications";
import {
  useSemesters,
  useCreateSemester,
  useActivateSemester,
  useDeleteSemester,
  useUpdateSemester,
} from "../../api/hooks/useSemesters";
import { SemesterCard } from "./components/SemesterCard";
import { SemesterModal } from "./components/SemesterModal";
import { DeleteSemesterModal } from "./components/DeleteSemesterModal";
import type { Semester } from "./types";
import styles from "./Semesters.module.css";

export const Semesters = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [semesterToDelete, setSemesterToDelete] = useState<number | null>(null);

  const { notifications, addNotification, removeNotification } =
    useNotifications();
  const { data: semesters = [] } = useSemesters();
  const createMutation = useCreateSemester();
  const activateMutation = useActivateSemester();
  const deleteMutation = useDeleteSemester();
  const updateMutation = useUpdateSemester();

  const handleCreate = async (data: Omit<Semester, "id" | "isActive">) => {
    try {
      await createMutation.mutateAsync(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Ошибка при создании семестра:", error);
    }
  };

  const handleUpdate = async (data: Omit<Semester, "id" | "isActive">) => {
    if (!editingSemester) return;
    try {
      await updateMutation.mutateAsync({
        id: editingSemester.id,
        data,
      });
      addNotification("Семестр успешно обновлён", "success");
      setIsModalOpen(false);
      setEditingSemester(null);
    } catch (error) {
      console.error("Ошибка при обновлении семестра:", error);
      addNotification("Ошибка при обновлении семестра", "error");
    }
  };

  const handleDelete = (id: number) => {
    setSemesterToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      addNotification("Семестр успешно удалён", "success");
      setDeleteModalOpen(false);
      setSemesterToDelete(null);
    } catch (error) {
      console.error("Ошибка при удалении семестра:", error);
      addNotification("Ошибка при удалении семестра", "error");
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await activateMutation.mutateAsync(id);
    } catch (error) {
      console.error("Ошибка при активации семестра:", error);
    }
  };

  const openCreateModal = () => {
    setEditingSemester(null);
    setIsModalOpen(true);
  };

  const openEditModal = (semester: Semester) => {
    setEditingSemester(semester);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.semestersPage}>
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />

      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Управление семестрами</h1>
          <Button variant="primary" size="md" onClick={openCreateModal}>
            + Создать семестр
          </Button>
        </header>

        <motion.div className={styles.semestersList}>
          <AnimatePresence>
            {semesters.map((semester) => (
              <SemesterCard
                key={semester.id}
                semester={semester}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onActivate={handleActivate}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <SemesterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingSemester ? handleUpdate : handleCreate}
        onActivate={handleActivate}
        initialData={editingSemester}
        isLoading={
          createMutation.isPending ||
          activateMutation.isPending ||
          updateMutation.isPending
        }
      />

      <DeleteSemesterModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        semesterId={semesterToDelete}
        onDelete={confirmDelete}
      />
    </div>
  );
};
