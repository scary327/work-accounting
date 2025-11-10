import { type ReactNode } from "react";
import { Header, type HeaderProps } from "../Header";
import styles from "./Layout.module.css";

export interface LayoutProps {
  headerProps: HeaderProps;
  children: ReactNode;
  className?: string;
}

/**
 * Layout component - основной шаблон страницы с хедером и контентной областью
 *
 * @component
 * @example
 * <Layout
 *   headerProps={{
 *     logo: "Проектный Практикум",
 *     navigationLinks: [...]
 *     userInfo: { initials: 'АП' }
 *   }}
 * >
 *   <YourPageComponent />
 * </Layout>
 */
export const Layout = ({ headerProps, children, className }: LayoutProps) => {
  return (
    <div className={`${styles.layout} ${className || ""}`}>
      <Header {...headerProps} />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};
