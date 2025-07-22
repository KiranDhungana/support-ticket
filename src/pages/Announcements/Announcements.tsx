import { useState, useEffect } from 'react';
import { Card, Text, Badge, Group, Button, Modal, Stack, Title, Container } from '@mantine/core';
import { IconCalendar, IconUser, IconTag, IconEye } from '@tabler/icons-react';
import HomeNavigation from '../../components/HomeNavigation';
import { getActiveAnnouncements } from '../../services/announcementService';
import type { Announcement } from '../../services/announcementService';

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'red';
    case 'medium': return 'yellow';
    case 'low': return 'green';
    default: return 'gray';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Emergency': return 'red';
    case 'Academic': return 'blue';
    case 'Athletics': return 'green';
    case 'Technology': return 'purple';
    case 'Resources': return 'orange';
    case 'Community': return 'teal';
    default: return 'gray';
  }
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getActiveAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HomeNavigation />
        <Container size="lg" className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <Text className="mt-2 text-gray-600">Loading announcements...</Text>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />
      
      <Container size="lg" className="py-8">
        <div className="mb-8">
          <Title order={1} className="text-3xl font-bold text-gray-900 mb-2">
            Announcements
          </Title>
          <Text className="text-gray-600">
            Stay updated with the latest news and important information from West Carroll Parish School Board
          </Text>
        </div>

        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <Text className="text-gray-500 text-lg">No announcements available</Text>
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <div 
                key={announcement.id} 
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  {/* Circular Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">LPSB</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Source */}
                    <Text size="sm" className="text-gray-500 mb-1">
                      Lincoln Parish School Board
                    </Text>
                    
                    {/* Title */}
                    <Title order={3} className="text-lg font-semibold text-gray-900 mb-2">
                      {announcement.title}
                    </Title>
                    
                    {/* Content Preview */}
                    <Text 
                      className="text-gray-600 mb-3 line-clamp-2"
                      style={{ 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden' 
                      }}
                    >
                      {announcement.content}
                    </Text>
                    
                    {/* Read More Link */}
                    <button
                      onClick={() => handleViewAnnouncement(announcement)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      ... Read More
                    </button>
                    
                    {/* Timestamp */}
                    <Text size="xs" className="text-gray-400 mt-2">
                      {getTimeAgo(announcement.createdAt)}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>

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
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  getCategoryColor(selectedAnnouncement.category) === 'red' ? 'bg-red-100 text-red-800' :
                  getCategoryColor(selectedAnnouncement.category) === 'blue' ? 'bg-blue-100 text-blue-800' :
                  getCategoryColor(selectedAnnouncement.category) === 'green' ? 'bg-green-100 text-green-800' :
                  getCategoryColor(selectedAnnouncement.category) === 'purple' ? 'bg-purple-100 text-purple-800' :
                  getCategoryColor(selectedAnnouncement.category) === 'orange' ? 'bg-orange-100 text-orange-800' :
                  getCategoryColor(selectedAnnouncement.category) === 'teal' ? 'bg-teal-100 text-teal-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedAnnouncement.category}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  getPriorityColor(selectedAnnouncement.priority) === 'red' ? 'bg-red-100 text-red-800' :
                  getPriorityColor(selectedAnnouncement.priority) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  getPriorityColor(selectedAnnouncement.priority) === 'green' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
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
                    <strong>Date:</strong> {formatDate(selectedAnnouncement.createdAt)}
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

export default Announcements; 