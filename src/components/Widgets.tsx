
import { useState, useEffect } from 'react';
import calendarService from '../services/calendarService';
import type { CalendarEvent } from '../services/calendarService';

const Widgets = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventsData = await calendarService.getEvents(5); // Get 5 upcoming events
      setEvents(eventsData);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (event: CalendarEvent) => {
    const startDate = event.start.dateTime || event.start.date;
    if (!startDate) return { month: 'N/A', day: 'N/A' };
    
    const date = new Date(startDate);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate().toString()
    };
  };

  return (
     <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 p-6 bg-gray-100 px-20">
      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow flex flex-col w-full md:w-1/3 h-[60vh]">
        <h2 className="text-2xl font-serif text-[#1d3c6a] border-b border-gray-300 pb-2 px-6 pt-6">
          Upcoming Events
        </h2>
        <div className="overflow-y-auto px-6 mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading events...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-500">{error}</div>
            </div>
          ) : events.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">No upcoming events</div>
            </div>
          ) : (
            events.map((event) => {
              const dateInfo = formatEventDate(event);
              const timeInfo = calendarService.formatEventTime(event);
              
              return (
                <div key={event.id} className="flex items-start mb-6">
                  <div className="flex-shrink-0 bg-amber-200 text-[#1d3c6a] px-4 py-2 text-center">
                    <div className="uppercase">{dateInfo.month}</div>
                    <div className="text-2xl font-bold">{dateInfo.day}</div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-[#1d3c6a]">{event.summary}</h3>
                    {event.location && (
                      <p className="text-sm text-gray-700">{event.location}</p>
                    )}
                    {timeInfo && (
                      <p className="text-sm text-gray-600">{timeInfo}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <button className="bg-[#1d3c6a] text-white py-2 px-4 rounded-b-lg hover:bg-opacity-90">
          See all events
        </button>
      </div>

      {/* Social Media Feed */}
      <div className="bg-white rounded-lg shadow flex flex-col w-full md:w-1/3">
        <h2 className="text-2xl font-serif text-[#1d3c6a] border-b border-gray-300 pb-2 px-6 pt-6">
          Social Media Feed
        </h2>
        <div className="flex-1 overflow-auto px-6 mt-4">
          <iframe
            title="Facebook Feed"
            src="https://www.facebook.com/plugins/page.php?href=YOUR_PAGE_URL&tabs=timeline&width=340"
            className="w-full h-64 border-none"
            allow="encrypted-media"
          ></iframe>
        </div>
      </div>

      {/* News */}
      <div className="bg-white rounded-lg shadow flex flex-col w-full md:w-1/3 h-[60vh]">
        <h2 className="text-2xl font-serif text-[#1d3c6a] border-b border-gray-300 pb-2 px-6 pt-6">
          News
        </h2>
        <div className="flex-1 overflow-y-auto px-6 mt-4">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-[#1d3c6a]">Get ready to SPARK YOUR CREATIVITY!</h3>
            <p className="text-gray-700">
              We are gearing up for Summer Learning Camp in West Carroll!
            </p>
            <a href="#" className="text-amber-500 italic">
              Read More...
            </a>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-[#1d3c6a]">Put an End to Bullying!</h3>
            <p className="text-gray-700">
              Students, parents, teachers, principals, and school leaders can all work together to prevent and end bullying.
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li>written, electronic or verbal communications that threaten harm,</li>
              <li>obscene gestures, taunting or malicious teasing</li>
            </ul>
          </div>
        </div>
        <button className="bg-[#1d3c6a] text-white py-2 px-4 rounded-b-lg hover:bg-opacity-90">
          See all news
        </button>
      </div>
    </div>
  )
}

export default Widgets