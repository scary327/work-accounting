import { useCallback, useMemo, useState } from "react";
import {
  SearchBar,
  SemesterBlock,
  ArchiveModal,
  type ArchiveCardData,
  type ModalData,
} from "./components";
import styles from "./Archive.module.css";

/**
 * Archive component - страница архива кейсов
 * Отображает архивированные кейсы по семестрам с поиском и фильтрацией
 */
export const Archive = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState<
    "all" | "accepted" | "rejected"
  >("all");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Моковые данные карточек осени
  const fallCards: ArchiveCardData[] = useMemo(
    () => [
      {
        id: "case-1",
        title: "Система аналитики транзакций",
        author: "Иван Петров",
        stack: "React, Spring Boot, PostgreSQL",
        status: "accepted",
        grade: 88,
        teamName: "Команда Alpha",
        teamMembers: ["Алексей Смирнов", "Дмитрий Иванов"],
      },
      {
        id: "case-2",
        title: "Мобильное приложение для инвестиций",
        author: "Анна Смирнова",
        stack: "React Native, Node.js, MongoDB",
        status: "accepted",
        grade: 92,
        teamName: "Команда Beta",
        teamMembers: ["Виктория Кузнецова", "Павел Морозов"],
      },
      {
        id: "case-3",
        title: "API Gateway для микросервисов",
        author: "Дмитрий Козлов",
        stack: "Go, Redis, Kubernetes",
        status: "accepted",
        grade: 79,
        teamName: "Команда Gamma",
        teamMembers: ["Сергей Волков", "Константин Соколов"],
      },
      {
        id: "case-4",
        title: "Блокчейн-платформа для смарт-контрактов",
        author: "Петр Васильев",
        stack: "Solidity, Ethereum, Web3.js",
        status: "rejected",
      },
      {
        id: "case-5",
        title: "Система распознавания лиц",
        author: "Екатерина Федорова",
        stack: "Python, TensorFlow, OpenCV",
        status: "rejected",
      },
      {
        id: "case-6",
        title: "IoT платформа для умного дома",
        author: "Максим Николаев",
        stack: "Arduino, MQTT, React",
        status: "rejected",
      },
    ],
    []
  );

  // Моковые данные карточек весны
  const springCards: ArchiveCardData[] = useMemo(
    () => [
      {
        id: "case-7",
        title: "Система управления документами",
        author: "Владимир Попов",
        stack: "Vue.js, Django, PostgreSQL",
        status: "accepted",
        grade: 85,
        teamName: "Команда Delta",
        teamMembers: ["Иван Петров", "Александр Сидоров"],
      },
      {
        id: "case-8",
        title: "Чат-бот для поддержки клиентов",
        author: "Светлана Романова",
        stack: "Python, NLP, Flask",
        status: "accepted",
        grade: 81,
        teamName: "Команда Epsilon",
        teamMembers: ["Мария Новикова", "Ольга Герасимова"],
      },
      {
        id: "case-9",
        title: "Платформа для онлайн-обучения",
        author: "Юрий Соловьев",
        stack: "Next.js, GraphQL, Firebase",
        status: "accepted",
        grade: 89,
        teamName: "Команда Zeta",
        teamMembers: ["Евгений Мальцев", "Федор Степанов"],
      },
      {
        id: "case-10",
        title: "Система рекомендаций фильмов",
        author: "Анна Лебедева",
        stack: "TensorFlow, FastAPI, PostgreSQL",
        status: "rejected",
      },
      {
        id: "case-11",
        title: "Мобильный кошелек",
        author: "Игорь Беляев",
        stack: "Flutter, Firebase, Stripe",
        status: "rejected",
      },
    ],
    []
  );

  // Моковые данные модального окна
  const modalDataMap = useMemo(
    (): Record<string, ModalData> => ({
      "case-1": {
        id: "case-1",
        title: "Система аналитики транзакций",
        author: "Иван Петров",
        description:
          "Полнофункциональная система аналитики финансовых транзакций с визуализацией данных и прогнозированием трендов.",
        stack: "React, Spring Boot, PostgreSQL, Chart.js",
        teamName: "Команда Alpha",
        teamMembers: ["Алексей Смирнов", "Дмитрий Иванов"],
        grade: 88,
        checkpoints: [
          {
            id: "cp-1",
            title: "Архитектура и планирование",
            score: 85,
            comment:
              "Хорошо продуманная архитектура с использованием микросервисов",
          },
          {
            id: "cp-2",
            title: "Реализация backend",
            score: 90,
            comment: "Отличная реализация API с правильной обработкой ошибок",
          },
          {
            id: "cp-3",
            title: "Реализация frontend",
            score: 88,
            comment: "Качественный интерфейс с хорошей UX",
          },
          {
            id: "cp-4",
            title: "Тестирование",
            score: 88,
            comment: "Полное покрытие unit-тестами и интеграционными тестами",
          },
        ],
      },
      "case-2": {
        id: "case-2",
        title: "Мобильное приложение для инвестиций",
        author: "Анна Смирнова",
        description:
          "Кроссплатформенное мобильное приложение для управления портфелем инвестиций с real-time котировками.",
        stack: "React Native, Node.js, MongoDB, Redux",
        teamName: "Команда Beta",
        teamMembers: ["Виктория Кузнецова", "Павел Морозов"],
        grade: 92,
        checkpoints: [
          {
            id: "cp-1",
            title: "UI/UX дизайн",
            score: 95,
            comment: "Интуитивный и красивый интерфейс",
          },
          {
            id: "cp-2",
            title: "Функциональность",
            score: 90,
            comment: "Все требуемые функции реализованы корректно",
          },
          {
            id: "cp-3",
            title: "Производительность",
            score: 92,
            comment: "Оптимизировано для работы на слабых устройствах",
          },
          {
            id: "cp-4",
            title: "Безопасность",
            score: 90,
            comment: "Хорошая реализация шифрования и аутентификации",
          },
        ],
      },
      "case-3": {
        id: "case-3",
        title: "API Gateway для микросервисов",
        author: "Дмитрий Козлов",
        description:
          "Масштабируемый gateway для маршрутизации и управления трафиком микросервисной архитектуры.",
        stack: "Go, Redis, Kubernetes, gRPC",
        teamName: "Команда Gamma",
        teamMembers: ["Сергей Волков", "Константин Соколов"],
        grade: 79,
        checkpoints: [
          {
            id: "cp-1",
            title: "Архитектура",
            score: 80,
            comment: "Логичная структура, но есть место для оптимизации",
          },
          {
            id: "cp-2",
            title: "Кодирование",
            score: 78,
            comment: "Хороший код, но некоторые части требуют рефакторинга",
          },
          {
            id: "cp-3",
            title: "Документация",
            score: 80,
            comment: "Документация достаточна, но могла бы быть подробнее",
          },
          {
            id: "cp-4",
            title: "Тестирование",
            score: 77,
            comment: "Покрытие тестами среднее, требуется расширение",
          },
        ],
      },
    }),
    []
  );

  // Фильтрация карточек
  const filterCards = useCallback(
    (cards: ArchiveCardData[]): ArchiveCardData[] => {
      return cards.filter((card) => {
        const matchesSearch =
          card.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          card.author.toLowerCase().includes(searchValue.toLowerCase()) ||
          card.stack.toLowerCase().includes(searchValue.toLowerCase());

        const matchesFilter =
          filterValue === "all" || card.status === filterValue;

        return matchesSearch && matchesFilter;
      });
    },
    [searchValue, filterValue]
  );

  const filteredFallCards = useMemo(
    () => filterCards(fallCards),
    [filterCards, fallCards]
  );

  const filteredSpringCards = useMemo(
    () => filterCards(springCards),
    [filterCards, springCards]
  );

  // Обработчики
  const handleViewCard = useCallback((cardId: string) => {
    setSelectedCardId(cardId);
  }, []);

  const handleNominateCard = useCallback((cardTitle: string) => {
    alert(
      `Кейс "${cardTitle}" выдвинут на новый семестр и появится в разделе "Отбор кейсов"`
    );
  }, []);

  const selectedModalData = selectedCardId
    ? modalDataMap[selectedCardId]
    : undefined;

  return (
    <div className={styles.archive}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Архив проектов</h1>
          <SearchBar
            searchValue={searchValue}
            filterValue={filterValue}
            onSearchChange={setSearchValue}
            onFilterChange={setFilterValue as (value: string) => void}
          />
        </header>

        {filteredFallCards.length > 0 && (
          <SemesterBlock
            title="Осень 2025"
            cards={filteredFallCards}
            onViewCard={handleViewCard}
            onNominateCard={handleNominateCard}
          />
        )}

        {filteredSpringCards.length > 0 && (
          <SemesterBlock
            title="Весна 2025"
            cards={filteredSpringCards}
            onViewCard={handleViewCard}
            onNominateCard={handleNominateCard}
          />
        )}

        {filteredFallCards.length === 0 && filteredSpringCards.length === 0 && (
          <div className={styles.emptyState}>
            <p>Кейсы не найдены</p>
          </div>
        )}
      </div>

      <ArchiveModal
        isOpen={selectedCardId !== null}
        data={selectedModalData}
        onClose={() => setSelectedCardId(null)}
      />
    </div>
  );
};
