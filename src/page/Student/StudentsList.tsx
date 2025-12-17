import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Plus, Pencil, UserPlus } from "lucide-react";
import type { ParticipantResponse, Team } from "../../api/types";
import { studentApi } from "../../api/studentApi";
import { teamsApi } from "../../api/teamsApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { StudentModal } from "./components/StudentModal";
import { AddToTeamModal } from "./components/AddToTeamModal";
import styles from "./StudentsList.module.css";

const container = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const StudentsList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<ParticipantResponse[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] =
    useState<ParticipantResponse | null>(null);
  
  const [addToTeamModalOpen, setAddToTeamModalOpen] = useState(false);
  const [selectedStudentForTeam, setSelectedStudentForTeam] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await studentApi.getParticipants({ size: 100 });
      setStudents(response.content);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await teamsApi.getTeams({ size: 100 });
      setTeams(response.content);
    } catch (error) {
      console.error("Failed to fetch teams", error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchTeams();
  }, []);

  const handleCreate = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student: ParticipantResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleAddToTeam = (student: ParticipantResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStudentForTeam({
      id: student.id,
      name: getFio(student),
    });
    setAddToTeamModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchStudents();
    setIsModalOpen(false);
  };

  const handleAddToTeamSuccess = () => {
    // Optionally refresh students if team info is displayed
    fetchStudents();
  };

  const getFio = (student: ParticipantResponse) => {
    return `${student.lastName} ${student.firstName} ${student.middleName || ""}`.trim();
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Студенты</h1>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить студента
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">Загрузка...</div>
        ) : (
          <motion.div
            className={styles.grid}
            variants={container}
            initial="hidden"
            animate="show"
          >
            {students.map((student) => (
              <motion.div key={student.id} variants={item}>
                <Card
                  className={`${styles.card} group relative`}
                  onClick={() => navigate(`/student/${student.id}`)}
                >
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleAddToTeam(student, e)}
                      title="Добавить в команду"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleEdit(student, e)}
                      title="Редактировать"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardHeader className={styles.cardHeader}>
                    <CardTitle className={styles.studentName}>
                      {getFio(student)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col pt-0">
                    <div className="mb-4 flex-1">
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 font-medium">
                        <User size={16} />
                        <span>О себе</span>
                      </div>
                      <p className={styles.aboutText}>
                        {student.bio || "Информация отсутствует"}
                      </p>
                    </div>

                    <div className={styles.statsRow}>
                      {student.telegram && (
                        <div className={styles.statItem}>
                          <div className="text-blue-500 text-sm font-medium truncate max-w-[100px]">
                            {student.telegram}
                          </div>
                          <div className={styles.statLabel}>Telegram</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={editingStudent}
        onSuccess={handleModalSuccess}
      />

      <AddToTeamModal
        isOpen={addToTeamModalOpen}
        onClose={() => setAddToTeamModalOpen(false)}
        studentId={selectedStudentForTeam?.id || null}
        studentName={selectedStudentForTeam?.name || ""}
        teams={teams}
        onSuccess={handleAddToTeamSuccess}
      />
    </div>
  );
};
