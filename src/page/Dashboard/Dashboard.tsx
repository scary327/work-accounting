import { useState, useEffect } from "react";
import { NewCalendar } from "./components/NewCalendar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Calendar } from "lucide-react";
import styles from "./Dashboard.module.css";

const CALENDAR_URL_KEY = "yandex_calendar_embed_url";

/**
 * Dashboard component - главная страница приложения
 * Отображает Яндекс Календарь
 */
export const Dashboard = () => {
  const [calendarUrl, setCalendarUrl] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem(CALENDAR_URL_KEY);
    if (savedUrl) {
      setCalendarUrl(savedUrl);
    } else {
      setIsEditing(true);
    }
  }, []);

  const handleSave = () => {
    if (!inputValue.trim()) return;

    // Basic validation to ensure it's an iframe src or a URL
    let urlToSave = inputValue;
    if (inputValue.includes("<iframe")) {
      const srcMatch = inputValue.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        urlToSave = srcMatch[1];
      }
    }

    localStorage.setItem(CALENDAR_URL_KEY, urlToSave);
    setCalendarUrl(urlToSave);
    setIsEditing(false);
  };

  const handleChange = () => {
    setInputValue(calendarUrl);
    setIsEditing(true);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.contentWrapper}>
        <div className={styles.calendarSection}>
          {isEditing ? (
            <Card className="max-w-xl mx-auto mt-10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Настройка календаря
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                  Вставьте ссылку на публичный Яндекс Календарь
                  <br />
                  <a
                    href="https://yandex.ru/support/yandex-360/customers/calendar/web/ru/widget"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Инструкция: где взять ссылку
                  </a>
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://calendar.yandex.ru/embed/week?..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Button onClick={handleSave}>Сохранить</Button>
                </div>
                {calendarUrl && (
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>
                    Отмена
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="relative h-full flex flex-col">
              <div className="flex justify-end mb-2">
                <Button variant="outline" size="sm" onClick={handleChange}>
                  Настроить календарь
                </Button>
              </div>
              <NewCalendar url={calendarUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
