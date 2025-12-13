import { Outlet } from "react-router-dom";
import { useAtom } from "@reatom/npm-react";
import { Layout } from "../../components/Layout";
import { userAtom } from "../../model/user";
import { URLS } from "../router/urls";

export const MainLayout = () => {
  const [user] = useAtom(userAtom);

  const headerProps = {
    logo: "Проектный Практикум",
    navigationLinks: [
      { id: "dashboard", label: "Дашборд", href: URLS.DASHBOARD },
      { id: "teams", label: "Команды", href: URLS.TEAMS_LIST },
      { id: "students", label: "Студенты", href: URLS.STUDENTS_LIST },
      { id: "cases", label: "Отбор кейсов", href: URLS.CASES_SELECTION },
      { id: "archive", label: "Архив", href: URLS.ARCHIVE },
      { id: "semesters", label: "Семестры", href: URLS.SEMESTERS },
    ],
    userInfo: {
      initials: user ? `${user.firstName[0]}${user.lastName[0]}` : "Г",
      name: user ? `${user.firstName} ${user.lastName}` : "Гость",
    },
  };

  return (
    <Layout headerProps={headerProps}>
      <Outlet />
    </Layout>
  );
};
