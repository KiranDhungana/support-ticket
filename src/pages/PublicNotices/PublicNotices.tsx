import { useState, useEffect } from 'react';
import { Card, Text, Button, Group, Badge, Stack, Container, Title, Breadcrumbs, Anchor, Image, LoadingOverlay } from '@mantine/core';
import { IconFileText, IconDownload, IconEye, IconCalendar, IconUser } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { createPortal } from 'react-dom';
import HomeNavigation from '../../components/HomeNavigation';
import { getPublicNotices } from '../../services/publicNoticeService';
import type { PublicNotice } from '../../services/publicNoticeService';

type Notice = PublicNotice;

// Sample data for fallback (when API is not available)
const sampleNotices: Notice[] = [
  {
    id: '1',
            title: '2024-2025 West Carroll Parish School Wellness Policy',
    description: 'Comprehensive wellness policy for the 2024-2025 academic year covering nutrition, physical activity, and health education.',
    category: 'Policy',
    date: '2024-08-15',
            author: 'West Carroll Parish School Board',
    pdfUrl: '/sample-pdf.pdf',
    fileSize: '2.3 MB'
  },
  {
    id: '2',
    title: 'Asbestos Awareness Plan',
    description: 'Annual asbestos awareness plan and management procedures for all school facilities.',
    category: 'Safety',
    date: '2024-07-20',
    author: 'Facilities Department',
    pdfUrl: '/sample-pdf.pdf',
    fileSize: '1.8 MB'
  }
];

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Policy': 'blue',
    'Safety': 'red',
    'Administration': 'gray',
    'Health': 'green',
    'Report': 'purple',
    'Program': 'orange',
    'Compliance': 'yellow',
    'Assessment': 'cyan'
  };
  return colors[category] || 'gray';
};

const PublicNotices = () => {
  const [notices, setNotices] = useState<Notice[]>(sampleNotices);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  // Fetch notices from API
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const data = await getPublicNotices();
        setNotices(data);
      } catch (error) {
        console.error('Error fetching notices:', error);
        notifications.show({
          title: 'Warning',
          message: 'Using sample data. Some features may be limited.',
          color: 'yellow'
        });
        // Keep using sample data
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const handleViewPdf = (notice: Notice) => {
    setSelectedNotice(notice);
    setPdfModalOpen(true);
  };

  const handleDownloadPdf = (notice: Notice) => {
    // In a real app, this would trigger a download
    const link = document.createElement('a');
    link.href = notice.pdfUrl;
    link.download = `${notice.title}.pdf`;
    link.click();
  };

  const breadcrumbItems = [
            { title: 'West Carroll Parish School Board', href: '/' },
    { title: 'Public Notices', href: '/public-notices' }
  ].map((item, index) => (
    <Anchor href={item.href} key={index} size="sm">
      {item.title}
    </Anchor>
  ));

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <Container size="xl" py="md">
          <Breadcrumbs separator="//" mb="md">
            {breadcrumbItems}
          </Breadcrumbs>
          
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-b from-blue-600 to-red-600 rounded-lg flex items-center justify-center">
                <IconFileText size={32} className="text-white" />
              </div>
            </div>
            <div>
              <Title order={1} size="h2" className="text-blue-900">
                Public Notices
              </Title>
              <Text size="sm" color="dimmed" mt={4}>
                Official documents, policies, and important information from West Carroll Parish School Board
              </Text>
            </div>
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container size="xl" py="xl" pos="relative">
        <LoadingOverlay visible={loading} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice) => (
            <Card key={notice.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                {/* Image Preview */}
                {notice.imageUrl && (
                  <div className="h-48 overflow-hidden rounded-lg">
                    <Image
                      src={notice.imageUrl}
                      alt={notice.title}
                      height={192}
                      className="w-full object-cover"
                    />
                  </div>
                )}
                
                <div>
                  <Group justify="space-between" mb="xs">
                    <Badge color={getCategoryColor(notice.category)} variant="light">
                      {notice.category}
                    </Badge>
                    <Text size="xs" color="dimmed">
                      {notice.fileSize}
                    </Text>
                  </Group>
                  
                  <Title order={3} size="h4" mb="xs" className="text-gray-800">
                    {notice.title}
                  </Title>
                  
                  <Text size="sm" color="dimmed" lineClamp={3}>
                    {notice.description}
                  </Text>
                </div>

                <div className="space-y-2">
                  <Group gap="xs" className="text-xs text-gray-600">
                    <IconCalendar size={14} />
                    <Text size="xs">{new Date(notice.date).toLocaleDateString()}</Text>
                  </Group>
                  
                  <Group gap="xs" className="text-xs text-gray-600">
                    <IconUser size={14} />
                    <Text size="xs">{notice.author}</Text>
                  </Group>
                </div>

                <Group gap="xs">
                  <Button
                    variant="light"
                    size="sm"
                    leftSection={<IconEye size={16} />}
                    onClick={() => handleViewPdf(notice)}
                    className="flex-1"
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftSection={<IconDownload size={16} />}
                    onClick={() => handleDownloadPdf(notice)}
                  >
                    Download
                  </Button>
                </Group>
              </Stack>
            </Card>
          ))}
        </div>
      </Container>

      {/* Notice Details Modal */}
      {pdfModalOpen && selectedNotice && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            minWidth: '600px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
                {selectedNotice.title}
              </h2>
              <button 
                onClick={() => setPdfModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Notice Information */}
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '16px', 
                borderRadius: '8px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>Category</label>
                  <Badge color={getCategoryColor(selectedNotice.category)} variant="light">
                    {selectedNotice.category}
                  </Badge>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>Date</label>
                  <Text size="sm">{new Date(selectedNotice.date).toLocaleDateString()}</Text>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>Author</label>
                  <Text size="sm">{selectedNotice.author}</Text>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>File Size</label>
                  <Text size="sm">{selectedNotice.fileSize}</Text>
                </div>
              </div>

              {/* Image Preview */}
              {selectedNotice.imageUrl && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Preview Image</label>
                  <div style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    maxHeight: '300px'
                  }}>
                    <img 
                      src={selectedNotice.imageUrl} 
                      alt={selectedNotice.title}
                      style={{ 
                        width: '100%', 
                        height: 'auto',
                        maxHeight: '300px',
                        objectFit: 'cover'
                      }} 
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
                <div style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '12px', 
                  borderRadius: '6px',
                  border: '1px solid #ddd'
                }}>
                  <Text size="sm" style={{ lineHeight: '1.5' }}>
                    {selectedNotice.description}
                  </Text>
                </div>
              </div>

              {/* PDF Viewer */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Document</label>
                <div style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  height: '400px'
                }}>
                  <iframe
                    src={`${selectedNotice.pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                    width="100%"
                    height="100%"
                    title={selectedNotice.title}
                    style={{ border: 'none' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button 
                  onClick={() => setPdfModalOpen(false)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Close
                </button>
                <button 
                  onClick={() => handleDownloadPdf(selectedNotice)}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    background: '#007bff',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PublicNotices; 