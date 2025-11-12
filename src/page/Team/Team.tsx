import { useMemo, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Team.module.css";
import {
  TeamHeader,
  TeamMembers,
  CurrentProject,
  ProjectHistory,
  ProjectModal,
} from "./components";

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Project {
  id: string;
  semester: string;
  title: string;
  mentor: string;
  stack: string[];
  teamComposition: string[];
  grade: number;
  description: string;
  checkpoints: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
}

/**
 * Team page component - информация о команде, её членах и проектах
 * Поддерживает динамический ID команды через /team/:id
 */
export const Team = () => {
  const { id: teamId } = useParams<{ id: string }>();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  // Моковые данные для команды
  const teamData = useMemo(
    () => ({
      id: teamId || "alpha", // Позже будет использоваться для загрузки с API
      name: "Команда Alpha",
      createdSemester: "Осень 2024",
      completedProjects: 2,
      members: [
        {
          id: "1",
          name: "Алексей Иванов",
          role: "Team Lead",
          avatar: "АИ",
        },
        {
          id: "2",
          name: "Мария Петрова",
          role: "Frontend Developer",
          avatar: "МП",
        },
        {
          id: "3",
          name: "Сергей Сидоров",
          role: "Backend Developer",
          avatar: "СС",
        },
        {
          id: "4",
          name: "Елена Козлова",
          role: "QA Engineer",
          avatar: "ЕК",
        },
      ] as Member[],
      currentProject: {
        title: "Система аналитики транзакций",
        mentor: "Иван Петров",
        stack: ["React", "TypeScript", "Spring Boot", "PostgreSQL", "Docker"],
        status: "В работе",
      },
      projectHistory: [
        {
          id: "proj-1",
          semester: "Весна 2025",
          title: "Система управления документами",
          mentor: "Владимир Попов",
          stack: ["Vue.js", "Django", "PostgreSQL"],
          teamComposition: [
            "Алексей Иванов",
            "Мария Петрова",
            "Дмитрий Волков",
          ],
          grade: 82,
          description:
            "Разработка системы электронного документооборота с возможностью создания, согласования и хранения документов. Проект включает систему прав доступа, версионирование документов и интеграцию с электронной подписью.",
          checkpoints: [
            {
              name: "Планирование и дизайн",
              score: 85,
              comment: "Хорошо продумана архитектура системы, точные сроки",
            },
            {
              name: "Разработка MVP",
              score: 80,
              comment: "Основной функционал реализован, требует оптимизации",
            },
            {
              name: "Тестирование и финализация",
              score: 82,
              comment: "Хорошее покрытие тестами, есть небольшие баги",
            },
          ],
        } as Project,
        {
          id: "proj-2",
          semester: "Осень 2024",
          title: "Чат-бот для поддержки клиентов",
          mentor: "Светлана Романова",
          stack: ["Python", "NLP", "Rasa"],
          teamComposition: [
            "Алексей Иванов",
            "Сергей Сидоров",
            "Елена Козлова",
            "Константин Зайцев",
          ],
          grade: 91,
          description:
            "Разработка интеллектуального чат-бота на базе Rasa для автоматизации ответов на часто задаваемые вопросы. Система способна обучаться на новых диалогах и совершенствовать свои ответы.",
          checkpoints: [
            {
              name: "Разработка базовых моделей NLP",
              score: 92,
              comment:
                "Отличная работа с моделями, высокая точность распознавания",
            },
            {
              name: "Интеграция с системой поддержки",
              score: 90,
              comment: "Хорошо интегрирован, требует небольших улучшений",
            },
            {
              name: "Обучение и тестирование",
              score: 91,
              comment: "Боту хорошо удаётся обслуживать пользователей",
            },
          ],
        } as Project,
      ] as Project[],
    }),
    [teamId]
  );

  const handleSelectProject = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProjectId(null);
  }, []);

  const selectedProject = useMemo(
    () => teamData.projectHistory.find((p) => p.id === selectedProjectId),
    [selectedProjectId, teamData.projectHistory]
  );

  return (
    <div className={styles.team}>
      <div className={styles.container}>
        <TeamHeader team={teamData} />

        <div className={styles.content}>
          <TeamMembers members={teamData.members} />
          <CurrentProject project={teamData.currentProject} />
          <ProjectHistory
            projects={teamData.projectHistory}
            onSelectProject={handleSelectProject}
          />
        </div>

        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            isOpen={!!selectedProjectId}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};
