import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAtom } from "@reatom/npm-react";
import Cookies from "js-cookie";
import { URLS } from "../../app/router/urls";
import { authApi } from "../../api";
import { tokenManager } from "../../api/tokenManager";
import { userAtom, isRegisteredAtom } from "../../model/user";
import styles from "./Auth.module.css";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setUser] = useAtom(userAtom);
  const [, setIsRegistered] = useAtom(isRegisteredAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });

      // Сохранить токены в cookies (через tokenManager)
      tokenManager.setTokens(response.accessToken, response.refreshToken);

      // Сохранить информацию о пользователе в Reatom и Cookies
      setUser(response.user);
      setIsRegistered(true);

      const isSecure = window.location.protocol === "https:";

      Cookies.set("user", JSON.stringify(response.user), {
        secure: isSecure,
        sameSite: "strict",
      });
      Cookies.set("isRegistered", "true", {
        secure: isSecure,
        sameSite: "strict",
      });

      navigate(URLS.DASHBOARD);
    } catch (err) {
      const apiError = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        apiError?.response?.data?.message ||
          apiError?.message ||
          "Неверный email или пароль"
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  return (
    <div className={styles.authContainer}>
      <motion.div
        className={styles.authCard}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className={styles.authHeader}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className={styles.title}>
            Вход
          </motion.h1>
          <motion.p variants={itemVariants} className={styles.subtitle}>
            Войдите в свой аккаунт, чтобы продолжить
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className={styles.form}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {error && (
            <motion.div
              className={styles.errorMessage}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div variants={itemVariants} className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={styles.input}
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.div variants={itemVariants} className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            className={styles.button}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? "Загрузка..." : "Войти"}
          </motion.button>
        </motion.form>

        <motion.div
          className={styles.authFooter}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={itemVariants}>
            Нет аккаунта?{" "}
            <Link to={URLS.REGISTRATION} className={styles.link}>
              Зарегистрируйтесь
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};
