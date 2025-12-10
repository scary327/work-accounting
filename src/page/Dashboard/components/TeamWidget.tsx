import { motion } from "framer-motion";
import { Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
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
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

/**
 * TeamWidget component - виджет со списком команд пользователя
 * Показывает активные команды и связанные с ними кейсы
 */
export const TeamWidget = ({ teams, onTeamClick }: TeamWidgetProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className={styles.widget}>
        <CardHeader className={styles.header}>
          <CardTitle className={`${styles.title} flex items-center gap-2`}>
            <Users className="h-5 w-5" />
            Мои команды
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <motion.div
            className={styles.teamList}
            variants={container}
            initial="hidden"
            animate="show"
          >
            {teams.length > 0 ? (
              teams.map((team) => (
                <motion.div
                  key={team.id}
                  variants={item}
                  className={styles.teamItem}
                  onClick={() => onTeamClick?.(team.id)}
                  role="button"
                  tabIndex={0}
                  whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.02)" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onTeamClick?.(team.id);
                    }
                  }}
                >
                  <div className={styles.teamName}>{team.name}</div>
                  <div className={styles.teamCase}>{team.caseTitle}</div>
                </motion.div>
              ))
            ) : (
              <div className={styles.emptyState}>Нет команд</div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
