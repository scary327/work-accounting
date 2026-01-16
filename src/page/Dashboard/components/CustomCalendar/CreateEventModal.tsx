import React, { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { CalendarEventDto } from "./api/api";

type RecurrenceEndType = "never" | "date";
type DayOfWeek = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";

interface RecurrenceState {
  isRecurring: boolean;
  interval: number;
  selectedDays: DayOfWeek[];
  endType: RecurrenceEndType;
  endDate: string;
}

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
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceState>({
    isRecurring: false,
    interval: 1,
    selectedDays: ["MO", "WE", "FR"],
    endType: "never",
    endDate: "",
  });

  const parseRecurrenceString = (rrule: string) => {
    // Parse "FREQ=WEEKLY;INTERVAL=2;BYDAY=FR" format
    const params: Record<string, string> = {};
    const parts = rrule.replace("RRULE:", "").split(";");
    parts.forEach((part) => {
      const [key, value] = part.split("=");
      if (key && value) {
        params[key] = value;
      }
    });

    const newRecurrence: RecurrenceState = {
      isRecurring: true,
      interval: parseInt(params.INTERVAL || "1", 10),
      selectedDays: params.BYDAY
        ? (params.BYDAY.split(",") as DayOfWeek[])
        : ["MO"],
      endType: params.UNTIL ? "date" : "never",
      endDate: params.UNTIL ? formatDateForInput(params.UNTIL) : "",
    };

    setRecurrence(newRecurrence);
  };

  const formatDateForInput = (rruleDate: string): string => {
    // Convert YYYYMMDDTHHMMSSZ to YYYY-MM-DD
    if (!rruleDate || rruleDate.length < 8) return "";
    const year = rruleDate.substring(0, 4);
    const month = rruleDate.substring(4, 6);
    const day = rruleDate.substring(6, 8);
    return `${year}-${month}-${day}`;
  };

  const buildRecurrenceString = (startDate: Date): string | undefined => {
    if (!recurrence.isRecurring) return undefined;

    // Форматируем DTSTART
    const year = String(startDate.getFullYear()).padStart(4, "0");
    const month = String(startDate.getMonth() + 1).padStart(2, "0");
    const day = String(startDate.getDate()).padStart(2, "0");
    const hours = String(startDate.getHours()).padStart(2, "0");
    const minutes = String(startDate.getMinutes()).padStart(2, "0");
    const seconds = String(startDate.getSeconds()).padStart(2, "0");

    const dtstart = `DTSTART:${year}${month}${day}T${hours}${minutes}${seconds}`;

    const rruleParts = ["FREQ=WEEKLY"];

    if (recurrence.interval > 1) {
      rruleParts.push(`INTERVAL=${recurrence.interval}`);
    }

    if (recurrence.selectedDays.length > 0) {
      rruleParts.push(`BYDAY=${recurrence.selectedDays.join(",")}`);
    }

    if (recurrence.endType === "date" && recurrence.endDate) {
      const [endYear, endMonth, endDay] = recurrence.endDate.split("-");
      rruleParts.push(`UNTIL=${endYear}${endMonth}${endDay}T235959`);
    }

    const rrule = `RRULE:${rruleParts.join(";")}`;
    return `${dtstart}\n${rrule}`;
  };

  const toggleDay = (day: DayOfWeek) => {
    setRecurrence((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day].sort(),
    }));
  };

  React.useEffect(() => {
    if (isEditing && initialEvent) {
      setTitle(initialEvent.summary || "");
      setDescription(initialEvent.description || "");
      setLocation(initialEvent.location || "");

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

      // Парсим recurrence если есть
      if (initialEvent.recurrence) {
        parseRecurrenceString(initialEvent.recurrence);
      }
    } else {
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEditing, initialEvent]);

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setStartTime("09:00");
    setEndTime("10:00");
    setError(null);
    setIsDeleting(false);
    setRecurrence({
      isRecurring: false,
      interval: 1,
      selectedDays: ["MO", "WE", "FR"],
      endType: "never",
      endDate: "",
    });
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
        location: location,
        start: recurrence.isRecurring ? "" : startDate.toISOString(),
        end: recurrence.isRecurring ? "" : endDate.toISOString(),
        recurrence: buildRecurrenceString(startDate),
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
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl w-full">
      <Card className="w-full max-h-[90vh]">
        <CardHeader>
          <h2 className="text-lg font-semibold">
            {isEditing ? "Редактирование события" : "Создание события"}
          </h2>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 max-h-[calc(90vh-160px)] overflow-y-auto pr-2"
          >
            {/* Отображение выбранной даты */}
            {selectedDate && (
              <div className="bg-blue-50 rounded-md p-3 text-sm sticky top-0">
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

            {/* Место проведения */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Место проведения
              </label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Укажите место (опционально)"
                disabled={isLoading}
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

            {/* Чекбокс для повторяющегося события */}
            <div className="border-t pt-4 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recurrence.isRecurring}
                  onChange={(e) =>
                    setRecurrence((prev) => ({
                      ...prev,
                      isRecurring: e.target.checked,
                    }))
                  }
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Повторяющееся событие
                </span>
              </label>
            </div>

            {/* Настройка повторения - animated section */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: recurrence.isRecurring ? 1 : 0,
                height: recurrence.isRecurring ? "auto" : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden w-full"
            >
              {recurrence.isRecurring && (
                <div className="bg-blue-50 rounded-md p-4 space-y-4">
                  {/* Интервал повторения */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Повторять каждую N неделю:
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max="52"
                        value={recurrence.interval}
                        onChange={(e) =>
                          setRecurrence((prev) => ({
                            ...prev,
                            interval: Math.max(
                              1,
                              parseInt(e.target.value) || 1
                            ),
                          }))
                        }
                        disabled={isLoading}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-600">
                        {recurrence.interval === 1
                          ? "неделя"
                          : recurrence.interval > 4
                          ? "недель"
                          : "недели"}
                      </span>
                    </div>
                  </div>

                  {/* Выбор дней недели */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Дни недели:
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { day: "MO", label: "Пн" },
                        { day: "TU", label: "Вт" },
                        { day: "WE", label: "Ср" },
                        { day: "TH", label: "Чт" },
                        { day: "FR", label: "Пт" },
                        { day: "SA", label: "Сб" },
                        { day: "SU", label: "Вс" },
                      ].map(({ day, label }) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day as DayOfWeek)}
                          disabled={isLoading}
                          className={`py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                            recurrence.selectedDays.includes(day as DayOfWeek)
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Условие окончания */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Повторять:
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="endType"
                          value="never"
                          checked={recurrence.endType === "never"}
                          onChange={() =>
                            setRecurrence((prev) => ({
                              ...prev,
                              endType: "never",
                            }))
                          }
                          disabled={isLoading}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">Всегда</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="endType"
                          value="date"
                          checked={recurrence.endType === "date"}
                          onChange={() =>
                            setRecurrence((prev) => ({
                              ...prev,
                              endType: "date",
                            }))
                          }
                          disabled={isLoading}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">До даты:</span>
                      </label>
                      {recurrence.endType === "date" && (
                        <Input
                          type="date"
                          value={recurrence.endDate}
                          onChange={(e) =>
                            setRecurrence((prev) => ({
                              ...prev,
                              endDate: e.target.value,
                            }))
                          }
                          disabled={isLoading}
                          className="ml-6 max-w-[160px]"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Сообщение об ошибке */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Кнопки */}
            <div className="flex gap-3 pt-2 border-t sticky bottom-0 bg-white py-3">
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
