import { useCallback, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  CasesFeed,
  CaseModal,
  CreateCaseModal,
  type CaseCardData,
  type CaseModalData,
} from "./components";
import styles from "./CasesSelection.module.css";

/**
 * CasesSelection component - страница отбора кейсов
 * Отображает ленту с доступными кейсами для выбора команд
 */
export const CasesSelection = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userVotes, setUserVotes] = useState<
    Record<string, "up" | "down" | null>
  >({});

  const cases: CaseCardData[] = useMemo(
    () => [
      {
        id: "case-1",
        title: "Система аналитики транзакций",
        author: "Иван Петров",
        authorInitials: "ИП",
        description:
          "Разработка системы real-time аналитики банковских транзакций с визуализацией данных и выявлением аномалий. Проект включает создание дашборда для мониторинга...",
        stack: "React, TypeScript, Spring Boot, PostgreSQL, Docker",
        upvotes: 12,
        downvotes: 2,
        comments: 8,
        userVote: userVotes["case-1"] || null,
      },
      {
        id: "case-2",
        title: "Мобильное приложение для инвестиций",
        author: "Анна Смирнова",
        authorInitials: "АС",
        description:
          "Создание кросс-платформенного мобильного приложения для частных инвестиций с интеграцией торговых API и системой рекомендаций на основе ML...",
        stack: "React Native, Node.js, MongoDB, TensorFlow",
        upvotes: 9,
        downvotes: 1,
        comments: 5,
        userVote: userVotes["case-2"] || null,
      },
      {
        id: "case-3",
        title: "API Gateway для микросервисов",
        author: "Дмитрий Козлов",
        authorInitials: "ДК",
        description:
          "Разработка централизованного API Gateway для управления микросервисной архитектурой с функциями аутентификации, rate limiting и мониторинга...",
        stack: "Go, Redis, Kubernetes, gRPC",
        upvotes: 15,
        downvotes: 0,
        comments: 12,
        userVote: userVotes["case-3"] || null,
      },
    ],
    [userVotes]
  );

  const caseModalDataMap = useMemo(
    (): Record<string, CaseModalData> => ({
      "case-1": {
        id: "case-1",
        title: "Система аналитики транзакций",
        author: "Иван Петров",
        description:
          "Разработка системы real-time аналитики банковских транзакций с визуализацией данных и выявлением аномалий. Проект включает создание дашборда для мониторинга финансовых операций в режиме реального времени, настройку алертинга при обнаружении подозрительной активности и интеграцию с существующими банковскими системами.",
        goals: [
          "Создать систему мониторинга транзакций с задержкой не более 100мс",
          "Реализовать алгоритмы выявления аномалий с точностью 95%+",
          "Разработать интуитивный дашборд для аналитиков",
          "Обеспечить масштабируемость до 10000 транзакций/сек",
        ],
        stack:
          "React, TypeScript, Spring Boot, PostgreSQL, Docker, Kafka, Redis",
        teamSize: "4-5 человек",
        upvotes: 12,
        downvotes: 2,
        comments: [
          {
            id: "c1",
            author: "Виктор Соколов",
            text: "Интересный проект! Хотим присоединиться к команде.",
          },
          {
            id: "c2",
            author: "Мария Петрова",
            text: "Какой опыт требуется? Я работала с React и Spring.",
          },
        ],
        userVote: userVotes["case-1"] || null,
      },
      "case-2": {
        id: "case-2",
        title: "Мобильное приложение для инвестиций",
        author: "Анна Смирнова",
        description:
          "Создание кросс-платформенного мобильного приложения для частных инвестиций с интеграцией торговых API и системой рекомендаций на основе ML.",
        goals: [
          "Разработать мобильное приложение на React Native",
          "Интегрировать торговые API основных бирж",
          "Реализовать ML-систему рекомендаций",
          "Обеспечить высокий уровень безопасности финансовых данных",
        ],
        stack: "React Native, Node.js, MongoDB, TensorFlow, Firebase",
        teamSize: "3-4 человека",
        upvotes: 9,
        downvotes: 1,
        comments: [{ id: "c1", author: "Сергей", text: "Отличная идея!" }],
        userVote: userVotes["case-2"] || null,
      },
      "case-3": {
        id: "case-3",
        title: "API Gateway для микросервисов",
        author: "Дмитрий Козлов",
        description:
          "Разработка централизованного API Gateway для управления микросервисной архитектурой с функциями аутентификации, rate limiting и мониторинга.",
        goals: [
          "Разработать высокопроизводительный API Gateway",
          "Реализовать систему аутентификации и авторизации",
          "Создать систему rate limiting и load balancing",
          "Обеспечить мониторинг и логирование всех запросов",
        ],
        stack: "Go, Redis, Kubernetes, gRPC, Docker",
        teamSize: "5-6 человек",
        upvotes: 15,
        downvotes: 0,
        comments: [
          {
            id: "c1",
            author: "Иван",
            text: "Этот проект очень нам нужен!",
          },
          {
            id: "c2",
            author: "Алексей",
            text: "Требуется опыт с Kubernetes?",
          },
          {
            id: "c3",
            author: "Дмитрий",
            text: "Да, желателен опыт работы с K8s",
          },
        ],
        userVote: userVotes["case-3"] || null,
      },
    }),
    [userVotes]
  );

  // Обработчики
  const handleCaseClick = useCallback((caseId: string) => {
    setSelectedCaseId(caseId);
  }, []);

  const handleUpvote = useCallback((caseId: string) => {
    setUserVotes((prev) => ({
      ...prev,
      [caseId]: prev[caseId] === "up" ? null : "up",
    }));
  }, []);

  const handleDownvote = useCallback((caseId: string) => {
    setUserVotes((prev) => ({
      ...prev,
      [caseId]: prev[caseId] === "down" ? null : "down",
    }));
  }, []);

  const handleVoteUp = useCallback(
    (caseId: string) => {
      handleUpvote(caseId);
    },
    [handleUpvote]
  );

  const handleVoteDown = useCallback(
    (caseId: string) => {
      handleDownvote(caseId);
    },
    [handleDownvote]
  );

  const handleCreateCase = useCallback(
    (formData: {
      title: string;
      description: string;
      stack: string;
      teamSize: number;
    }) => {
      alert(
        `Кейс "${formData.title}" успешно создан и добавлен в ленту! Размер команды: ${formData.teamSize}`
      );
      setIsCreateModalOpen(false);
    },
    []
  );

  const selectedModalData = selectedCaseId
    ? caseModalDataMap[selectedCaseId]
    : undefined;

  return (
    <div className={styles.casesSelection}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Отбор кейсов</h1>
          <Button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Предложить новый кейс
          </Button>
        </header>

        <CasesFeed
          cases={cases}
          onCaseClick={handleCaseClick}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
          onComments={handleCaseClick}
        />
      </div>

      <CaseModal
        isOpen={selectedCaseId !== null}
        data={selectedModalData}
        onClose={() => setSelectedCaseId(null)}
        onVoteUp={handleVoteUp}
        onVoteDown={handleVoteDown}
      />

      <CreateCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCase}
      />
    </div>
  );
};
