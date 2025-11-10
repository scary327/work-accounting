import styles from "./CasesFeed.module.css";
import { CaseCard, type CaseCardData } from "./CaseCard";

interface CasesFeedProps {
  cases: CaseCardData[];
  onCaseClick?: (caseId: string) => void;
  onUpvote?: (caseId: string) => void;
  onDownvote?: (caseId: string) => void;
  onComments?: (caseId: string) => void;
}

/**
 * CasesFeed component - лента с кейсами
 */
export const CasesFeed = ({
  cases,
  onCaseClick,
  onUpvote,
  onDownvote,
  onComments,
}: CasesFeedProps) => {
  return (
    <div className={styles.feed}>
      {cases.length > 0 ? (
        cases.map((caseItem) => (
          <CaseCard
            key={caseItem.id}
            card={caseItem}
            onCardClick={onCaseClick}
            onUpvote={onUpvote}
            onDownvote={onDownvote}
            onComments={onComments}
          />
        ))
      ) : (
        <div className={styles.emptyState}>
          <p>Нет кейсов</p>
        </div>
      )}
    </div>
  );
};
