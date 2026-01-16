import apiClient from "@/api/apiClient";

export interface CalendarEventDto {
  uid?: string;
  summary: string;
  description?: string;
  location?: string;
  start: string;
  end: string;
  recurrence?: string;
}

export const calendarApi = {
  getEvents: async (
    startStr: string,
    endStr: string
  ): Promise<CalendarEventDto[]> => {
    const response = await apiClient.get<CalendarEventDto[]>(
      "/calendar/events",
      {
        params: {
          from: startStr,
          to: endStr,
        },
      }
    );
    return response.data;
  },

  createEvent: async (event: CalendarEventDto): Promise<CalendarEventDto> => {
    const response = await apiClient.post<CalendarEventDto>(
      "/calendar/events",
      event
    );
    return response.data;
  },

  updateEvent: async (
    uid: string,
    event: CalendarEventDto
  ): Promise<CalendarEventDto> => {
    const response = await apiClient.put<CalendarEventDto>(
      `/calendar/events/${uid}`,
      event
    );
    return response.data;
  },

  deleteEvent: async (uid: string): Promise<void> => {
    await apiClient.delete(`/calendar/events/${uid}`);
  },
};
