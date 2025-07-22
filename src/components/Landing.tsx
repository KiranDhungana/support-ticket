import { Group, Container, Image, Text, Button } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconChalkboard, IconCurrencyDollar, IconCalendarEvent, IconPencil, IconBook2, IconUser, IconCalendar } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeNavigation from './HomeNavigation';
import { getActiveAnnouncements } from '../services/announcementService';
import type { Announcement } from '../services/announcementService';
import { getPublishedNews } from '../services/newsService';
import type { News } from '../services/newsService';

const heroImages = [
  '/public/Slider1.png',
  '/public/Slider2.png',
  '/public/Slider3.png',
];

const Landing = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const next = () => setCurrent((c) => (c + 1) % heroImages.length);
  const prev = () => setCurrent((c) => (c - 1 + heroImages.length) % heroImages.length);

  useEffect(() => {
    fetchAnnouncements();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />

      {/* Hero Section / Slider */}
      <div className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] flex items-end justify-center bg-gray-200 overflow-hidden">
        <Image
          src={heroImages[current]}
          alt="School Hero"
          className="object-cover w-full h-full absolute top-0 left-0 z-0"
          style={{ filter: 'brightness(0.95)' }}
        />
        <div className="relative z-10 w-full flex flex-col items-center pb-10">
          <Text className="text-white text-4xl sm:text-5xl font-bold drop-shadow-lg mb-2">Hillcrest Elementary.</Text>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex gap-2">
              {heroImages.map((_, idx) => (
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
      <div className="bg-[#0a3d6a] w-full py-8 px-2 flex flex-col items-center">
        <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-stretch divide-y md:divide-y-0 md:divide-x divide-blue-800">
          {/* Widget 1 */}
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <IconChalkboard size={48} stroke={1.5} className="text-white mb-2" />
            <span className="text-white font-bold text-lg text-center">EMPLOYMENT</span>
          </div>
          {/* Widget 2 */}
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <IconCurrencyDollar size={48} stroke={1.5} className="text-white mb-2" />
            <span className="text-white font-bold text-lg text-center">SCHOOL CASH ONLINE</span>
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
      <div className="bg-[#0a3d6a] w-full py-8 flex flex-col items-center">
        <div className="w-full max-w-7xl px-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-2 sm:gap-6">
            <span className="text-white font-extrabold text-3xl mr-6">CALENDAR</span>
            <a href="#" className="text-white underline text-lg">See All Events</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Event 1 */}
            <div className="bg-white rounded shadow p-6 min-h-[160px] flex flex-col">
              <span className="text-blue-900 font-bold text-xl mb-2">Jul 8</span>
              <span className="text-gray-700 text-sm mb-1">6:00 PM — 7:30 PM</span>
              <span className="text-gray-900 font-medium">School Board Meeting</span>
            </div>
            {/* Event 2 */}
            <div className="bg-white rounded shadow p-6 min-h-[160px] flex flex-col">
              <span className="text-blue-900 font-bold text-xl mb-2">Aug 11 — Aug 13</span>
              <span className="text-gray-700 text-sm mb-1">ALL DAY</span>
              <span className="text-gray-900 font-medium">Staff Development (No Students)</span>
            </div>
            {/* Event 3 */}
            <div className="bg-white rounded shadow p-6 min-h-[160px] flex flex-col">
              <span className="text-blue-900 font-bold text-xl mb-2">Aug 14</span>
              <span className="text-gray-700 text-sm mb-1">ALL DAY</span>
              <span className="text-gray-900 font-medium">First Day for 1st-12th Grade Students (Full Day)</span>
            </div>
            {/* Event 4 */}
            <div className="bg-white rounded shadow p-6 min-h-[160px] flex flex-col">
              <span className="text-blue-900 font-bold text-xl mb-2">Aug 14 — Aug 19</span>
              <span className="text-gray-700 text-sm mb-1">ALL DAY</span>
              <span className="text-gray-900 font-medium">Pre-K and Kindergarten Screeening</span>
            </div>
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
                        <img 
                          src={news[0].imageUrl || '/public/Slider1.png'} 
                          alt={news[0].title} 
                          className="w-full lg:w-60 h-32 object-cover rounded-lg" 
                        />
                        <div className="flex-1">
                          <div className="text-xs text-blue-600 font-semibold mb-1">FEATURED NEWS</div>
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
                            className="bg-blue-600 text-white px-4 py-1 rounded text-xs hover:bg-blue-700 transition-colors font-semibold"
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
                            className="text-blue-600 hover:text-blue-800 font-semibold text-xs underline"
                          >
                            Read Full Article →
                          </button>
                        </div>
                        <div className="sm:w-32 flex-shrink-0">
                          <img 
                            src={newsItem.imageUrl || '/public/Slider1.png'} 
                            alt={newsItem.title} 
                            className="w-full h-full object-cover" 
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
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">LPSB</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">Lincoln Parish School Board</div>
                      <div className="text-gray-700 text-xs mb-1">
                        {announcement.content.length > 150 
                          ? `${announcement.content.substring(0, 150)}... ` 
                          : announcement.content
                        }
                        <button
                          onClick={() => handleViewAnnouncement(announcement)}
                          className="font-semibold text-blue-900 hover:text-blue-700 cursor-pointer"
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
                            <img src="/public/Logo.png" alt="West Carroll Parish School Board Logo" className="w-20 h-20 mb-3" />
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">Find Us</h3>
            <div className="text-gray-700 text-sm flex flex-col gap-1">
                              <span>West Carroll Parish School Board</span>
              <span className="flex items-center gap-2"><svg xmlns='http://www.w3.org/2000/svg' className='inline w-4 h-4 text-blue-900' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/></svg>410 South Farmerville Street</span>
              <span>Ruston, LA 71270</span>
              <a href="tel:3182551430" className="text-blue-700 hover:underline flex items-center gap-2"><svg xmlns='http://www.w3.org/2000/svg' className='inline w-4 h-4 text-blue-900' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z'/></svg>318-255-1430</a>
              <a href="tel:3182551433" className="text-blue-700 hover:underline flex items-center gap-2"><svg xmlns='http://www.w3.org/2000/svg' className='inline w-4 h-4 text-blue-900' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z'/></svg>318-255-1433</a>
            </div>
          </div>

          {/* Schools */}
          <div>
            <h3 className="font-bold text-lg mb-2">Schools</h3>
            <ul className="text-gray-700 text-sm space-y-1">
                              <li>West Carroll Parish School Board</li>
              <li>Choudrant High School</li>
              <li>Choudrant Elementary School</li>
              <li>Cypress Springs Elementary</li>
              <li>Dubach Elementary School</li>
              <li>Ruston Elementary School</li>
              <li>Glen View Elementary School</li>
              <li>Hillcrest Elementary School</li>
              <li>I.A. Lewis School</li>
              <li>Ruston High School</li>
              <li>Ruston Junior High School</li>
              <li>LP Early Childhood Center</li>
              <li>Simsboro School</li>
              <li>Lincoln Parish STEM Center</li>
            </ul>
          </div>

          {/* Child/Family Services */}
          <div>
            <h3 className="font-bold text-lg mb-2">LOUISIANA DEPARTMENT OF CHILDREN AND FAMILY SERVICES</h3>
            <a href="#" className="text-blue-700 underline text-sm mb-2 block">Website Link</a>
            <h4 className="font-bold text-md mt-4 mb-1">REPORT CHILD ABUSE:</h4>
            <div className="text-gray-700 text-sm mb-2">Call 1-855-452-5437</div>
            <div className="text-gray-700 text-xs mb-2">Toll Free 24 hours a day, 365 days a year.</div>
            <div className="flex flex-col gap-2 mt-2">
              <img src="https://www.lla.la.gov/media/1/lla-hotline-graphic.png" alt="LLA Hotline" className="w-28 h-10 object-contain rounded" />
              <img src="https://www.stopbullying.gov/sites/default/files/styles/scale_crop_300/public/2021-10/stop-bullying.png" alt="Stop Bullying" className="w-20 h-10 object-contain rounded" />
            </div>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="font-bold text-lg mb-2">Stay Connected</h3>
            <div className="flex flex-col gap-3 mb-4">
              <a href="#" className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"><svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path d='M17 6.1V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1.1'/><rect width='18' height='14' x='3' y='6.1' rx='2'/><path d='M8 10h.01M16 10h.01'/></svg>App Store</a>
              <a href="#" className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"><svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path d='M7.5 17.5l9-9M8 7h8v8'/></svg>Google Play</a>
            </div>
            <div className="flex gap-4 mt-2">
              <a href="#" aria-label="Facebook" className="text-blue-700 hover:text-blue-900"><svg xmlns='http://www.w3.org/2000/svg' className='w-7 h-7' fill='currentColor' viewBox='0 0 24 24'><path d='M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0'/></svg></a>
              <a href="#" aria-label="Twitter" className="text-blue-700 hover:text-blue-900"><svg xmlns='http://www.w3.org/2000/svg' className='w-7 h-7' fill='currentColor' viewBox='0 0 24 24'><path d='M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.93-.856 2.011-.857 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z'/></svg></a>
              <a href="#" aria-label="Instagram" className="text-blue-700 hover:text-blue-900"><svg xmlns='http://www.w3.org/2000/svg' className='w-7 h-7' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.425 3.678 1.406c-.98.98-1.274 2.092-1.334 3.374C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.06 1.282.354 2.394 1.334 3.374.98.98 2.092 1.274 3.374 1.334C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.282-.06 2.394-.354 3.374-1.334.98-.98 1.274-2.092 1.334-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.06-1.282-.354-2.394-1.334-3.374-.98-.98-2.092-1.274-3.374-1.334C15.668.013 15.259 0 12 0z'/><circle cx='12' cy='12' r='3.5'/><circle cx='18.406' cy='5.594' r='1.44'/></svg></a>
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