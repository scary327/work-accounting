import { ArchiveCard, type ArchiveCardData } from "./ArchiveCard";
import styles from "./SemesterBlock.module.css";

interface SemesterBlockProps {
  title: string;
  cards: ArchiveCardData[];
  onViewCard?: (cardId: string) => void;
  onNominateCard?: (cardTitle: string) => void;
}

/**
 * SemesterBlock component - блок с кейсами одного семестра
 */
export const SemesterBlock = ({
  title,
  cards,
  onViewCard,
  onNominateCard,
}: SemesterBlockProps) => {
  return (
    <section className={styles.semesterBlock}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.count}>{cards.length} кейсов</span>
      </div>
      <div className={styles.grid}>
        {cards.map((card) => (
          <ArchiveCard
            key={card.id}
            card={card}
            onViewDetails={onViewCard}
            onNominate={onNominateCard}
          />
        ))}
      </div>
    </section>
  );
};
