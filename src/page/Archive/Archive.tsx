import { useCallback, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SearchBar, SemesterBlock, type ArchiveCardData } from "./components";
import { ProjectInfoModal } from "../../components/ProjectInfoModal/ProjectInfoModal";
import { useCustomSearchParams } from "../../hooks/useCustomSearchParams";
import { semestersApi } from "../../api/semestersApi";
import { projectsApi } from "../../api/projectsApi";
import { useProjectComments } from "../../api/hooks/useProjects";
import type {
  SemesterDetailsResponse,
  ProjectDetailsResponse,
} from "../../api/types";
import styles from "./Archive.module.css";

/**
 * Archive component - страница архива кейсов
 * Отображает архивированные кейсы по семестрам с поиском и фильтрацией
 */
export const Archive = () => {
  const { getParam, setParam } = useCustomSearchParams();
  const [semestersData, setSemestersData] = useState<SemesterDetailsResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedProjectDetails, setSelectedProjectDetails] =
    useState<ProjectDetailsResponse | null>(null);

  const searchValue = getParam("query") || "";
  const filterValue = getParam("statuses") || "all";

  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchValue !== searchValue) {
        setParam("query", localSearchValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchValue, searchValue, setParam]);

  const fetchSemesters = useCallback(async () => {
    setIsLoading(true);
    try {
      const statuses =
        filterValue === "all"
          ? [
              "VOTING",
              "APPROVED",
              "ARCHIVED_CANCELED",
              "ARCHIVED_COMPLETED",
              "IN_PROGRESS",
            ]
          : [filterValue];

      const data = await semestersApi.getSemestersDetails({
        query: searchValue,
        statuses: statuses,
        page: 0,
        size: 100,
      });
      setSemestersData(data.content);
    } catch (error) {
      console.error("Failed to fetch archive data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchValue, filterValue]);

  useEffect(() => {
    fetchSemesters();
  }, [fetchSemesters]);

  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value);
  };

  const handleFilterChange = (value: string) => {
    setParam("statuses", value);
  };

  const { data: comments = [] } = useProjectComments(
    parseInt(selectedCardId || "0"),
    {
      page: 0,
      size: 50,
    }
  );

  const selectedProjectFromList = useMemo(() => {
    if (!selectedCardId) return null;
    for (const semester of semestersData) {
      const project = semester.projects.find(
        (p) => p.id.toString() === selectedCardId
      );
      if (project) return project;
    }
    return null;
  }, [selectedCardId, semestersData]);

  // Обработчики
  const handleViewCard = useCallback(async (cardId: string) => {
    setSelectedCardId(cardId);
    try {
      const details = await projectsApi.getProjectById(parseInt(cardId));
      setSelectedProjectDetails(details);
    } catch (error) {
      console.error("Failed to fetch project details:", error);
    }
  }, []);

  const handleNominateCard = useCallback((cardTitle: string) => {
    alert(
      `Кейс "${cardTitle}" выдвинут на новый семестр и появится в разделе "Отбор кейсов"`
    );
  }, []);

  return (
    <div className={styles.archive}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Архив проектов</h1>
          <SearchBar
            searchValue={localSearchValue}
            filterValue={filterValue}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {semestersData.map((semester) => {
              // Map API data to ArchiveCardData format
              const cards: ArchiveCardData[] = semester.projects.map(
                (project) => {
                  let status: ArchiveCardData["status"] = "canceled";
                  switch (project.status) {
                    case "ARCHIVED_COMPLETED":
                      status = "completed";
                      break;
                    case "ARCHIVED_CANCELED":
                      status = "canceled";
                      break;
                    case "VOTING":
                      status = "voting";
                      break;
                    case "APPROVED":
                      status = "approved";
                      break;
                    case "IN_PROGRESS":
                      status = "in_progress";
                      break;
                  }

                  return {
                    id: project.id.toString(),
                    title: project.title,
                    author: project.curators.join(", "), // Assuming curators are strings
                    stack: project.techStack,
                    status: status,
                    grade: project.teams[0]?.averageRating || 0, // Taking first team's rating for now
                    teamName: project.teams[0]?.name || "Без команды",
                    teamMembers: project.teams[0]?.members || [],
                  };
                }
              );

              if (cards.length === 0) return null;

              return (
                <SemesterBlock
                  key={semester.id}
                  title={semester.name}
                  cards={cards}
                  onViewCard={handleViewCard}
                  onNominateCard={handleNominateCard}
                />
              );
            })}

            {semestersData.length === 0 && (
              <motion.div
                className={styles.emptyState}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p>Кейсы не найдены</p>
              </motion.div>
            )}
          </>
        )}
      </div>

      <ProjectInfoModal
        isOpen={selectedCardId !== null}
        onClose={() => {
          setSelectedCardId(null);
          setSelectedProjectDetails(null);
        }}
        readOnly={true}
        data={
          selectedProjectDetails
            ? {
                id: selectedProjectDetails.id.toString(),
                title: selectedProjectDetails.title,
                author: selectedProjectDetails.creatorFio,
                description: selectedProjectDetails.description,
                semester: selectedProjectDetails.semesterName,
                stack: selectedProjectDetails.techStack,
                upvotes: selectedProjectDetails.likesCount,
                downvotes: selectedProjectDetails.dislikesCount,
                comments: comments.map((c) => ({
                  id: c.id.toString(),
                  author: c.authorName,
                  text: c.body,
                })),
                status: (() => {
                  switch (selectedProjectDetails.status) {
                    case "ARCHIVED_COMPLETED":
                      return "✅ Завершен";
                    case "ARCHIVED_CANCELED":
                      return "❌ Отменен";
                    case "VOTING":
                      return "🗳️ Голосование";
                    case "APPROVED":
                      return "👍 Одобрен";
                    case "IN_PROGRESS":
                      return "🚧 В работе";
                    default:
                      return selectedProjectDetails.status;
                  }
                })(),
                mentors: selectedProjectDetails.mentors
                  .map((m) => m.fullName)
                  .join(", "),
                teamName: selectedProjectFromList?.teams[0]?.name,
                teamMembers: selectedProjectFromList?.teams[0]?.members,
                grade: selectedProjectFromList?.teams[0]?.averageRating,
              }
            : undefined
        }
      />
    </div>
  );
};
