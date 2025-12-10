import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import styles from "./CaseCard.module.css";

export interface CaseCardData {
  id: string;
  title: string;
  author: string;
  authorInitials: string;
  description: string;
  stack: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  userVote?: "up" | "down" | null;
}

interface CaseCardProps {
  data: CaseCardData;
  onClick: () => void;
  onUpvote: () => void;
  onDownvote: () => void;
  onComments: () => void;
}

const MotionCard = motion(Card);

export const CaseCard = ({
  data,
  onClick,
  onUpvote,
  onDownvote,
  onComments,
}: CaseCardProps) => {
  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpvote();
  };

  const handleDownvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownvote();
  };

  const handleCommentsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComments();
  };

  return (
    <MotionCard
      className={styles.card}
      onClick={onClick}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <CardHeader className={`${styles.header} p-0 space-y-0`}>
        <div className={styles.avatar}>{data.authorInitials}</div>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>{data.title}</h3>
          <p className={styles.author}>{data.author}</p>
        </div>
      </CardHeader>

      <CardContent className="p-0 mt-4">
        <p className={styles.description}>{data.description}</p>
        <div className="mt-3">
          <Badge variant="secondary" className={styles.stack}>
            {data.stack}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className={`${styles.actions} p-0 mt-4`}>
        <Button
          variant="ghost"
          size="sm"
          className={`${styles.actionBtn} ${
            data.userVote === "up" ? styles.activeUp : ""
          } hover:bg-transparent`}
          onClick={handleUpvoteClick}
          title="Поддержать кейс"
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
          <span>{data.upvotes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`${styles.actionBtn} ${
            data.userVote === "down" ? styles.activeDown : ""
          } hover:bg-transparent`}
          onClick={handleDownvoteClick}
          title="Не поддержать кейс"
        >
          <ThumbsDown className="w-4 h-4 mr-2" />
          <span>{data.downvotes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`${styles.actionBtn} hover:bg-transparent`}
          onClick={handleCommentsClick}
          title="Комментарии"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          <span>{data.comments}</span>
        </Button>
      </CardFooter>
    </MotionCard>
  );
};
