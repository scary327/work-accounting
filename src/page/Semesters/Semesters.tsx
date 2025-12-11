import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { semestersApi } from "../../api";
import { SemesterCard } from "./components/SemesterCard";
import { SemesterModal } from "./components/SemesterModal";
import type { Semester } from "./types";
import styles from "./Semesters.module.css";

const MOCK_SEMESTERS: Semester[] = [
  {
    id: 1,
    name: "Осенний семестр 2024",
    startsAt: "2024-09-01T00:00:00.000Z",
    endsAt: "2024-12-31T23:59:59.000Z",
    isActive: false,
  },
  {
    id: 2,
    name: "Весенний семестр 2025",
    startsAt: "2025-02-01T00:00:00.000Z",
    endsAt: "2025-06-30T23:59:59.000Z",
    isActive: true,
  },
];

export const Semesters = () => {
  const [semesters, setSemesters] = useState<Semester[]>(MOCK_SEMESTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (data: Omit<Semester, "id" | "isActive">) => {
    try {
      setIsLoading(true);
      const response = await semestersApi.createSemester(data);
      setSemesters([...semesters, response]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Ошибка при создании семестра:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (data: Omit<Semester, "id" | "isActive">) => {
    if (!editingSemester) return;
    setSemesters(
      semesters.map((s) =>
        s.id === editingSemester.id ? { ...s, ...data } : s
      )
    );
    setIsModalOpen(false);
    setEditingSemester(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот семестр?")) {
      setSemesters(semesters.filter((s) => s.id !== id));
    }
  };

  const handleActivate = async (id: number) => {
    try {
      setIsLoading(true);
      await semestersApi.activateSemester(id);
      setSemesters(
        semesters.map((s) => ({
          ...s,
          isActive: s.id === id,
        }))
      );
    } catch (error) {
      console.error("Ошибка при активации семестра:", error);
    } finally {
      setIsLoading(false);
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

        <motion.div className={styles.semestersList} layout>
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
        isLoading={isLoading}
      />
    </div>
  );
};
