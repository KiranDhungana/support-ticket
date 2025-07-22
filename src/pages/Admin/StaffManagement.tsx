import { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Title, 
  Button, 
  Group, 
  Text, 
  TextInput, 
  Select, 
  Stack, 
  Card, 
  Badge, 
  ActionIcon, 
  Tooltip,
  Grid,
  Divider,
  LoadingOverlay,
  Avatar,
  Pagination
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createPortal } from 'react-dom';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconEye, 
  IconUsers,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconSearch
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { getStaff, createStaff, updateStaff, deleteStaff, getDepartments } from '../../services/staffService';
import type { Staff } from '../../services/staffService';
import MediaUpload from '../../components/MediaUpload';

const StaffManagement = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    bio: '',
    imageUrl: ''
  });

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
      const response = await getStaff(currentPage, 10, search, selectedDepartment);
      setStaff(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Error fetching staff:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch staff members',
        color: 'red'
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const staffData = {
        ...formData,
        experience: formData.experience ? parseInt(formData.experience) : undefined
      };

      if (editingStaff) {
        await updateStaff(editingStaff.id, staffData);
        notifications.show({
          title: 'Success',
          message: 'Staff member updated successfully',
          color: 'green'
        });
      } else {
        await createStaff(staffData);
        notifications.show({
          title: 'Success',
          message: 'Staff member created successfully',
          color: 'green'
        });
      }
      
      close();
      setEditingStaff(null);
      resetForm();
      fetchStaff();
    } catch (error: any) {
      console.error('Error saving staff member:', error);
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to save staff member',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      position: staffMember.position,
      department: staffMember.department,
      email: staffMember.email,
      phone: staffMember.phone || '',
      location: staffMember.location || '',
      experience: staffMember.experience?.toString() || '',
      bio: staffMember.bio || '',
      imageUrl: staffMember.imageUrl || ''
    });
    open();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      setLoading(true);
      await deleteStaff(id);
      notifications.show({
        title: 'Success',
        message: 'Staff member deleted successfully',
        color: 'green'
      });
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff member:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete staff member',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      location: '',
      experience: '',
      bio: '',
      imageUrl: ''
    });
  };

  const openCreateModal = () => {
    setEditingStaff(null);
    resetForm();
    open();
  };

  return (
    <Container size="xl" className="py-6 px-4">
      <LoadingOverlay visible={loading} />

      {/* Header */}
      <Paper withBorder shadow="sm" radius="lg" p="xl" mb="xl" className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <div className="p-3 bg-blue-600 rounded-xl">
              <IconUsers size={32} className="text-white" />
            </div>
            <div>
              <Title order={1} size="h2" className="text-gray-800">Staff Management</Title>
              <Text size="sm" c="dimmed">Manage school staff members and their information</Text>
            </div>
          </Group>
          <Group gap="sm">
            <Button 
              leftSection={<IconPlus size={18} />} 
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Staff Member
            </Button>
          </Group>
        </Group>
      </Paper>

      {/* Filters */}
      <Paper withBorder shadow="sm" radius="lg" p="md" mb="lg">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              placeholder="Search staff members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftSection={<IconSearch size={16} />}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              placeholder="Filter by department"
              value={selectedDepartment}
              onChange={(value) => setSelectedDepartment(value || '')}
              data={departments.map(dept => ({ value: dept, label: dept }))}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Group justify="flex-end">
              <Text size="sm" c="dimmed">
                {staff.length} staff members
              </Text>
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Staff Grid */}
      <Grid gutter="lg">
        {staff.map((staffMember) => (
          <Grid.Col key={staffMember.id} span={{ base: 12, sm: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full">
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
                  <Group justify="space-between" mb="xs">
                    <Badge color={getDepartmentColor(staffMember.department)} variant="light">
                      {staffMember.department}
                    </Badge>
                  </Group>
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

                <Divider />

                <Group gap="xs">
                  <Tooltip label="View Details">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      onClick={() => handleEdit(staffMember)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                  </Tooltip>
                  
                  <Tooltip label="Edit">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      onClick={() => handleEdit(staffMember)}
                      className="text-orange-600 hover:bg-orange-50"
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                  
                  <Tooltip label="Delete">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      onClick={() => handleDelete(staffMember.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

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

      {/* Create/Edit Modal */}
      {opened && createPortal(
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
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h2>
              <button 
                onClick={close}
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
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Name *</label>
                <input
                  type="text"
                  placeholder="Enter staff member name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Position *</label>
                <input
                  type="text"
                  placeholder="Enter position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Email *</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Phone</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Location</label>
                <input
                  type="text"
                  placeholder="Enter location/room"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Years of Experience</label>
                <input
                  type="number"
                  placeholder="Enter years of experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Upload Profile Image</label>
                <MediaUpload
                  onUploadComplete={(files) => {
                    const imageFile = files.find(f => f.type === 'image');
                    setFormData({
                      ...formData,
                      imageUrl: imageFile?.url || formData.imageUrl
                    });
                  }}
                  contentType="principals"
                  maxFiles={1}
                  label="Upload Profile Image"
                  description="Upload a profile image for this staff member"
                  showPreview={true}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Bio</label>
                <div style={{ border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                  <textarea
                    placeholder="Enter staff member bio..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button 
                  onClick={close}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.position || !formData.department || !formData.email}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    background: (!formData.name || !formData.position || !formData.department || !formData.email) ? '#ccc' : '#007bff',
                    color: 'white',
                    cursor: (!formData.name || !formData.position || !formData.department || !formData.email) ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {editingStaff ? 'Update Staff Member' : 'Create Staff Member'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </Container>
  );
};

export default StaffManagement; 