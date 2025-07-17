import { useState } from 'react';
import { Card, Text, Badge, Group, Button, Modal, Stack, Title, Container } from '@mantine/core';
import { IconCalendar, IconUser, IconTag, IconEye } from '@tabler/icons-react';
import HomeNavigation from '../../components/HomeNavigation';

// Sample announcements data
const announcements = [
  {
    id: 1,
    title: 'School Closure Due to Weather',
    content: 'Due to severe weather conditions, all Lincoln Parish Schools will be closed tomorrow, January 15th, 2024. All after-school activities and sporting events are also cancelled. Please check our website and social media for updates.',
    author: 'Dr. Sarah Johnson',
    date: '2024-01-14',
    category: 'Emergency',
    priority: 'high',
    isRead: false
  },
  {
    id: 2,
    title: 'Parent-Teacher Conference Schedule',
    content: 'Parent-Teacher conferences will be held on February 20th and 21st, 2024. Please schedule your appointment through the parent portal. Conferences will be available both in-person and virtually.',
    author: 'Principal Michael Davis',
    date: '2024-01-12',
    category: 'Academic',
    priority: 'medium',
    isRead: true
  },
  {
    id: 3,
    title: 'New Library Resources Available',
    content: 'We are excited to announce that our school library now has access to several new digital resources including e-books, research databases, and educational videos. Students can access these resources using their school login credentials.',
    author: 'Librarian Emily Wilson',
    date: '2024-01-10',
    category: 'Resources',
    priority: 'low',
    isRead: true
  },
  {
    id: 4,
    title: 'Sports Team Tryouts Announcement',
    content: 'Tryouts for spring sports teams will begin next week. Students interested in baseball, softball, track and field, and tennis should sign up in the athletic office. Physical examination forms must be completed before tryouts.',
    author: 'Athletic Director Robert Brown',
    date: '2024-01-08',
    category: 'Athletics',
    priority: 'medium',
    isRead: false
  },
  {
    id: 5,
    title: 'Technology Device Distribution',
    content: 'All students will receive their assigned Chromebooks and necessary accessories during the first week of school. Parents must sign the technology agreement form before devices can be distributed.',
    author: 'IT Coordinator Lisa Martinez',
    date: '2024-01-05',
    category: 'Technology',
    priority: 'high',
    isRead: true
  },
  {
    id: 6,
    title: 'Community Service Day',
    content: 'Join us for our annual Community Service Day on March 15th, 2024. Students, parents, and staff are encouraged to participate in various community improvement projects. Registration forms are available in the main office.',
    author: 'Community Outreach Coordinator',
    date: '2024-01-03',
    category: 'Community',
    priority: 'low',
    isRead: false
  }
];

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
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewAnnouncement = (announcement: any) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />
      
      <Container size="lg" className="py-8">
        <div className="mb-8">
          <Title order={1} className="text-3xl font-bold text-gray-900 mb-2">
            Announcements
          </Title>
          <Text className="text-gray-600">
            Stay updated with the latest news and important information from Lincoln Parish Schools
          </Text>
        </div>

        <div className="grid gap-6">
          {announcements.map((announcement) => (
            <Card 
              key={announcement.id} 
              shadow="sm" 
              padding="lg" 
              radius="md" 
              withBorder
              className={`transition-all duration-200 hover:shadow-md ${
                !announcement.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <Group gap="xs" className="mb-2">
                    <Title order={3} className="text-xl font-semibold text-gray-900">
                      {announcement.title}
                    </Title>
                    {!announcement.isRead && (
                      <Badge color="blue" size="sm">NEW</Badge>
                    )}
                  </Group>
                  
                  <Text 
                    className="text-gray-600 mb-4 line-clamp-3"
                    style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {announcement.content}
                  </Text>
                </div>
              </div>

              <Group justify="space-between" align="center">
                <Group gap="md">
                  <Group gap="xs">
                    <IconUser size={16} className="text-gray-500" />
                    <Text size="sm" className="text-gray-600">{announcement.author}</Text>
                  </Group>
                  
                  <Group gap="xs">
                    <IconCalendar size={16} className="text-gray-500" />
                    <Text size="sm" className="text-gray-600">{formatDate(announcement.date)}</Text>
                  </Group>
                  
                  <Group gap="xs">
                    <IconTag size={16} className="text-gray-500" />
                    <Badge color={getCategoryColor(announcement.category)} variant="light" size="sm">
                      {announcement.category}
                    </Badge>
                  </Group>
                  
                  <Badge color={getPriorityColor(announcement.priority)} variant="light" size="sm">
                    {announcement.priority.toUpperCase()} PRIORITY
                  </Badge>
                </Group>
                
                <Button
                  variant="light"
                  leftSection={<IconEye size={16} />}
                  onClick={() => handleViewAnnouncement(announcement)}
                  size="sm"
                >
                  View Details
                </Button>
              </Group>
            </Card>
          ))}
        </div>
      </Container>

      {/* Announcement Detail Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedAnnouncement?.title}
        size="lg"
        centered
      >
        {selectedAnnouncement && (
          <Stack gap="md">
            <Group gap="xs">
              <Badge color={getCategoryColor(selectedAnnouncement.category)} variant="light">
                {selectedAnnouncement.category}
              </Badge>
              <Badge color={getPriorityColor(selectedAnnouncement.priority)} variant="light">
                {selectedAnnouncement.priority.toUpperCase()} PRIORITY
              </Badge>
            </Group>
            
            <Text className="text-gray-700 leading-relaxed">
              {selectedAnnouncement.content}
            </Text>
            
            <Group gap="md" className="pt-4 border-t border-gray-200">
              <Group gap="xs">
                <IconUser size={16} className="text-gray-500" />
                <Text size="sm" className="text-gray-600">
                  <strong>Author:</strong> {selectedAnnouncement.author}
                </Text>
              </Group>
              
              <Group gap="xs">
                <IconCalendar size={16} className="text-gray-500" />
                <Text size="sm" className="text-gray-600">
                  <strong>Date:</strong> {formatDate(selectedAnnouncement.date)}
                </Text>
              </Group>
            </Group>
          </Stack>
        )}
      </Modal>
    </div>
  );
};

export default Announcements; 