import { type ReactNode, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAtom } from "@reatom/npm-react";
import Cookies from "js-cookie";
import { userAtom, isRegisteredAtom } from "../../model/user";
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
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setUser] = useAtom(userAtom);
  const [, setIsRegistered] = useAtom(isRegisteredAtom);

  const handleNavLinkClick = useMemo(
    () => (linkId: string) => {
      onNavLinkClick?.(linkId);
    },
    [onNavLinkClick]
  );

  const handleLogout = () => {
    // Clear auth cookies using js-cookie library
    Cookies.remove("user");
    Cookies.remove("isRegistered");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // Clear Reatom atoms
    setUser(null);
    setIsRegistered(false);

    setIsMenuOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          <div className={styles.userMenuWrapper}>
            <div
              className={styles.userButton}
              onClick={toggleMenu}
              role="button"
              tabIndex={0}
            >
              <span className={styles.userName}>{userInfo.name}</span>
              <div
                className={styles.userAvatar}
                title={userInfo.name || userInfo.initials}
              >
                {userInfo.initials}
              </div>
            </div>
            {isMenuOpen && (
              <div className={styles.userMenu}>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
