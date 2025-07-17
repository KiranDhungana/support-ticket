import { useState, useMemo } from 'react';
import { 
  Card, 
  Text, 
  Badge, 
  Group, 
  Button, 
  Modal, 
  Stack, 
  Title, 
  Container, 
  TextInput, 
  Select,
  Table,
  Avatar,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { 
  IconSearch, 
  IconFilter, 
  IconEye, 
  IconMail, 
  IconPhone, 
  IconMapPin,
  IconBuilding,
  IconSchool
} from '@tabler/icons-react';
import HomeNavigation from '../../components/HomeNavigation';
import Pagination from '../../components/Pagination';

// Sample staff data
const staffData = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    position: 'Principal',
    department: 'Administration',
    email: 'sarah.johnson@lincolnparish.edu',
    phone: '(318) 555-0101',
    location: 'Main Office',
    education: 'Ph.D. Educational Leadership',
    experience: '15 years',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    status: 'active'
  },
  {
    id: 2,
    name: 'Michael Davis',
    position: 'Assistant Principal',
    department: 'Administration',
    email: 'michael.davis@lincolnparish.edu',
    phone: '(318) 555-0102',
    location: 'Main Office',
    education: 'M.Ed. Educational Administration',
    experience: '12 years',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: 'active'
  },
  {
    id: 3,
    name: 'Emily Wilson',
    position: 'Librarian',
    department: 'Library Services',
    email: 'emily.wilson@lincolnparish.edu',
    phone: '(318) 555-0103',
    location: 'Library',
    education: 'M.L.S. Library Science',
    experience: '8 years',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    status: 'active'
  },
  {
    id: 4,
    name: 'Robert Brown',
    position: 'Athletic Director',
    department: 'Athletics',
    email: 'robert.brown@lincolnparish.edu',
    phone: '(318) 555-0104',
    location: 'Athletic Office',
    education: 'M.S. Sports Management',
    experience: '10 years',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'active'
  },
  {
    id: 5,
    name: 'Lisa Martinez',
    position: 'IT Coordinator',
    department: 'Technology',
    email: 'lisa.martinez@lincolnparish.edu',
    phone: '(318) 555-0105',
    location: 'IT Department',
    education: 'B.S. Computer Science',
    experience: '6 years',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    status: 'active'
  },
  {
    id: 6,
    name: 'David Thompson',
    position: 'Math Teacher',
    department: 'Mathematics',
    email: 'david.thompson@lincolnparish.edu',
    phone: '(318) 555-0106',
    location: 'Room 201',
    education: 'M.Ed. Mathematics Education',
    experience: '9 years',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    status: 'active'
  },
  {
    id: 7,
    name: 'Jennifer Garcia',
    position: 'English Teacher',
    department: 'English',
    email: 'jennifer.garcia@lincolnparish.edu',
    phone: '(318) 555-0107',
    location: 'Room 105',
    education: 'M.A. English Literature',
    experience: '7 years',
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    status: 'active'
  },
  {
    id: 8,
    name: 'James Anderson',
    position: 'Science Teacher',
    department: 'Science',
    email: 'james.anderson@lincolnparish.edu',
    phone: '(318) 555-0108',
    location: 'Room 301',
    education: 'M.S. Biology',
    experience: '11 years',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    status: 'active'
  },
  {
    id: 9,
    name: 'Amanda White',
    position: 'Counselor',
    department: 'Student Services',
    email: 'amanda.white@lincolnparish.edu',
    phone: '(318) 555-0109',
    location: 'Counseling Office',
    education: 'M.Ed. School Counseling',
    experience: '5 years',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    status: 'active'
  },
  {
    id: 10,
    name: 'Christopher Lee',
    position: 'Music Teacher',
    department: 'Fine Arts',
    email: 'christopher.lee@lincolnparish.edu',
    phone: '(318) 555-0110',
    location: 'Music Room',
    education: 'M.M. Music Education',
    experience: '13 years',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: 'active'
  },
  {
    id: 11,
    name: 'Rachel Green',
    position: 'Art Teacher',
    department: 'Fine Arts',
    email: 'rachel.green@lincolnparish.edu',
    phone: '(318) 555-0111',
    location: 'Art Studio',
    education: 'M.F.A. Fine Arts',
    experience: '4 years',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    status: 'active'
  },
  {
    id: 12,
    name: 'Thomas Wilson',
    position: 'Physical Education Teacher',
    department: 'Physical Education',
    email: 'thomas.wilson@lincolnparish.edu',
    phone: '(318) 555-0112',
    location: 'Gymnasium',
    education: 'M.Ed. Physical Education',
    experience: '8 years',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'active'
  }
];

const departments = ['All Departments', 'Administration', 'Library Services', 'Athletics', 'Technology', 'Mathematics', 'English', 'Science', 'Student Services', 'Fine Arts', 'Physical Education'];

