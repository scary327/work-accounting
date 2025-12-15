import { useEffect, useState } from "react";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import type { Semester } from "../types";

interface SemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Semester, "id" | "isActive">) => void | Promise<void>;
  onActivate?: (id: number) => void | Promise<void>;
  initialData?: Semester | null;
  isLoading?: boolean;
}

export const SemesterModal = ({
  isOpen,
  onClose,
  onSubmit,
  onActivate,
  initialData,
  isLoading = false,
}: SemesterModalProps) => {
  const [name, setName] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setStartsAt(initialData.startsAt.split("T")[0]);
      setEndsAt(initialData.endsAt.split("T")[0]);
    } else {
      setName("");
      setStartsAt("");
      setEndsAt("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: new Date(endsAt).toISOString(),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="!p-6">
        <h2 className="text-2xl font-bold mb-6">
          {initialData ? "Редактировать семестр" : "Создать семестр"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Название семестра
            </label>
            <Input
              className="px-4 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Весенний семестр 2025"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Дата начала
            </label>
            <Input
              className="px-4 py-2"
              type="date"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Дата окончания
            </label>
            <Input
              className="px-4 py-2"
              type="date"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between gap-3 mt-4">
            <div className="flex gap-3">
              {initialData && !initialData.isActive && onActivate && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  disabled={isLoading}
                  onClick={() => {
                    onActivate(initialData.id);
                    onClose();
                  }}
                >
                  Активировать
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                disabled={isLoading}
                onClick={onClose}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
              >
                {initialData ? "Сохранить" : "Создать"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};
