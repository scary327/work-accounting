import styles from "./TeamWidget.module.css";

export interface Team {
  id: string;
  name: string;
  caseTitle: string;
}

interface TeamWidgetProps {
  teams: Team[];
  onTeamClick?: (teamId: string) => void;
}

/**
 * TeamWidget component - виджет со списком команд пользователя
 * Показывает активные команды и связанные с ними кейсы
 */
export const TeamWidget = ({ teams, onTeamClick }: TeamWidgetProps) => {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3 className={styles.title}>Мои команды</h3>
      </div>
      <div className={styles.teamList}>
        {teams.length > 0 ? (
          teams.map((team) => (
            <div
              key={team.id}
              className={styles.teamItem}
              onClick={() => onTeamClick?.(team.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onTeamClick?.(team.id);
                }
              }}
            >
              <div className={styles.teamName}>{team.name}</div>
              <div className={styles.teamCase}>{team.caseTitle}</div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>Нет команд</div>
        )}
      </div>
    </div>
  );
};
