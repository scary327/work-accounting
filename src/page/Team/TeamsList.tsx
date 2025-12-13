import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Briefcase, Plus, Pencil } from "lucide-react";
import type { Team } from "../../api/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { TeamModal } from "./components/TeamModal";
import styles from "./TeamsList.module.css";

const MOCK_TEAMS: Team[] = [
  {
    id: 1,
    name: "Команда Alpha",
    participants: [
      { id: 101, fio: "Иванов Иван Иванович" },
      { id: 102, fio: "Петров Петр Петрович" },
      { id: 103, fio: "Сидоров Сидор Сидорович" },
    ],
    currentProject: {
      semesterName: "Осень 2024",
      title: "Система учета рабочего времени",
      mentors: ["Сидоров С.С."],
      techStack: "React, Node.js, PostgreSQL",
      description: "Разработка системы учета рабочего времени",
      averageGrade: 4.5,
    },
    projectHistory: [],
  },
  {
    id: 2,
    name: "Команда Beta",
    participants: [
      { id: 104, fio: "Смирнов Алексей" },
      { id: 105, fio: "Кузнецова Мария" },
    ],
    currentProject: null,
    projectHistory: [
      {
        semesterName: "Весна 2024",
        title: "Корпоративный портал",
        mentors: ["Козлов А.А."],
        techStack: "Vue, Python, Django",
        description: "Внутренний портал для сотрудников",
        averageGrade: 4.8,
      },
    ],
  },
  {
    id: 3,
    name: "Команда Gamma",
    participants: [
      { id: 106, fio: "Волков Дмитрий" },
      { id: 107, fio: "Соколова Елена" },
      { id: 108, fio: "Морозов Павел" },
      { id: 109, fio: "Новикова Анна" },
    ],
    currentProject: {
      semesterName: "Осень 2024",
      title: "Мобильное приложение доставки",
      mentors: ["Ильин П.П."],
      techStack: "React Native, Firebase",
      description: "Приложение для курьеров и клиентов",
      averageGrade: 4.2,
    },
    projectHistory: [],
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

export const TeamsList = () => {
  const navigate = useNavigate();
  const [teams] = useState<Team[]>(MOCK_TEAMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleCreate = () => {
    setEditingTeam(null);
    setIsModalOpen(true);
  };

  const handleEdit = (team: Team, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    // Refresh list logic here
    console.log("Team saved");
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
          <h1 className={styles.title}>Команды</h1>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Создать команду
          </Button>
        </div>

        <motion.div
          className={styles.grid}
          variants={container}
          initial="hidden"
          animate="show"
        >
          {teams.map((team) => (
            <motion.div key={team.id} variants={item}>
              <Card
                className={`${styles.card} group relative`}
                onClick={() => navigate(`/team/${team.id}`)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={(e) => handleEdit(team, e)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <CardHeader className={styles.cardHeader}>
                  <CardTitle className={styles.teamName}>{team.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 font-medium">
                      <Users size={16} />
                      <span>Участники ({team.participants.length})</span>
                    </div>
                    <ul className={styles.participantsList}>
                      {team.participants.slice(0, 3).map((p) => (
                        <li key={p.id} className={styles.participant}>
                          <div className={styles.avatar}>
                            {getInitials(p.fio)}
                          </div>
                          <span>{p.fio}</span>
                        </li>
                      ))}
                      {team.participants.length > 3 && (
                        <li className={styles.participant}>
                          <div className={styles.avatar}>
                            +{team.participants.length - 3}
                          </div>
                          <span>ещё...</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className={styles.projectSection}>
                    <div className={styles.projectLabel}>
                      <Briefcase size={14} className="inline mr-1" />
                      Текущий проект
                    </div>
                    {team.currentProject ? (
                      <div>
                        <div className={styles.projectTitle}>
                          {team.currentProject.title}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {team.currentProject.techStack
                            .split(",")
                            .slice(0, 3)
                            .map((tech, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tech.trim()}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <p className={styles.emptyProject}>
                        Нет активного проекта
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <TeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        team={editingTeam}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};
