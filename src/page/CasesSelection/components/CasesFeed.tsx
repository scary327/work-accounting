import { motion } from "framer-motion";
import styles from "./CasesFeed.module.css";
import { CaseCard, type CaseCardData } from "./CaseCard";

interface CasesFeedProps {
  cases: CaseCardData[];
  onCaseClick: (id: string) => void;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  onComments: (id: string) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const CasesFeed = ({
  cases,
  onCaseClick,
  onUpvote,
  onDownvote,
  onComments,
}: CasesFeedProps) => {
  return (
    <motion.div
      className={styles.feed}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {cases.length > 0 ? (
        cases.map((caseData) => (
          <motion.div key={caseData.id} variants={item}>
            <CaseCard
              data={caseData}
              onClick={() => onCaseClick(caseData.id)}
              onUpvote={() => onUpvote(caseData.id)}
              onDownvote={() => onDownvote(caseData.id)}
              onComments={() => onComments(caseData.id)}
            />
          </motion.div>
        ))
      ) : (
        <div className={styles.emptyState}>
          <p>Нет кейсов</p>
        </div>
      )}
    </motion.div>
  );
};
