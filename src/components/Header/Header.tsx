import { type ReactNode, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export interface NavLink {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
}

export interface UserInfo {
  initials: string;
  name?: string;
}

export interface HeaderProps {
  logo: string | ReactNode;
  navigationLinks: NavLink[];
  userInfo: UserInfo;
  onNavLinkClick?: (linkId: string) => void;
  className?: string;
}

/**
 * Header component - главный компонент навигации
 *
 * @component
 * @example
 * const links = [
 *   { id: 'dashboard', label: 'Дашборд', href: '#dashboard', isActive: true },
 *   { id: 'cases', label: 'Отбор кейсов', href: '#cases' },
 * ];
 *
 */
export const Header = ({
  logo,
  navigationLinks,
  userInfo,
  onNavLinkClick,
  className,
}: HeaderProps) => {
  const handleNavLinkClick = useMemo(
    () => (linkId: string) => {
      onNavLinkClick?.(linkId);
    },
    [onNavLinkClick]
  );

  return (
    <header className={`${styles.navbar} ${className || ""}`}>
      <nav className={styles.navContent}>
        <div className={styles.logoWrapper}>
          {typeof logo === "string" ? (
            <span className={styles.logo}>{logo}</span>
          ) : (
            logo
          )}
        </div>

        <div className={styles.navLinks}>
          {navigationLinks.map((link) => (
            <Link
              key={link.id}
              to={link.href}
              className={`${styles.navLink} ${
                link.isActive ? styles.active : ""
              }`}
              onClick={() => handleNavLinkClick(link.id)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.userInfo}>
          <div
            className={styles.userAvatar}
            title={userInfo.name || userInfo.initials}
          >
            {userInfo.initials}
          </div>
        </div>
      </nav>
    </header>
  );
};
