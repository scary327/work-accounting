import {
  ArchiveModal as OriginalArchiveModal,
  ModalData,
} from "./ArchiveModal"; // Keep types if needed, but we are replacing the component
import {
  ProjectDetailsModal,
  ProjectDetails,
} from "../../../components/ProjectDetailsModal/ProjectDetailsModal";

export type { ModalData };

interface ArchiveModalProps {
  isOpen: boolean;
  data?: ModalData;
  onClose: () => void;
}

/**
 * ArchiveModal component - модальное окно с деталями кейса
 */
export const ArchiveModal = ({ isOpen, data, onClose }: ArchiveModalProps) => {
  const projectDetails: ProjectDetails | null = data
    ? {
        id: data.id,
        title: data.title,
        mentor: data.author,
        description: data.description,
        stack: data.stack.split(", "), // Assuming stack is a comma-separated string in ArchiveModal
        teamName: data.teamName,
        teamMembers: data.teamMembers,
        grade: data.grade,
        checkpoints: data.checkpoints,
        status: "✅ Принят",
      }
    : null;

  return (
    <ProjectDetailsModal
      isOpen={isOpen}
      data={projectDetails}
      onClose={onClose}
    />
  );
};
