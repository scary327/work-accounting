import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import styles from "./NewCalendar.module.css";

export const NewCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate); // 0 = Sunday, 1 = Monday, etc.

    // Adjust for Monday start (Russian convention)
    const startDayAdjusted = startDay === 0 ? 6 : startDay - 1;

    // Empty cells for previous month
    for (let i = 0; i < startDayAdjusted; i++) {
      days.push(<div key={`empty-${i}`} className={styles.dayEmpty}></div>);
    }

    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      const isToday =
        i === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div key={i} className={`${styles.day} ${isToday ? styles.today : ""}`}>
          {i}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.header}>
        <h2 className={styles.monthTitle}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className={styles.controls}>
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className={styles.weekDays}>
        <div>Пн</div>
        <div>Вт</div>
        <div>Ср</div>
        <div>Чт</div>
        <div>Пт</div>
        <div>Сб</div>
        <div>Вс</div>
      </div>
      <div className={styles.daysGrid}>{renderCalendarDays()}</div>
    </div>
  );
};
