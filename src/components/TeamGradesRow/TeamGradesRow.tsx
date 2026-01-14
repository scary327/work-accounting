import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./TeamGradesRow.module.css";
import { useTeamGrades } from "../../api/hooks/useTeamGrades";
import type { Grade } from "../../api/types";

interface TeamGradesRowProps {
  teamId: string | number;
  projectId: string | number;
  teamName: string;
  averageRating?: number | null;
  members?: string[];
}

export const TeamGradesRow: React.FC<TeamGradesRowProps> = ({
  teamId,
  projectId,
  teamName,
  averageRating,
  members = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { loadGrades, isLoading, hasError, getGrades } = useTeamGrades();

  const grades = getGrades(teamId, projectId);

  const handleToggle = async () => {
    if (!isExpanded && !grades) {
      await loadGrades(teamId, projectId);
    }
    setIsExpanded(!isExpanded);
  };

  const calculateAverage = (gradesArray: Grade[]): string => {
    if (gradesArray.length === 0) return "0.00";
    const sum = gradesArray.reduce((acc, g) => acc + g.score, 0);
    const average = sum / gradesArray.length;
    return average.toFixed(2);
  };

  const formatRating = (rating: number | null | undefined): string => {
    if (rating === null || rating === undefined) return "—";
    return typeof rating === "number" ? rating.toFixed(2) : "—";
  };

  return (
    <div className={styles.container}>
      <div className={styles.teamHeader}>
        <h4 className={styles.teamTitle}>{teamName}</h4>
      </div>

      {members.length > 0 && (
        <div className={styles.membersSection}>
          {members.map((member, idx) => {
            const initials = member
              .split(" ")
              .filter((n) => n.length > 0)
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
              .toUpperCase();
            return (
              <div key={idx} className={styles.memberItem}>
                <div className={styles.memberAvatar}>{initials}</div>
                <div className={styles.memberName}>{member}</div>
              </div>
            );
          })}
        </div>
      )}

      <button
        className={styles.ratingButton}
        onClick={handleToggle}
        type="button"
      >
        <div className={styles.ratingContent}>
          <span className={styles.ratingLabel}>Средняя оценка</span>
          <span className={styles.ratingValue}>
            {formatRating(averageRating)}
          </span>
        </div>
        <ChevronDown
          className={`${styles.chevron} ${isExpanded ? styles.expanded : ""}`}
          size={20}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.expandedContent}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading(teamId, projectId) && (
              <div className={styles.loader}>
                <div className={styles.spinner}></div>
                <p>Загрузка оценок...</p>
              </div>
            )}

            {hasError(teamId, projectId) && (
              <div className={styles.error}>
                <p>Ошибка при загрузке оценок</p>
              </div>
            )}

            {grades && grades.length > 0 && (
              <div className={styles.gradesList}>
                {grades.map((grade, idx) => (
                  <div key={grade.id || idx} className={styles.gradeItem}>
                    <div className={styles.gradeHeader}>
                      <span className={styles.evaluator}>
                        {grade.authorName ||
                          grade.evaluatorName ||
                          "Неизвестный оценивающий"}
                      </span>
                      <span
                        className={`${styles.score} ${
                          grade.score >= 40 ? styles.scoreGood : styles.scoreBad
                        }`}
                      >
                        {grade.score}
                      </span>
                    </div>
                    {grade.comment && (
                      <p className={styles.comment}>{grade.comment}</p>
                    )}
                    {grade.feedback && (
                      <p className={styles.feedback}>{grade.feedback}</p>
                    )}
                  </div>
                ))}
                <div className={styles.summary}>
                  <strong>Средняя оценка: {calculateAverage(grades)}</strong>
                </div>
              </div>
            )}

            {grades && grades.length === 0 && (
              <div className={styles.empty}>
                <p>Оценок нет</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
