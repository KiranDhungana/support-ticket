import { useState } from 'react';
import { 
  Card, 
  Text, 
  Group, 
  Badge, 
  Button, 
  Modal, 
  Stack, 
  Title, 
  Container, 
  TextInput, 
  Table,
  Divider,
  Anchor,
  Breadcrumbs,
  Select,
  ActionIcon,
  Tooltip,
  Alert
} from '@mantine/core';
import { 
  IconSearch, 
  IconFileText, 
  IconDownload, 
  IconEye, 
  IconCalendar,
  IconClock,
  IconBuilding,
  IconAlertTriangle,
  IconFilter,
  IconInfoCircle
} from '@tabler/icons-react';
import HomeNavigation from '../../components/HomeNavigation';

// Sample board meeting data
const boardMeetingsData = [
  {
    id: 1,
    date: '2025-07-08',
    dayOfWeek: 'Tuesday',
    month: 'July',
    day: 8,
    year: 2025,
    type: 'Regular Meeting',
    time: '6:00 PM',
    location: 'Lincoln Parish School Board Office',
    status: 'upcoming',
    minutes: {
      available: false,
      url: null,
      fileSize: null
    },
    agenda: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '2.3 MB'
    },
    notes: 'Building and Grounds discussion included'
  },
  {
    id: 2,
    date: '2025-06-24',
    dayOfWeek: 'Tuesday',
    month: 'June',
    day: 24,
    year: 2025,
    type: 'Regular Meeting',
    time: '6:00 PM',
    location: 'Lincoln Parish School Board Office',
    status: 'completed',
    minutes: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '1.8 MB'
    },
    agenda: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '2.1 MB'
    },
    notes: 'Budget approval and policy updates'
  },
  {
    id: 3,
    date: '2025-06-10',
    dayOfWeek: 'Tuesday',
    month: 'June',
    day: 10,
    year: 2025,
    type: 'Special Session',
    time: '4:00 PM',
    location: 'Lincoln Parish School Board Office',
    status: 'completed',
    minutes: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '1.2 MB'
    },
    agenda: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '1.9 MB'
    },
    notes: 'Emergency facility repairs discussion'
  },
  {
    id: 4,
    date: '2025-05-27',
    dayOfWeek: 'Tuesday',
    month: 'May',
    day: 27,
    year: 2025,
    type: 'Regular Meeting',
    time: '6:00 PM',
    location: 'Lincoln Parish School Board Office',
    status: 'completed',
    minutes: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '2.0 MB'
    },
    agenda: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '2.4 MB'
    },
    notes: 'End of year academic review'
  },
  {
    id: 5,
    date: '2025-05-13',
    dayOfWeek: 'Tuesday',
    month: 'May',
    day: 13,
    year: 2025,
    type: 'Regular Meeting',
    time: '6:00 PM',
    location: 'Lincoln Parish School Board Office',
    status: 'completed',
    minutes: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '1.7 MB'
    },
    agenda: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '2.2 MB'
    },
    notes: 'Teacher contract negotiations'
  },
  {
    id: 6,
    date: '2025-04-29',
    dayOfWeek: 'Tuesday',
    month: 'April',
    day: 29,
    year: 2025,
    type: 'Regular Meeting',
    time: '6:00 PM',
    location: 'Lincoln Parish School Board Office',
    status: 'completed',
    minutes: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '1.9 MB'
    },
    agenda: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '2.0 MB'
    },
    notes: 'Technology infrastructure updates'
  },
  {
    id: 7,
    date: '2025-04-15',
    dayOfWeek: 'Tuesday',
    month: 'April',
    day: 15,
    year: 2025,
    type: 'Special Session',
    time: '5:00 PM',
    location: 'Lincoln Parish School Board Office',
    status: 'completed',
    minutes: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '1.5 MB'
    },
    agenda: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '1.8 MB'
    },
    notes: 'Emergency budget review'
  },
  {
    id: 8,
    date: '2025-03-25',
    dayOfWeek: 'Tuesday',
    month: 'March',
    day: 25,
    year: 2025,
    type: 'Regular Meeting',
    time: '6:00 PM',
    location: 'Lincoln Parish School Board Office',
    status: 'completed',
    minutes: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '2.1 MB'
    },
    agenda: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '2.3 MB'
    },
    notes: 'Spring academic assessment review'
  },
  {
    id: 9,
    date: '2025-03-11',
    dayOfWeek: 'Tuesday',
    month: 'March',
    day: 11,
    year: 2025,
    type: 'Regular Meeting',
    time: '6:00 PM',
    location: 'Lincoln Parish School Board Office',
    status: 'completed',
    minutes: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '1.8 MB'
    },
    agenda: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '2.1 MB'
    },
    notes: 'Facility maintenance planning'
  },
  {
    id: 10,
    date: '2025-02-25',
    dayOfWeek: 'Tuesday',
    month: 'February',
    day: 25,
    year: 2025,
    type: 'Regular Meeting',
    time: '6:00 PM',
    location: 'Lincoln Parish School Board Office',
    status: 'completed',
    minutes: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '2.0 MB'
    },
    agenda: {
      available: true,
      url: '/sample-pdf.pdf',
      fileSize: '2.2 MB'
    },
    notes: 'Curriculum development discussion'
  }
];

