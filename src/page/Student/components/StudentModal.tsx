import { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import type {
  CreateParticipantRequest,
  ParticipantResponse,
} from "../../../api/types";
import { studentApi } from "../../../api/studentApi";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: ParticipantResponse | null; // For editing
  onSuccess: (student: ParticipantResponse) => void;
}

export const StudentModal = ({
  isOpen,
  onClose,
  student,
  onSuccess,
}: StudentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateParticipantRequest>({
    firstName: "",
    lastName: "",
    middleName: "",
    bio: "",
    telegram: "",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        middleName: student.middleName,
        bio: student.bio,
        telegram: student.telegram,
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        middleName: "",
        bio: "",
        telegram: "",
      });
    }
  }, [student, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let result;
      if (student) {
        result = await studentApi.updateParticipant(student.id, formData);
      } else {
        result = await studentApi.createParticipant(formData);
      }
      onSuccess(result);
      onClose();
    } catch (error) {
      console.error("Failed to save student:", error);
      // Handle error (e.g., show toast)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {student ? "Редактировать студента" : "Создать студента"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Фамилия</label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Иванов"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Имя</label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="Иван"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Отчество</label>
            <Input
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Иванович"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telegram</label>
            <Input
              name="telegram"
              value={formData.telegram}
              onChange={handleChange}
              placeholder="@username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">О себе</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
              placeholder="Расскажите о навыках и опыте..."
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
