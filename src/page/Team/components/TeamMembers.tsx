import { memo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import styles from "./TeamMembers.module.css";

interface Member {
  id: number;
  fio: string;
}

interface TeamMembersProps {
  members: Member[];
}

/**
 * TeamMembers component - сетка членов команды с аватарами
 */
export const TeamMembers = memo(({ members }: TeamMembersProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={styles.section}>
      <CardHeader className="pb-2">
        <CardTitle className={styles.sectionHeader}>
          <span className={styles.icon}>👥</span>
          <span className={styles.title}>Текущий состав команды</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className={styles.grid}>
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              className={styles.card}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`${styles.avatar} ${styles[`avatar-${member.id}`]}`}
              >
                {getInitials(member.fio)}
              </div>
              <div className={styles.name}>{member.fio}</div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

TeamMembers.displayName = "TeamMembers";
