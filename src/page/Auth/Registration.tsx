import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { URLS } from "../../app/router/urls";
import { authApi } from "../../api";
import { NotificationContainer } from "../../components/Notification";
import { useNotifications } from "../../hooks/useNotifications";
import styles from "./Auth.module.css";

export const Registration = () => {
  const navigate = useNavigate();
  const { notifications, addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (formData.password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        email: formData.email,
        password: formData.password,
      });

      // Registration now returns only user object, no tokens
      // Show success notification
      addNotification("Успешная регистрация", "success", 3000);

      // Redirect to login page after a short delay to let the notification show
      setTimeout(() => {
        navigate(URLS.LOGIN);
      }, 500);
    } catch (err) {
      const apiError = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        apiError?.response?.data?.message ||
        apiError?.message ||
        "Ошибка при регистрации. Попробуйте позже.";
      setError(errorMessage);
      addNotification(errorMessage, "error", 4000);
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
      <NotificationContainer notifications={notifications} onClose={() => {}} />
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
            Регистрация
          </motion.h1>
          <motion.p variants={itemVariants} className={styles.subtitle}>
            Создайте новый аккаунт для доступа
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
            <label htmlFor="firstName" className={styles.label}>
              Имя
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Иван"
              className={styles.input}
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.div variants={itemVariants} className={styles.formGroup}>
            <label htmlFor="lastName" className={styles.label}>
              Фамилия
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Иванов"
              className={styles.input}
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.div variants={itemVariants} className={styles.formGroup}>
            <label htmlFor="middleName" className={styles.label}>
              Отчество
            </label>
            <input
              id="middleName"
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Иванович"
              className={styles.input}
              disabled={isLoading}
            />
          </motion.div>

          <motion.div variants={itemVariants} className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={styles.input}
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.div variants={itemVariants} className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Подтверждение пароля
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
            {isLoading ? "Загрузка..." : "Зарегистрироваться"}
          </motion.button>
        </motion.form>

        <motion.div
          className={styles.authFooter}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={itemVariants}>
            Уже есть аккаунт?{" "}
            <Link to={URLS.LOGIN} className={styles.link}>
              Войдите
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};
