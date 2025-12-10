import { useMemo, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { StudentHeader, CurrentTeam, ProjectHistory } from "./components";
import { ProjectDetailsModal } from "../../components/ProjectDetailsModal/ProjectDetailsModal";
import styles from "./Student.module.css";

interface Project {
  id: string;
  semester: string;
  title: string;
  mentor: string;
  teamName: string;
  teamId: string;
  stack: string[];
  grade: number;
  description: string;
  checkpoints: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  teamComposition: string[];
}

interface StudentData {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  github: string;
  projectsCompleted: number;
  averageGrade: number;
  teamsCount: number;
  currentTeam: {
    id: string;
    name: string;
    currentProject: string;
  } | null;
  projects: Project[];
}

/**
 * Student page component - профиль студента с его командами и проектами
 * Поддерживает динамический ID студента через /student/:id
 */
export const Student = () => {
  const { id: studentId } = useParams<{ id: string }>();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  // Моковые данные для студента
  const studentData = useMemo<StudentData>(
    () => ({
      id: studentId || "alexey-ivanov",
      name: "Алексей Иванов",
      avatar: "АИ",
      email: "a.ivanov@student.university.edu",
      phone: "+7 (999) 123-45-67",
      github: "@alexivanov",
      projectsCompleted: 3,
      averageGrade: 87,
      teamsCount: 2,
      currentTeam: {
        id: "alpha",
        name: "Команда Alpha",
        currentProject: "Система аналитики транзакций",
      },
      projects: [
        {
          id: "proj-1",
          semester: "Весна 2025",
          title: "Система управления документами",
          mentor: "Владимир Попов",
          teamName: "Команда Alpha",
          teamId: "alpha",
          stack: ["Vue.js", "Django", "PostgreSQL"],
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
          teamComposition: [
            "Алексей Иванов",
            "Мария Петрова",
            "Дмитрий Волков",
          ],
        },
        {
          id: "proj-2",
          semester: "Осень 2024",
          title: "Чат-бот для поддержки клиентов",
          mentor: "Светлана Романова",
          teamName: "Команда Alpha",
          teamId: "alpha",
          stack: ["Python", "NLP", "Rasa"],
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
          teamComposition: [
            "Алексей Иванов",
            "Сергей Сидоров",
            "Елена Козлова",
            "Константин Зайцев",
          ],
        },
        {
          id: "proj-3",
          semester: "Весна 2024",
          title: "Мобильное приложение для инвестиций",
          mentor: "Анна Смирнова",
          teamName: "Команда Beta",
          teamId: "beta",
          stack: ["React Native", "Node.js", "MongoDB"],
          grade: 88,
          description:
            "Разработка мобильного приложения для управления инвестиционным портфелем с возможностью отслеживания котировок в реальном времени, аналитикой доходности и рекомендациями по диверсификации.",
          checkpoints: [
            {
              name: "UI/UX дизайн и прототип",
              score: 90,
              comment: "Отличный дизайн, интуитивный интерфейс",
            },
            {
              name: "Разработка core функционала",
              score: 87,
              comment: "Хорошая реализация основных возможностей",
            },
            {
              name: "Тестирование и релиз",
              score: 88,
              comment: "Приложение стабильно работает на iOS и Android",
            },
          ],
          teamComposition: [
            "Алексей Иванов",
            "Ольга Новикова",
            "Максим Федоров",
          ],
        },
      ],
    }),
    [studentId]
  );

  const handleSelectProject = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProjectId(null);
  }, []);

  const selectedProject = useMemo(
    () => studentData.projects.find((p) => p.id === selectedProjectId),
    [selectedProjectId, studentData.projects]
  );

  return (
    <motion.div
      className={styles.student}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        <StudentHeader student={studentData} />

        <div className="flex flex-col gap-6">
          <CurrentTeam
            currentTeam={studentData.currentTeam}
            stats={{
              projectsCompleted: studentData.projectsCompleted,
              averageGrade: studentData.averageGrade,
              teamsCount: studentData.teamsCount,
            }}
          />
          <ProjectHistory
            projects={studentData.projects}
            onSelectProject={handleSelectProject}
          />
        </div>

        <ProjectDetailsModal
          isOpen={!!selectedProjectId}
          onClose={handleCloseModal}
          data={
            selectedProject
              ? {
                  id: selectedProject.id,
                  title: selectedProject.title,
                  mentor: selectedProject.mentor,
                  description: selectedProject.description,
                  stack: selectedProject.stack,
                  teamName: selectedProject.teamName,
                  teamId: selectedProject.teamId,
                  teamMembers: selectedProject.teamComposition,
                  grade: selectedProject.grade,
                  checkpoints: selectedProject.checkpoints.map((cp) => ({
                    title: cp.name,
                    score: cp.score,
                    comment: cp.comment,
                  })),
                  status: "✅ Завершен",
                }
              : null
          }
        />
      </div>
    </motion.div>
  );
};
