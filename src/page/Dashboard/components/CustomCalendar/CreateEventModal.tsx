import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { CalendarEventDto } from "./api/api";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: CalendarEventDto) => Promise<void>;
  onDelete?: () => Promise<void>;
  selectedDate: { start: Date; end: Date } | null;
  initialEvent?: CalendarEventDto | null;
  isLoading?: boolean;
  isEditing?: boolean;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  selectedDate,
  initialEvent = null,
  isLoading = false,
  isEditing = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    if (isEditing && initialEvent) {
      setTitle(initialEvent.summary || "");
      setDescription(initialEvent.description || "");

      // Парсим время из UTC ISO строки
      // Если нет Z, добавляем его - JavaScript должен понять что это UTC
      const startStr = initialEvent.start.includes("Z")
        ? initialEvent.start
        : initialEvent.start + "Z";
      const endStr = initialEvent.end.includes("Z")
        ? initialEvent.end
        : initialEvent.end + "Z";

      const startDate = new Date(startStr);
      const endDate = new Date(endStr);

      // getHours() и getMinutes() работают с локальным временем браузера
      const startTimeStr = `${String(startDate.getHours()).padStart(
        2,
        "0"
      )}:${String(startDate.getMinutes()).padStart(2, "0")}`;
      const endTimeStr = `${String(endDate.getHours()).padStart(
        2,
        "0"
      )}:${String(endDate.getMinutes()).padStart(2, "0")}`;

      setStartTime(startTimeStr);
      setEndTime(endTimeStr);
    } else {
      handleReset();
    }
  }, [isOpen, isEditing, initialEvent]);

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setStartTime("09:00");
    setEndTime("10:00");
    setError(null);
    setIsDeleting(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить это событие?")) {
      return;
    }

    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete();
        handleReset();
        onClose();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка при удалении события"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Название события обязательно");
      return;
    }

    if (!selectedDate) {
      setError("Дата события не выбрана");
      return;
    }

    try {
      // Парсим время
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      // Получаем дату (без времени) в локальной временной зоне
      const year = selectedDate.start.getFullYear();
      const month = selectedDate.start.getMonth();
      const date = selectedDate.start.getDate();

      // Создаем даты с правильным временем в локальной зоне
      const startDate = new Date(
        year,
        month,
        date,
        startHour,
        startMinute,
        0,
        0
      );
      const endDate = new Date(year, month, date, endHour, endMinute, 0, 0);

      // Проверяем что время начала раньше времени конца
      if (startDate >= endDate) {
        setError("Время начала должно быть раньше времени конца");
        return;
      }

      const newEvent: CalendarEventDto = {
        summary: title,
        description: description,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      };

      await onSubmit(newEvent);
      handleReset();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка при создании события"
      );
    }
  };

  const formatDateForDisplay = () => {
    if (!selectedDate) return "";
    return new Date(selectedDate.start).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Card className="w-96">
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {isEditing ? "Редактирование события" : "Создание события"}
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Отображение выбранной даты */}
            {selectedDate && (
              <div className="bg-blue-50 rounded-md p-3 text-sm">
                <p className="text-gray-600">Дата события:</p>
                <p className="font-medium text-blue-900">
                  {formatDateForDisplay()}
                </p>
              </div>
            )}

            {/* Название события */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название события *
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите название события"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {/* Описание события */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Введите описание события (опционально)"
                disabled={isLoading}
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
              />
            </div>

            {/* Время начала и конца */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Время начала
                </label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Время конца
                </label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Сообщение об ошибке */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Кнопки */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading || isDeleting}
                className="flex-1"
              >
                Отмена
              </Button>
              {isEditing && onDelete && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  disabled={isLoading || isDeleting}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  {isDeleting ? "Удаление..." : "Удалить"}
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading || isDeleting}
                className="flex-1"
              >
                {isLoading
                  ? isEditing
                    ? "Сохранение..."
                    : "Создание..."
                  : isEditing
                  ? "Сохранить"
                  : "Создать"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Modal>
  );
};
