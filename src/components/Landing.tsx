import { useState, useEffect } from 'react';
import { Container, Title, Text, Button, Group, Card, Badge, Modal, Image } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconChalkboard, IconCalendarEvent, IconPencil, IconBook2, IconClock, IconMapPin, IconUser, IconCalendar } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import HomeNavigation from './HomeNavigation';
import { getActiveAnnouncements } from '../services/announcementService';
import type { Announcement } from '../services/announcementService';
import { getPublishedNews } from '../services/newsService';
import type { News } from '../services/newsService';
import calendarService, { type CalendarEvent } from '../services/calendarService';
import { IMAGE_PATHS } from '../utils/imageUtils';

const images = [
  IMAGE_PATHS.SLIDER_1,
  IMAGE_PATHS.SLIDER_2,
  IMAGE_PATHS.SLIDER_3,
  IMAGE_PATHS.SLIDER_4,
  IMAGE_PATHS.SLIDER_5,
  IMAGE_PATHS.SLIDER_6,
  IMAGE_PATHS.SLIDER_7,
  IMAGE_PATHS.SLIDER_8,
];

const Landing = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  useEffect(() => {
    fetchAnnouncements();
    fetchEvents();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const [announcementsData, newsData] = await Promise.all([
        getActiveAnnouncements(),
        getPublishedNews(1, 4) // Get 4 latest news articles
      ]);
      setAnnouncements(announcementsData);
      setNews(newsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const eventsData = await calendarService.getEvents(4); // Get 4 upcoming events
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleViewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setModalOpen(true);
  };

  const handleViewNews = (newsItem: News) => {
    console.log('Navigating to news page for:', newsItem.title);
    navigate(`/news?article=${newsItem.id}`);
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInYears > 0) {
      return diffInYears === 1 ? 'about 1 year ago' : `about ${diffInYears} years ago`;
    } else if (diffInMonths > 0) {
      return diffInMonths === 1 ? 'about 1 month ago' : `about ${diffInMonths} months ago`;
    } else if (diffInDays > 0) {
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    } else {
      return 'today';
    }
  };

  const formatEventDate = (event: CalendarEvent) => {
    const startDate = event.start.dateTime || event.start.date;
    if (!startDate) return { month: 'N/A', day: 'N/A' };
    
    const date = new Date(startDate);
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate().toString();
    
    // Check if it's a multi-day event
    if (event.end.dateTime || event.end.date) {
      const endDateStr = event.end.dateTime || event.end.date;
      if (endDateStr) {
        const endDate = new Date(endDateStr);
        if (endDate.getDate() !== date.getDate() || endDate.getMonth() !== date.getMonth()) {
          const endDay = endDate.getDate().toString();
          return { month, day: `${day} — ${endDay}` };
        }
      }
    }
    
    return { month, day };
  };

  const formatEventTime = (event: CalendarEvent) => {
    if (!event.start.dateTime) return 'ALL DAY';
    
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
      return `${startTimeStr} — ${endTimeStr}`;
    }
    
    return startTimeStr;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />

      {/* Hero Section / Slider */}
      <div className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] flex items-end justify-center bg-gray-200 overflow-hidden">
        <Image
          src={images[current]}
          alt="School Hero"
          className="object-cover w-full h-full absolute top-0 left-0 z-0"
          style={{ filter: 'brightness(0.95)' }}
        />
        <div className="relative z-10 w-full flex flex-col items-center pb-10">
          <Text className="text-white text-4xl sm:text-5xl font-bold drop-shadow-lg mb-2">West Carroll Parish School Board</Text>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ease-in-out ${
                    idx === current 
                      ? 'bg-white scale-125 shadow-lg shadow-white/50' 
                      : 'bg-white/50 hover:bg-white/80 border border-white/80'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <Button 
                variant="filled" 
                size="md" 
                radius="xl"
                onClick={prev}
                className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-white hover:text-white"
              >
                <IconArrowLeft size={20} />
              </Button>
              <Button 
                variant="filled" 
                size="md" 
                radius="xl"
                onClick={next}
                className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-white hover:text-white"
              >
                <IconArrowRight size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Blue Widget Row */}
      <div className="bg-wcpsb-blue w-full py-8 px-2 flex flex-col items-center">
                    <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-stretch divide-y md:divide-y-0 md:divide-x divide-blue-700">
          {/* Widget 1 */}
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <IconChalkboard size={48} stroke={1.5} className="text-white mb-2" />
            <span className="text-white font-bold text-lg text-center">EMPLOYMENT</span>
          </div>
          {/* Widget 3 */}
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <IconCalendarEvent size={48} stroke={1.5} className="text-white mb-2" />
            <span className="text-white font-bold text-lg text-center">24-25 STUDENT & PARENT CALENDAR</span>
          </div>
          {/* Widget 4 */}
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <IconPencil size={48} stroke={1.5} className="text-white mb-2" />
            <span className="text-white font-bold text-lg text-center">PREK/K REGISTRATION</span>
          </div>
          {/* Widget 5 */}
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <IconBook2 size={48} stroke={1.5} className="text-white mb-2" />
            <span className="text-white font-bold text-lg text-center">2025-2030 STRATEGIC PLAN</span>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-wcpsb-blue w-full py-8 flex flex-col items-center">
        <div className="w-full max-w-7xl px-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-2 sm:gap-6">
            <span className="text-white font-extrabold text-3xl mr-6">CALENDAR</span>
            <a href="#" className="text-white underline text-lg">See All Events</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventsLoading ? (
              // Loading state
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded shadow p-6 min-h-[160px] flex flex-col animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                </div>
              ))
            ) : events.length === 0 ? (
              // No events state
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded shadow p-6 min-h-[160px] flex flex-col items-center justify-center">
                  <span className="text-gray-500 text-center">No upcoming events</span>
                </div>
              ))
            ) : (
              // Events display
              events.map((event) => {
                const dateInfo = formatEventDate(event);
                const timeInfo = formatEventTime(event);
                
                return (
                  <div key={event.id} className="bg-white rounded shadow p-6 min-h-[160px] flex flex-col">
                    <span className="text-blue-800 font-bold text-xl mb-2">
                      {dateInfo.month} {dateInfo.day}
                    </span>
                    <span className="text-gray-700 text-sm mb-1">{timeInfo}</span>
                    <span className="text-gray-900 font-medium">{event.summary}</span>
                    {event.location && (
                      <span className="text-gray-600 text-xs mt-1">{event.location}</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* News & Announcements Section */}
      <div className="w-full bg-white py-8 flex justify-center">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 md:gap-10 px-2">
          {/* NEWS COLUMN */}
          <div className="flex-1 w-full lg:w-2/3">
            <div className="flex items-center mb-6">
              <span className="font-extrabold text-2xl mr-6">NEWS</span>
              <button 
                onClick={() => navigate('/news')}
                className="underline text-lg hover:text-blue-600 transition-colors cursor-pointer"
              >
                See All Posts
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading news...</p>
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No news articles available.</p>
                </div>
              ) : (
                <>
                  {/* Featured News */}
                  {news.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex flex-col lg:flex-row gap-3">
                        <Image
                          src={news[0].imageUrl || IMAGE_PATHS.SLIDER_1}
                          alt={news[0].title}
                          className="object-cover w-full lg:w-60 h-32 rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="text-xs text-blue-700 font-semibold mb-1">FEATURED NEWS</div>
                          <div className="font-bold text-lg mb-2">{news[0].title}</div>
                          <div className="text-gray-700 text-xs mb-2">
                            {news[0].summary || news[0].content.substring(0, 100)}...
                          </div>
                          <div className="text-gray-500 text-xs mb-2">
                            By {news[0].author} • {getTimeAgo(news[0].publishedAt || news[0].createdAt)}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewNews(news[0]);
                            }}
                            className="bg-blue-700 text-white px-4 py-1 rounded text-xs hover:bg-blue-800 transition-colors font-semibold"
                          >
                            Read Full Article
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Other News */}
                  {news.slice(1).map((newsItem) => (
                    <div key={newsItem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-1 p-2">
                          <div className="font-bold text-base mb-1 text-gray-900 leading-tight">
                            {newsItem.title}
                          </div>
                          <div className="text-gray-600 text-xs mb-1">
                            By {newsItem.author}
                          </div>
                          <div className="text-gray-700 text-xs mb-1 leading-relaxed">
                            {newsItem.summary || newsItem.content.substring(0, 60)}...
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewNews(newsItem);
                            }}
                            className="text-blue-700 hover:text-blue-800 font-semibold text-xs underline"
                          >
                            Read Full Article →
                          </button>
                        </div>
                        <div className="sm:w-32 flex-shrink-0">
                          <Image
                            src={newsItem.imageUrl || IMAGE_PATHS.SLIDER_1}
                            alt={newsItem.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          {/* ANNOUNCEMENTS COLUMN */}
          <div className="flex-1 w-full lg:w-1/3 mt-8 lg:mt-0">
            <div className="flex items-center mb-6">
              <span className="font-extrabold text-2xl mr-6">ANNOUNCEMENTS</span>
              <button 
                onClick={() => navigate('/announcements')}
                className="underline text-lg hover:text-blue-600 transition-colors cursor-pointer"
              >
                See All Posts
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <div className="text-gray-500 text-xs mt-2">Loading announcements...</div>
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-4">
                  <div className="text-gray-500 text-xs">No announcements available</div>
                </div>
              ) : (
                announcements.slice(0, 5).map((announcement) => (
                  <div key={announcement.id} className="flex gap-3 items-start">
                                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">LPSB</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">West Carroll Parish School Board</div>
                      <div className="text-gray-700 text-xs mb-1">
                        {announcement.content.length > 150 
                          ? `${announcement.content.substring(0, 150)}... ` 
                          : announcement.content
                        }
                        <button
                          onClick={() => handleViewAnnouncement(announcement)}
                          className="font-semibold text-blue-700 hover:text-blue-800 cursor-pointer"
                        >
                          Read More
                        </button>
                      </div>
                      <div className="text-gray-400 text-xs">{getTimeAgo(announcement.createdAt)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="w-full bg-gray-100 border-t border-gray-300 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Contact/Logo */}
          <div>
                          <img 
                src="/Logo.png" 
                alt="West Carroll Parish School Board Logo" 
                className="w-20 h-20 mb-3" 
                onError={(e) => {
                  console.error('Logo failed to load:', e);
                  // Fallback to text if image fails
                  e.currentTarget.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-20 h-20 mb-3 bg-blue-700 text-white rounded flex items-center justify-center text-xs font-bold';
                  fallback.textContent = 'WCPSB';
                  e.currentTarget.parentNode?.insertBefore(fallback, e.currentTarget);
                }}
              />
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">Find Us</h3>
            <div className="text-gray-700 text-sm flex flex-col gap-1">
              <span>West Carroll Parish School Board</span>
              <span className="flex items-center gap-2"><svg xmlns='http://www.w3.org/2000/svg' className='inline w-4 h-4 text-blue-700' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/></svg>410 Willis Street</span>
              <span>Oak Grove, LA 71263</span>
              <a href="tel:3184282378" className="text-blue-700 hover:underline flex items-center gap-2"><svg xmlns='http://www.w3.org/2000/svg' className='inline w-4 h-4 text-blue-700' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z'/></svg>318-428-2378</a>
              <a href="tel:3184283775" className="text-blue-700 hover:underline flex items-center gap-2"><svg xmlns='http://www.w3.org/2000/svg' className='inline w-4 h-4 text-blue-700' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z'/></svg>318-428-3775 (Fax)</a>
            </div>
          </div>

          {/* Schools */}
          <div>
            <h3 className="font-bold text-lg mb-2">Schools</h3>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>Oak Grove High School (Oak Grove)</li>
              <li>Oak Grove Elementary School (Oak Grove)</li>
              <li>Forest High School (Forest)</li>
            </ul>
          </div>

          {/* Child/Family Services */}
          <div>
            <h3 className="font-bold text-lg mb-2">LOUISIANA DEPARTMENT OF CHILDREN AND FAMILY SERVICES</h3>
            <a href="https://dcfs.louisiana.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline text-sm mb-2 block">Website Link</a>
            <h4 className="font-bold text-md mt-4 mb-1">REPORT CHILD ABUSE:</h4>
            <div className="text-gray-700 text-sm mb-2">Call 1-855-452-5437</div>
            <div className="text-gray-700 text-xs mb-2">Toll Free 24 hours a day, 365 days a year.</div>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="font-bold text-lg mb-2">Stay Connected</h3>
            <div className="flex gap-4 mt-2">
              <a href="https://www.facebook.com/wcpsb/" aria-label="Facebook" className="text-blue-700 hover:text-blue-900"><svg xmlns='http://www.w3.org/2000/svg' className='w-7 h-7' fill='currentColor' viewBox='0 0 24 24'><path d='M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0'/></svg></a>
              <a href="https://www.linkedin.com/company/wcpsb/" aria-label="LinkedIn" className="text-blue-700 hover:text-blue-900"><svg xmlns='http://www.w3.org/2000/svg' className='w-7 h-7' fill='currentColor' viewBox='0 0 24 24'><path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 text-center text-xs text-gray-500 py-4 bg-gray-100">
          Copyright © 2025 West Carroll Parish School Board. All rights reserved.<br />Powered By Apptegy
        </div>
      </footer>

      {/* Announcement Detail Modal */}
      {modalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedAnnouncement.title}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Badges */}
              <div className="flex gap-2">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {selectedAnnouncement.category}
                </span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  {selectedAnnouncement.priority.toUpperCase()} PRIORITY
                </span>
              </div>
              
              {/* Content */}
              <div className="text-gray-700 leading-relaxed">
                {selectedAnnouncement.content}
              </div>
              
              {/* Image if exists */}
              {selectedAnnouncement.imageUrl && (
                <div className="mt-4">
                  <img 
                    src={selectedAnnouncement.imageUrl} 
                    alt="Announcement" 
                    className="w-full max-w-md rounded-lg shadow-md"
                  />
                </div>
              )}
              
              {/* Metadata */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center gap-2">
                  <IconUser size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    <strong>Author:</strong> {selectedAnnouncement.author}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <IconCalendar size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    <strong>Date:</strong> {new Date(selectedAnnouncement.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Landing;