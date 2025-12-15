import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, User, GraduationCap, Plus, Pencil } from "lucide-react";
import type { Student, ParticipantResponse } from "../../api/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { StudentModal } from "./components/StudentModal";
import styles from "./StudentsList.module.css";

const MOCK_STUDENTS: Student[] = [
  {
    id: 101,
    fio: "Иванов Иван Иванович",
    email: "ivanov@example.com",
    about: "Fullstack разработчик с опытом в React и Node.js",
    tlgUsername: "@ivanov_dev",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    projects: [
      {
        semesterId: 1,
        semesterName: "Осень 2024",
        projectId: 1,
        title: "Система учета",
        mentors: [{ id: 1, fio: "Сидоров С.С." }],
        techStack: "React, Node.js",
        description: "Разработка системы",
        averageGrade: 4.5,
        isActive: true,
        assignedAt: "2024-09-01",
        unassignedAt: null,
      },
    ],
  },
  {
    id: 102,
    fio: "Петров Петр Петрович",
    email: "petrov@example.com",
    about: "Backend разработчик, люблю Python",
    tlgUsername: "@petrov_py",
    skills: ["Python", "Django", "FastAPI", "Docker"],
    projects: [],
  },
  {
    id: 103,
    fio: "Смирнова Анна Сергеевна",
    email: "smirnova@example.com",
    about: "Frontend разработчик, UI/UX энтузиаст",
    tlgUsername: "@smirnova_ui",
    skills: ["Vue.js", "Figma", "CSS Modules", "Tailwind"],
    projects: [],
  },
  {
    id: 104,
    fio: "Козлов Дмитрий Андреевич",
    email: "kozlov@example.com",
    about: "DevOps инженер",
    tlgUsername: "@kozlov_ops",
    skills: ["Linux", "Bash", "CI/CD", "Kubernetes"],
    projects: [],
  },
];

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
  const [students] = useState<Student[]>(MOCK_STUDENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] =
    useState<ParticipantResponse | null>(null);

  const handleCreate = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    const [lastName, firstName, middleName] = student.fio.split(" ");
    const participant: ParticipantResponse = {
      id: student.id,
      firstName: firstName || "",
      lastName: lastName || "",
      middleName: middleName || "",
      bio: student.about,
      telegram: student.tlgUsername,
      createdById: 0,
      createdByName: "",
    };
    setEditingStudent(participant);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (savedStudent: ParticipantResponse) => {
    console.log("Saved student:", savedStudent);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={(e) => handleEdit(student, e)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <CardHeader className={styles.cardHeader}>
                  <div className={styles.avatarLarge}>
                    {getInitials(student.fio)}
                  </div>
                  <CardTitle className={styles.studentName}>
                    {student.fio}
                  </CardTitle>
                  <div className={styles.studentEmail}>
                    <Mail size={12} className="inline mr-1" />
                    {student.email}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col pt-0">
                  <div className="mb-4 flex-1">
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 font-medium">
                      <User size={16} />
                      <span>О себе</span>
                    </div>
                    <p className={styles.aboutText}>
                      {student.about || "Информация отсутствует"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 font-medium">
                      <GraduationCap size={16} />
                      <span>Навыки</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {student.skills.slice(0, 5).map((skill, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs bg-white"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {student.skills.length > 5 && (
                        <Badge variant="outline" className="text-xs bg-white">
                          +{student.skills.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                      <div className={styles.statValue}>
                        {student.projects.length}
                      </div>
                      <div className={styles.statLabel}>Проектов</div>
                    </div>
                    {student.tlgUsername && (
                      <div className={styles.statItem}>
                        <div className="text-blue-500 text-sm font-medium truncate max-w-[100px]">
                          {student.tlgUsername}
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
      </div>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={editingStudent}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};
