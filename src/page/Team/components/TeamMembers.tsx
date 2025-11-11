import { memo } from "react";
import styles from "./TeamMembers.module.css";

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface TeamMembersProps {
  members: Member[];
}

/**
 * TeamMembers component - сетка членов команды с аватарами и ролями
 */
export const TeamMembers = memo(({ members }: TeamMembersProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.icon}>👥</span>
        <h2 className={styles.title}>Текущий состав команды</h2>
      </div>

      <div className={styles.grid}>
        {members.map((member) => (
          <div key={member.id} className={styles.card}>
            <div
              className={`${styles.avatar} ${styles[`avatar-${member.id}`]}`}
            >
              {member.avatar}
            </div>
            <div className={styles.name}>{member.name}</div>
            <div className={styles.role}>{member.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
});

TeamMembers.displayName = "TeamMembers";