const BoardMinutes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Meetings');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const meetingTypes = ['All Meetings', 'Regular Meeting', 'Special Session', 'Notice of Training'];
  const statusOptions = ['All', 'upcoming', 'completed'];

  const filteredMeetings = boardMeetingsData.filter(meeting => {
    const matchesSearch = 
      meeting.dayOfWeek.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All Meetings' || meeting.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || meeting.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewDocument = (meeting: any, documentType: 'minutes' | 'agenda') => {
    setSelectedMeeting({ ...meeting, documentType });
    setModalOpen(true);
  };

  const handleDownloadDocument = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const formatDate = (meeting: any) => {
    return `${meeting.dayOfWeek}, ${meeting.month} ${meeting.day}, ${meeting.year}`;
  };

  const getStatusColor = (status: string) => {
    return status === 'upcoming' ? 'blue' : 'green';
  };

  const getStatusText = (status: string) => {
    return status === 'upcoming' ? 'Upcoming' : 'Completed';
  };

  const breadcrumbItems = [
            { title: 'West Carroll Parish School Board', href: '/' },
    { title: 'Leadership', href: '#' },
    { title: 'Board Minutes & Agenda', href: '/board-minutes' }
  ].map((item, index) => (
    <Anchor href={item.href} key={index} size="sm">
      {item.title}
    </Anchor>
  ));

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />
      
      <Container size="lg" className="py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs className="mb-6" separator="→">
          {breadcrumbItems}
        </Breadcrumbs>

        {/* Header */}
        <div className="mb-8">
          <Group gap="md" align="center" className="mb-4">
            <div className="flex items-center gap-3">
              <img src="/public/Logo.png" alt="Logo" className="w-12 h-12" />
              <Title order={1} className="text-4xl font-bold text-red-600">
                Board Minutes & Agenda
              </Title>
            </div>
          </Group>
          <Text className="text-gray-600 text-lg mb-4">
            Access meeting agendas, minutes, and related documents from Lincoln Parish School Board meetings.
          </Text>
          
          {/* Disclaimer Alert */}
          <Alert 
            icon={<IconAlertTriangle size={16} />} 
            title="Important Notice" 
            color="blue" 
            variant="light"
            className="mb-6"
          >
            THE LINCOLN PARISH SCHOOL BOARD RESERVES THE RIGHT TO ENTER INTO EXECUTIVE SESSION, IF NEEDED, IN ACCORDANCE WITH La.R.S. 42:17
          </Alert>
        </div>

        {/* Search and Filter Section */}
        <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftSection={<IconSearch size={16} />}
              size="md"
            />
            <Select
              placeholder="Meeting Type"
              value={selectedType}
              onChange={(value) => setSelectedType(value || 'All Meetings')}
              data={meetingTypes}
              leftSection={<IconFilter size={16} />}
              size="md"
            />
            <Select
              placeholder="Status"
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value || 'All')}
              data={statusOptions}
              leftSection={<IconCalendar size={16} />}
              size="md"
            />
          </div>
        </Card>

        {/* Meetings Table */}
        <Card shadow="sm" radius="md" withBorder>
          <div className="overflow-x-auto">
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr className="bg-gray-50">
                  <Table.Th>Meeting Date</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Minutes</Table.Th>
                  <Table.Th>Agenda</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredMeetings.map((meeting) => (
                  <Table.Tr key={meeting.id} className="hover:bg-gray-50">
                    <Table.Td>
                      <div>
                        <Text fw={500} size="sm">
                          {formatDate(meeting)}
                        </Text>
                        <Group gap="xs" className="mt-1">
                          <IconClock size={14} className="text-gray-500" />
                          <Text size="xs" className="text-gray-600">
                            {meeting.time}
                          </Text>
                          <IconBuilding size={14} className="text-gray-500" />
                          <Text size="xs" className="text-gray-600">
                            {meeting.location}
                          </Text>
                        </Group>
                        {meeting.notes && (
                          <Text size="xs" className="text-gray-500 mt-1 italic">
                            {meeting.notes}
                          </Text>
                        )}
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        color={meeting.type === 'Special Session' ? 'orange' : 'blue'} 
                        variant="light" 
                        size="sm"
                      >
                        {meeting.type}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        color={getStatusColor(meeting.status)} 
                        variant="light" 
                        size="sm"
                      >
                        {getStatusText(meeting.status)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {meeting.minutes.available ? (
                        <Group gap="xs">
                          <Button 
                            variant="light" 
                            color="blue" 
                            size="xs"
                            leftSection={<IconEye size={14} />}
                            onClick={() => handleViewDocument(meeting, 'minutes')}
                          >
                            View
                          </Button>
                          <Button 
                            variant="light" 
                            color="green" 
                            size="xs"
                            leftSection={<IconDownload size={14} />}
                            onClick={() => handleDownloadDocument(meeting.minutes.url!, `${meeting.month}-${meeting.day}-${meeting.year}-minutes.pdf`)}
                          >
                            Download
                          </Button>
                          <Text size="xs" className="text-gray-500">
                            {meeting.minutes.fileSize}
                          </Text>
                        </Group>
                      ) : (
                        <Text size="sm" className="text-gray-400 italic">
                          Not available
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {meeting.agenda.available ? (
                        <Group gap="xs">
                          <Button 
                            variant="light" 
                            color="blue" 
                            size="xs"
                            leftSection={<IconEye size={14} />}
                            onClick={() => handleViewDocument(meeting, 'agenda')}
                          >
                            View
                          </Button>
                          <Button 
                            variant="light" 
                            color="green" 
                            size="xs"
                            leftSection={<IconDownload size={14} />}
                            onClick={() => handleDownloadDocument(meeting.agenda.url!, `${meeting.month}-${meeting.day}-${meeting.year}-agenda.pdf`)}
                          >
                            Download
                          </Button>
                          <Text size="xs" className="text-gray-500">
                            {meeting.agenda.fileSize}
                          </Text>
                        </Group>
                      ) : (
                        <Text size="sm" className="text-gray-400 italic">
                          Not available
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Meeting Details">
                          <ActionIcon
                            variant="light"
                            color="gray"
                            onClick={() => {
                              setSelectedMeeting({ ...meeting, documentType: 'details' });
                              setModalOpen(true);
                            }}
                          >
                            <IconInfoCircle size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>

          {filteredMeetings.length === 0 && (
            <div className="text-center py-8">
              <Text size="lg" className="text-gray-500">
                No meetings found matching your search criteria.
              </Text>
            </div>
          )}
        </Card>
      </Container>

      {/* Document Viewer Modal */}
      <Modal 
        opened={modalOpen} 
        onClose={() => setModalOpen(false)} 
        size="xl"
        title={
          selectedMeeting ? 
            `${selectedMeeting.documentType === 'details' ? 'Meeting Details' : 
              selectedMeeting.documentType === 'minutes' ? 'Meeting Minutes' : 'Meeting Agenda'} - ${formatDate(selectedMeeting)}` 
            : ''
        }
      >
        {selectedMeeting && (
          <div>
            {selectedMeeting.documentType === 'details' ? (
              <Stack gap="lg">
                <div className="text-center">
                  <Title order={3} className="text-xl font-bold text-gray-900 mb-2">
                    {formatDate(selectedMeeting)}
                  </Title>
                  <Badge 
                    color={selectedMeeting.type === 'Special Session' ? 'orange' : 'blue'} 
                    variant="light" 
                    size="lg"
                    className="mb-2"
                  >
                    {selectedMeeting.type}
                  </Badge>
                  <Badge 
                    color={getStatusColor(selectedMeeting.status)} 
                    variant="light" 
                    size="lg"
                  >
                    {getStatusText(selectedMeeting.status)}
                  </Badge>
                </div>

                <Divider />

                <div>
                  <Title order={4} className="text-lg font-semibold mb-3">Meeting Information</Title>
                  <Stack gap="sm">
                    <Group gap="sm">
                      <IconClock size={18} className="text-gray-500" />
                      <Text size="sm" className="font-medium">Time:</Text>
                      <Text size="sm">{selectedMeeting.time}</Text>
                    </Group>
                    <Group gap="sm">
                      <IconBuilding size={18} className="text-gray-500" />
                      <Text size="sm" className="font-medium">Location:</Text>
                      <Text size="sm">{selectedMeeting.location}</Text>
                    </Group>
                    {selectedMeeting.notes && (
                      <Group gap="sm">
                        <IconFileText size={18} className="text-gray-500" />
                        <Text size="sm" className="font-medium">Notes:</Text>
                        <Text size="sm">{selectedMeeting.notes}</Text>
                      </Group>
                    )}
                  </Stack>
                </div>

                <div>
                  <Title order={4} className="text-lg font-semibold mb-3">Available Documents</Title>
                  <Group gap="md">
                    {selectedMeeting.minutes.available && (
                      <Button 
                        variant="light" 
                        color="blue"
                        leftSection={<IconFileText size={16} />}
                        onClick={() => handleViewDocument(selectedMeeting, 'minutes')}
                      >
                        View Minutes ({selectedMeeting.minutes.fileSize})
                      </Button>
                    )}
                    {selectedMeeting.agenda.available && (
                      <Button 
                        variant="light" 
                        color="green"
                        leftSection={<IconFileText size={16} />}
                        onClick={() => handleViewDocument(selectedMeeting, 'agenda')}
                      >
                        View Agenda ({selectedMeeting.agenda.fileSize})
                      </Button>
                    )}
                  </Group>
                </div>
              </Stack>
            ) : (
              <div className="h-96">
                <iframe
                  src={`${selectedMeeting[selectedMeeting.documentType].url}#toolbar=1&navpanes=1&scrollbar=1`}
                  width="100%"
                  height="100%"
                  title={`${selectedMeeting.documentType === 'minutes' ? 'Minutes' : 'Agenda'} - ${formatDate(selectedMeeting)}`}
                  className="border-0 rounded"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BoardMinutes; 