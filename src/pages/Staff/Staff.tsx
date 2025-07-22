import { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Group, 
  Card, 
  Badge, 
  Stack, 
  Avatar, 
  TextInput, 
  Select, 
  Breadcrumbs, 
  Anchor,
  LoadingOverlay,
  Pagination
} from '@mantine/core';
import { createPortal } from 'react-dom';
import { 
  IconUsers, 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconSearch
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import HomeNavigation from '../../components/HomeNavigation';
import { getStaff, getDepartments } from '../../services/staffService';
import type { Staff } from '../../services/staffService';

const StaffPage = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const defaultDepartments = [
    'Administration',
    'Library Services',
    'Athletics',
    'Technology',
    'Mathematics',
    'English',
    'Science',
    'Student Services',
    'Fine Arts',
    'Special Education',
    'Counseling',
    'Maintenance',
    'Food Services',
    'Transportation'
  ];

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      'Administration': 'blue',
      'Library Services': 'purple',
      'Athletics': 'orange',
      'Technology': 'cyan',
      'Mathematics': 'green',
      'English': 'red',
      'Science': 'teal',
      'Student Services': 'pink',
      'Fine Arts': 'violet',
      'Special Education': 'yellow',
      'Counseling': 'indigo',
      'Maintenance': 'gray',
      'Food Services': 'lime',
      'Transportation': 'amber'
    };
    return colors[department] || 'gray';
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await getStaff(currentPage, 12, search, selectedDepartment);
      setStaff(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Error fetching staff:', error);
      notifications.show({
        title: 'Warning',
        message: 'Failed to load staff members. Please try again later.',
        color: 'yellow'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const deps = await getDepartments();
      setDepartments([...new Set([...defaultDepartments, ...deps])]);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments(defaultDepartments);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [currentPage, search, selectedDepartment]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleViewStaff = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setModalOpen(true);
  };

  const breadcrumbItems = [
            { title: 'West Carroll Parish School Board', href: '/' },
    { title: 'Staff', href: '/staff' }
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
              <div className="w-16 h-16 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <IconUsers size={32} className="text-white" />
              </div>
            </div>
            <div>
              <Title order={1} size="h2" className="text-blue-900">
                Our Staff
              </Title>
              <Text size="sm" color="dimmed" mt={4}>
                Meet the dedicated professionals who make West Carroll Parish School Board exceptional
              </Text>
            </div>
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container size="xl" py="xl" pos="relative">
        <LoadingOverlay visible={loading} />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput
              placeholder="Search staff members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftSection={<IconSearch size={16} />}
            />
            <Select
              placeholder="Filter by department"
              value={selectedDepartment}
              onChange={(value) => setSelectedDepartment(value || '')}
              data={departments.map(dept => ({ value: dept, label: dept }))}
              clearable
            />
            <div className="flex items-center justify-end">
              <Text size="sm" c="dimmed">
                {staff.length} staff members
              </Text>
            </div>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {staff.map((staffMember) => (
            <Card key={staffMember.id} shadow="sm" padding="lg" radius="md" withBorder className="h-full hover:shadow-md transition-shadow">
              <Stack gap="md" className="h-full">
                {/* Staff Member Info */}
                <Group gap="md">
                  <Avatar 
                    src={staffMember.imageUrl} 
                    size="lg" 
                    radius="xl"
                    color={getDepartmentColor(staffMember.department)}
                  >
                    {staffMember.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <div className="flex-1">
                    <Title order={3} size="h4" className="text-gray-800">
                      {staffMember.name}
                    </Title>
                    <Text size="sm" c="dimmed">
                      {staffMember.position}
                    </Text>
                    {staffMember.experience && (
                      <Text size="xs" c="dimmed">
                        {staffMember.experience} years experience
                      </Text>
                    )}
                  </div>
                </Group>

                <div>
                  <Badge color={getDepartmentColor(staffMember.department)} variant="light">
                    {staffMember.department}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Group gap="xs" className="text-xs text-gray-600">
                    <IconMail size={14} />
                    <Text size="xs" truncate>{staffMember.email}</Text>
                  </Group>
                  
                  {staffMember.phone && (
                    <Group gap="xs" className="text-xs text-gray-600">
                      <IconPhone size={14} />
                      <Text size="xs">{staffMember.phone}</Text>
                    </Group>
                  )}
                  
                  {staffMember.location && (
                    <Group gap="xs" className="text-xs text-gray-600">
                      <IconMapPin size={14} />
                      <Text size="xs">{staffMember.location}</Text>
                    </Group>
                  )}
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => handleViewStaff(staffMember)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Stack>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Group justify="center" mt="xl">
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
              size="sm"
            />
          </Group>
        )}

        {/* Staff Details Modal */}
        {modalOpen && selectedStaff && createPortal(
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
              minWidth: '500px',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
                  {selectedStaff.name}
                </h2>
                <button 
                  onClick={() => setModalOpen(false)}
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
                {/* Profile Image */}
                <div style={{ textAlign: 'center' }}>
                  <Avatar 
                    src={selectedStaff.imageUrl} 
                    size="xl" 
                    radius="xl"
                    color={getDepartmentColor(selectedStaff.department)}
                    style={{ margin: '0 auto 16px' }}
                  >
                    {selectedStaff.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                </div>

                {/* Staff Information */}
                <div style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '16px', 
                  borderRadius: '8px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>Position</label>
                    <Text size="sm">{selectedStaff.position}</Text>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>Department</label>
                    <Badge color={getDepartmentColor(selectedStaff.department)} variant="light">
                      {selectedStaff.department}
                    </Badge>
                  </div>
                  {selectedStaff.experience && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>Experience</label>
                      <Text size="sm">{selectedStaff.experience} years</Text>
                    </div>
                  )}
                  {selectedStaff.location && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' }}>Location</label>
                      <Text size="sm">{selectedStaff.location}</Text>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Contact Information</label>
                  <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '12px', 
                    borderRadius: '6px',
                    border: '1px solid #ddd'
                  }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Group gap="xs">
                        <IconMail size={16} />
                        <Text size="sm">{selectedStaff.email}</Text>
                      </Group>
                    </div>
                    {selectedStaff.phone && (
                      <div>
                        <Group gap="xs">
                          <IconPhone size={16} />
                          <Text size="sm">{selectedStaff.phone}</Text>
                        </Group>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {selectedStaff.bio && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Bio</label>
                    <div style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '12px', 
                      borderRadius: '6px',
                      border: '1px solid #ddd'
                    }}>
                      <Text size="sm" style={{ lineHeight: '1.5' }}>
                        {selectedStaff.bio}
                      </Text>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button 
                    onClick={() => setModalOpen(false)}
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
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </Container>
    </div>
  );
};

export default StaffPage; 