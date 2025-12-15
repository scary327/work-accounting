import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Check, X } from "lucide-react";
import styles from "./ProjectCard.module.css";

export interface ProjectCardData {
  id: string;
  title: string;
  author: string;
  stack: string;
  status: "accepted" | "rejected";
  grade?: number;
  teamName?: string;
  teamMembers?: string[];
}

export interface ProjectCardProps {
  card: ProjectCardData;
  onViewDetails?: (cardId: string) => void;
  onNominate?: (cardTitle: string) => void;
  isClickable?: boolean;
}

/**
 * ProjectCard component - переиспользуемая карточка проекта
 * Используется в Archive, Dashboard и других местах
 */
export const ProjectCard = ({
  card,
  onViewDetails,
  onNominate,
  isClickable = true,
}: ProjectCardProps) => {
  const isAccepted = card.status === "accepted";
  const statusVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const handleDetailsClick = () => {
    if (isAccepted && isClickable) {
      onViewDetails?.(card.id);
    }
  };

  const handleNominateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNominate?.(card.title);
  };

  return (
    <motion.div
      variants={statusVariants}
      whileHover={isAccepted && isClickable ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`${styles.card} ${styles[card.status]} ${
          isAccepted && isClickable ? styles.clickable : ""
        }`}
        onClick={handleDetailsClick}
      >
        <div className={styles.content}>
          {/* Status Badge */}
          <div className={styles.statusBadge}>
            {isAccepted ? (
              <Badge variant="default" className={styles.badge}>
                <Check size={14} className={styles.badgeIcon} />
                Принят
              </Badge>
            ) : (
              <Badge variant="destructive" className={styles.badge}>
                <X size={14} className={styles.badgeIcon} />
                Отклонён
              </Badge>
            )}
          </div>

          {/* Title and Author */}
          <h3 className={styles.title}>{card.title}</h3>
          <p className={styles.author}>наставник: {card.author}</p>

          {/* Stack */}
          <div className={styles.stackBadges}>
            {card.stack.split(",").map((tech, idx) => (
              <Badge key={idx} variant="outline" className={styles.techBadge}>
                {tech.trim()}
              </Badge>
            ))}
          </div>

          {/* Team Info */}
          {isAccepted && card.teamName && (
            <div className={styles.teamInfo}>
              <p className={styles.teamName}>{card.teamName}</p>
              {card.teamMembers && (
                <p className={styles.teamMembers}>
                  {card.teamMembers.join(", ")}
                </p>
              )}
            </div>
          )}

          {/* Grade */}
          {isAccepted && card.grade !== undefined && (
            <div className={styles.gradeSection}>
              <div className={styles.grade}>
                <div className={styles.gradeValue}>{card.grade}</div>
                <div className={styles.gradeLabel}>/100</div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {isAccepted && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant="outline"
                onClick={handleNominateClick}
                className={styles.nominateBtn}
              >
                Выдвинуть кейс
              </Button>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
