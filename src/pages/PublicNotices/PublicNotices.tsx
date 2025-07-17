import { useState } from 'react';
import { Card, Text, Button, Modal, Group, Badge, Stack, Container, Title, Breadcrumbs, Anchor } from '@mantine/core';
import { IconFileText, IconDownload, IconEye, IconCalendar, IconUser } from '@tabler/icons-react';
import HomeNavigation from '../../components/HomeNavigation';

interface Notice {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
  pdfUrl: string;
  fileSize: string;
}

const notices: Notice[] = [
  {
    id: '1',
    title: '2024-2025 Lincoln Parish School Wellness Policy',
    description: 'Comprehensive wellness policy for the 2024-2025 academic year covering nutrition, physical activity, and health education.',
    category: 'Policy',
    date: '2024-08-15',
    author: 'Lincoln Parish School Board',
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
  },
  {
    id: '3',
    title: 'Charter School Application Process',
    description: 'Guidelines and procedures for charter school applications and approval process.',
    category: 'Administration',
    date: '2024-06-10',
    author: 'Office of Charter Schools',
    pdfUrl: '/sample-pdf.pdf',
    fileSize: '3.1 MB'
  },
  {
    id: '4',
    title: 'COVID-19 Information',
    description: 'Current COVID-19 protocols, guidelines, and safety measures for students and staff.',
    category: 'Health',
    date: '2024-08-01',
    author: 'Health Services',
    pdfUrl: '/sample-pdf.pdf',
    fileSize: '1.5 MB'
  },
  {
    id: '5',
    title: 'Cohort Graduation Rate',
    description: 'Annual report on cohort graduation rates and student achievement metrics.',
    category: 'Report',
    date: '2024-05-15',
    author: 'Data & Assessment',
    pdfUrl: '/sample-pdf.pdf',
    fileSize: '2.7 MB'
  },
  {
    id: '6',
    title: 'District Guidelines and Policies for Faculty and Staff',
    description: 'Comprehensive handbook of district policies, procedures, and guidelines for all employees.',
    category: 'Policy',
    date: '2024-07-30',
    author: 'Human Resources',
    pdfUrl: '/sample-pdf.pdf',
    fileSize: '4.2 MB'
  },
  {
    id: '7',
    title: 'Equal Employment Opportunity',
    description: 'Equal employment opportunity policy and non-discrimination guidelines.',
    category: 'Policy',
    date: '2024-06-25',
    author: 'Human Resources',
    pdfUrl: '/sample-pdf.pdf',
    fileSize: '1.2 MB'
  },
  {
    id: '8',
    title: 'Federal Programs Stakeholder Engagement',
    description: 'Information about federal programs and stakeholder engagement opportunities.',
    category: 'Program',
    date: '2024-08-05',
    author: 'Federal Programs',
    pdfUrl: '/sample-pdf.pdf',
    fileSize: '2.9 MB'
  },
  {
    id: '9',
    title: 'Fight Fraud',
    description: 'Fraud prevention guidelines and reporting procedures for district operations.',
    category: 'Compliance',
    date: '2024-07-12',
    author: 'Internal Audit',
    pdfUrl: '/sample-pdf.pdf',
    fileSize: '1.6 MB'
  },
  {
    id: '10',
    title: 'K-2 ARC Local Review',
    description: 'Local review process and guidelines for K-2 ARC (Assessment and Reporting) implementation.',
    category: 'Assessment',
    date: '2024-06-18',
    author: 'Curriculum & Instruction',
    pdfUrl: '/sample-pdf.pdf',
    fileSize: '2.1 MB'
  },
  {
    id: '11',
    title: 'Lincoln Parish Pupil Progression Plan',
    description: 'Comprehensive pupil progression plan outlining academic advancement criteria and procedures.',
    category: 'Policy',
    date: '2024-08-10',
    author: 'Curriculum & Instruction',
    pdfUrl: '/sample-pdf.pdf',
    fileSize: '3.8 MB'
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
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

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
    { title: 'Lincoln Parish Schools', href: '/' },
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
                Official documents, policies, and important information from Lincoln Parish Schools
              </Text>
            </div>
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container size="xl" py="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice) => (
            <Card key={notice.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
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

      {/* PDF Modal */}
      <Modal
        opened={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        size="90vw"
        title={selectedNotice?.title}
        styles={{
          title: { fontSize: '1.1rem', fontWeight: 600 }
        }}
      >
        {selectedNotice && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Group gap="lg">
                <div>
                  <Text size="sm" fw={500}>Category</Text>
                  <Badge color={getCategoryColor(selectedNotice.category)} variant="light">
                    {selectedNotice.category}
                  </Badge>
                </div>
                <div>
                  <Text size="sm" fw={500}>Date</Text>
                  <Text size="sm">{new Date(selectedNotice.date).toLocaleDateString()}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Author</Text>
                  <Text size="sm">{selectedNotice.author}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>File Size</Text>
                  <Text size="sm">{selectedNotice.fileSize}</Text>
                </div>
              </Group>
            </div>
            
            <div className="border rounded-lg overflow-hidden" style={{ height: '70vh' }}>
              <iframe
                src={`${selectedNotice.pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                width="100%"
                height="100%"
                title={selectedNotice.title}
                className="border-0"
              />
            </div>
            
            <Group justify="flex-end">
              <Button
                variant="outline"
                leftSection={<IconDownload size={16} />}
                onClick={() => handleDownloadPdf(selectedNotice)}
              >
                Download PDF
              </Button>
            </Group>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PublicNotices; 