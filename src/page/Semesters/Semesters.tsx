import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
  useSemesters,
  useCreateSemester,
  useActivateSemester,
} from "../../api/hooks/useSemesters";
import { SemesterCard } from "./components/SemesterCard";
import { SemesterModal } from "./components/SemesterModal";
import type { Semester } from "./types";
import styles from "./Semesters.module.css";

export const Semesters = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);

  const { data: semesters = [] } = useSemesters();
  const createMutation = useCreateSemester();
  const activateMutation = useActivateSemester();

  const handleCreate = async (data: Omit<Semester, "id" | "isActive">) => {
    try {
      await createMutation.mutateAsync(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Ошибка при создании семестра:", error);
    }
  };

  const handleUpdate = (data: Omit<Semester, "id" | "isActive">) => {
    if (!editingSemester) return;
    // TODO: Реализовать обновление семестра через API
    console.log("Update not implemented yet", data);
    setIsModalOpen(false);
    setEditingSemester(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот семестр?")) {
      // TODO: Реализовать удаление семестра через API
      console.log("Delete not implemented yet", id);
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
        isLoading={createMutation.isPending || activateMutation.isPending}
      />
    </div>
  );
};
