import api from './api';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
}

export interface CalendarResponse {
  success: boolean;
  data: CalendarEvent[];
}

class CalendarService {
  async getEvents(maxResults: number = 10): Promise<CalendarEvent[]> {
    try {
      const response = await api.get<CalendarResponse>(`/calendar/events?maxResults=${maxResults}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      // Return empty array instead of throwing error to prevent UI crashes
      return [];
    }
  }

  async getEventsByDateRange(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    try {
      const response = await api.get<CalendarResponse>(`/calendar/events/range?startDate=${startDate}&endDate=${endDate}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching calendar events by date range:', error);
      // Return empty array instead of throwing error to prevent UI crashes
      return [];
    }
  }

  formatEventDate(event: CalendarEvent): string {
    const startDate = event.start.dateTime || event.start.date;
    if (!startDate) return 'No date';
    
    const date = new Date(startDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: event.start.dateTime ? 'numeric' : undefined,
      minute: event.start.dateTime ? '2-digit' : undefined,
    });
  }

  formatEventTime(event: CalendarEvent): string {
    if (!event.start.dateTime) return '';
    
    const startTime = new Date(event.start.dateTime);
    const endTime = event.end.dateTime ? new Date(event.end.dateTime) : null;
    
    const startTimeStr = startTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    if (endTime) {
      const endTimeStr = endTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `${startTimeStr} - ${endTimeStr}`;
    }
    
    return startTimeStr;
  }
}

export default new CalendarService(); 