const Staff = () => {
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter staff based on search term and department
  const filteredStaff = useMemo(() => {
    return staffData.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           staff.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = selectedDepartment === 'All Departments' || staff.department === selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  }, [searchTerm, selectedDepartment]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStaff = filteredStaff.slice(startIndex, endIndex);

  const handleViewStaff = (staff: any) => {
    setSelectedStaff(staff);
    setModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />
      
      <Container size="lg" className="py-8">
        <div className="mb-8">
          <Title order={1} className="text-3xl font-bold text-gray-900 mb-2">
            Staff Directory
          </Title>
          <Text className="text-gray-600">
            Find contact information and details for Lincoln Parish Schools staff members
          </Text>
        </div>

        {/* Search and Filter Section */}
        <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <TextInput
              placeholder="Search by name, position, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftSection={<IconSearch size={16} />}
              className="flex-1"
            />
            <Select
              placeholder="Select Department"
              value={selectedDepartment}
              onChange={(value) => setSelectedDepartment(value || 'All Departments')}
              data={departments}
              leftSection={<IconFilter size={16} />}
              className="w-full md:w-64"
            />
          </div>
        </Card>

        {/* Staff Table */}
        <Card shadow="sm" radius="md" withBorder className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <Table.Thead>
                <Table.Tr className="bg-gray-50">
                  <Table.Th>Staff Member</Table.Th>
                  <Table.Th>Position</Table.Th>
                  <Table.Th>Department</Table.Th>
                  <Table.Th>Contact</Table.Th>
                  <Table.Th>Location</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {currentStaff.map((staff) => (
                  <Table.Tr key={staff.id} className="hover:bg-gray-50">
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar src={staff.image} alt={staff.name} size="md" radius="xl" />
                        <div>
                          <Text fw={500} size="sm">{staff.name}</Text>
                          <Text size="xs" c="dimmed">{staff.experience} experience</Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{staff.position}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="blue" size="sm">
                        {staff.department}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <div className="space-y-1">
                        <Group gap="xs">
                          <IconMail size={14} className="text-gray-500" />
                          <Text size="xs" className="text-gray-600">{staff.email}</Text>
                        </Group>
                        <Group gap="xs">
                          <IconPhone size={14} className="text-gray-500" />
                          <Text size="xs" className="text-gray-600">{staff.phone}</Text>
                        </Group>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <IconMapPin size={14} className="text-gray-500" />
                        <Text size="sm">{staff.location}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Tooltip label="View Details">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleViewStaff(staff)}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredStaff.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </Card>
      </Container>

      {/* Staff Detail Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Staff Details"
        size="lg"
        centered
      >
        {selectedStaff && (
          <Stack gap="md">
            <Group gap="lg">
              <Avatar src={selectedStaff.image} alt={selectedStaff.name} size="xl" radius="xl" />
              <div>
                <Title order={3}>{selectedStaff.name}</Title>
                <Text c="dimmed">{selectedStaff.position}</Text>
                <Badge variant="light" color="blue" size="sm" className="mt-2">
                  {selectedStaff.department}
                </Badge>
              </div>
            </Group>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Group gap="xs" className="mb-2">
                  <IconMail size={16} className="text-gray-500" />
                  <Text size="sm" fw={500}>Email</Text>
                </Group>
                <Text size="sm" className="text-gray-600">{selectedStaff.email}</Text>
              </div>

              <div>
                <Group gap="xs" className="mb-2">
                  <IconPhone size={16} className="text-gray-500" />
                  <Text size="sm" fw={500}>Phone</Text>
                </Group>
                <Text size="sm" className="text-gray-600">{selectedStaff.phone}</Text>
              </div>

              <div>
                <Group gap="xs" className="mb-2">
                  <IconMapPin size={16} className="text-gray-500" />
                  <Text size="sm" fw={500}>Location</Text>
                </Group>
                <Text size="sm" className="text-gray-600">{selectedStaff.location}</Text>
              </div>

              <div>
                <Group gap="xs" className="mb-2">
                  <IconBuilding size={16} className="text-gray-500" />
                  <Text size="sm" fw={500}>Department</Text>
                </Group>
                <Text size="sm" className="text-gray-600">{selectedStaff.department}</Text>
              </div>

                             <div>
                 <Group gap="xs" className="mb-2">
                   <IconSchool size={16} className="text-gray-500" />
                   <Text size="sm" fw={500}>Education</Text>
                 </Group>
                 <Text size="sm" className="text-gray-600">{selectedStaff.education}</Text>
               </div>

               <div>
                 <Group gap="xs" className="mb-2">
                   <IconSchool size={16} className="text-gray-500" />
                   <Text size="sm" fw={500}>Experience</Text>
                 </Group>
                 <Text size="sm" className="text-gray-600">{selectedStaff.experience}</Text>
               </div>
            </div>
          </Stack>
        )}
      </Modal>
    </div>
  );
};

export default Staff; 