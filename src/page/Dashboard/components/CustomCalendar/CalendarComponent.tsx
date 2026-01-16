import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import ruLocale from "@fullcalendar/core/locales/ru";
import type {
  DateSelectArg,
  EventDropArg,
  EventClickArg,
} from "@fullcalendar/core";
import type { CalendarEventDto } from "./api/api";
import { calendarApi } from "./api/api";
import { CreateEventModal } from "./CreateEventModal";
import styles from "./CalendarComponent.module.css";

export const CalendarComponent: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [editingEvent, setEditingEvent] = useState<
    (CalendarEventDto & { uid: string }) | null
  >(null);
  const [isCreating, setIsCreating] = useState(false);

  // Конвертирует UTC ISO строку в формат для отображения в локальном времени
  // Если строка без 'Z', добавляем его чтобы JavaScript интерпретировал как UTC
  const convertUTCToLocalDisplay = (utcISOString: string): string => {
    // Если нет Z в конце, добавляем его - это сигнал для JavaScript что это UTC
    const dateStr = utcISOString.includes("Z")
      ? utcISOString
      : utcISOString + "Z";
    const date = new Date(dateStr);

    // Получаем компоненты даты в локальной временной зоне
    // getHours(), getMinutes() и т.д. работают с локальным временем этого UTC момента
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Возвращаем ISO формат без 'Z' в конце (FullCalendar интерпретирует как локальное время)
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const loadEvents = async (
    info: { start: Date; end: Date },
    successCallback: (events: Record<string, unknown>[]) => void,
    failureCallback: (error: Error) => void
  ) => {
    try {
      const events = await calendarApi.getEvents(
        info.start.toISOString(),
        info.end.toISOString()
      );

      const mappedEvents = events.map((ev) => {
        // Для всех событий используем start и end
        const eventData: Record<string, unknown> = {
          id: ev.uid,
          title: ev.summary,
          start: ev.recurrence ? null : convertUTCToLocalDisplay(ev.start),
          end: ev.recurrence ? null : convertUTCToLocalDisplay(ev.end),
          extendedProps: {
            description: ev.description,
            location: ev.location,
            recurrence: ev.recurrence,
          },
        };

        // Если есть recurrence, добавляем rruleStr
        if (ev.recurrence) {
          eventData.rrule = `${ev.recurrence}`;
        }

        return eventData;
      });

      successCallback(mappedEvents);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error(err);
      failureCallback(err);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const calendarApiInstance = selectInfo.view.calendar;
    calendarApiInstance.unselect();

    setSelectedDate({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setIsModalOpen(true);
  };

  const handleEventDrop = async (dropInfo: EventDropArg) => {
    const { event } = dropInfo;

    const updatedEvent: CalendarEventDto = {
      summary: event.title,
      description: (event.extendedProps?.description as string) || "",
      start: event.start?.toISOString() || new Date().toISOString(),
      end: event.end?.toISOString() || new Date().toISOString(),
    };

    try {
      await calendarApi.updateEvent(event.id, updatedEvent);
    } catch (error) {
      console.error(error);
      alert("Ошибка при переносе");
      dropInfo.revert();
    }
  };

  const handleEventResize = async (resizeInfo: any) => {
    const { event } = resizeInfo;

    const updatedEvent: CalendarEventDto = {
      summary: event.title,
      description: (event.extendedProps?.description as string) || "",
      start: event.start?.toISOString() || new Date().toISOString(),
      end: event.end?.toISOString() || new Date().toISOString(),
    };

    try {
      await calendarApi.updateEvent(event.id, updatedEvent);
    } catch (error) {
      console.error(error);
      alert("Ошибка при изменении размера");
      resizeInfo.revert();
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setEditingEvent({
      uid: event.id,
      summary: event.title,
      description: (event.extendedProps?.description as string) || "",
      location: (event.extendedProps?.location as string) || "",
      recurrence: (event.extendedProps?.recurrence as string) || "",
      start: event.start?.toISOString() || new Date().toISOString(),
      end: event.end?.toISOString() || new Date().toISOString(),
    });
    setSelectedDate({
      start: event.start || new Date(),
      end: event.end || new Date(),
    });
    setIsModalOpen(true);
  };

  const handleCreateEvent = async (event: CalendarEventDto) => {
    setIsCreating(true);
    try {
      if (editingEvent) {
        // Редактирование существующего события
        await calendarApi.updateEvent(editingEvent.uid, event);
      } else {
        // Создание нового события
        await calendarApi.createEvent(event);
      }
      const calendar = calendarRef.current?.getApi();
      if (calendar) {
        calendar.refetchEvents();
      }
      setEditingEvent(null);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!editingEvent) return;
    setIsCreating(true);
    try {
      await calendarApi.deleteEvent(editingEvent.uid);
      const calendar = calendarRef.current?.getApi();
      if (calendar) {
        calendar.refetchEvents();
      }
      setEditingEvent(null);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setSelectedDate(null);
  };

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.calendarContainer}>
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            rrulePlugin,
          ]}
          locales={[ruLocale]}
          locale="ru"
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek",
          }}
          buttonText={{
            today: "Сегодня",
            month: "Месяц",
            week: "Неделя",
          }}
          events={loadEvents}
          selectable={true}
          editable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
            hour12: false,
          }}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
            hour12: false,
          }}
          height="100%"
          contentHeight="100%"
        />
      </div>
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateEvent}
        onDelete={editingEvent ? handleDeleteEvent : undefined}
        selectedDate={selectedDate}
        initialEvent={editingEvent}
        isLoading={isCreating}
        isEditing={!!editingEvent}
      />
    </div>
  );
};
