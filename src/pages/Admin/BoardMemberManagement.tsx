import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Card,
  Table,
  Button,
  Modal,
  TextInput,
  Textarea,
  Group,
  ActionIcon,
  Tooltip,
  Badge,
  Stack,
  Text,
  Loader
} from '@mantine/core';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconEye,
  IconSearch 
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { boardMemberService } from '../../services/boardMemberService';
import type { BoardMember, CreateBoardMemberData } from '../../services/boardMemberService';


const BoardMemberManagement = () => {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);

  const [formData, setFormData] = useState<CreateBoardMemberData>({
    name: '',
    position: '',
    district: '',
    email: '',
    phone: '',
    bio: '',
    termStart: '',
    termEnd: ''
  });

  useEffect(() => {
    fetchBoardMembers();
  }, []);

  const fetchBoardMembers = async () => {
    try {
      setLoading(true);
      const data = await boardMemberService.getAllBoardMembers();
      setBoardMembers(data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch board members',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingMember) {
        await boardMemberService.updateBoardMember(editingMember.id, formData);
        notifications.show({
          title: 'Success',
          message: 'Board member updated successfully',
          color: 'green'
        });
      } else {
        await boardMemberService.createBoardMember(formData);
        notifications.show({
          title: 'Success',
          message: 'Board member added successfully',
          color: 'green'
        });
      }
      
      setModalOpen(false);
      setEditingMember(null);
      resetForm();
      fetchBoardMembers();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: editingMember ? 'Failed to update board member' : 'Failed to add board member',
        color: 'red'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this board member?')) {
      try {
        await boardMemberService.deleteBoardMember(id);
        notifications.show({
          title: 'Success',
          message: 'Board member deleted successfully',
          color: 'green'
        });
        fetchBoardMembers();
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to delete board member',
          color: 'red'
        });
      }
    }
  };

  const openEditModal = (member: BoardMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      district: member.district || '',
      email: member.email || '',
      phone: member.phone || '',
      bio: member.bio || '',
      termStart: member.termStart || '',
      termEnd: member.termEnd || ''
    });
    setModalOpen(true);
  };

  const openViewModal = (member: BoardMember) => {
    setSelectedMember(member);
    setViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      district: '',
      email: '',
      phone: '',
      bio: '',
      termStart: '',
      termEnd: ''
    });
  };

  const openAddModal = () => {
    setEditingMember(null);
    resetForm();
    setModalOpen(true);
  };

  const filteredMembers = boardMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.district && member.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rows = filteredMembers.map((member) => (
    <Table.Tr key={member.id}>
      <Table.Td>
        <Text fw={500}>{member.name}</Text>
      </Table.Td>
      <Table.Td>{member.position}</Table.Td>
      <Table.Td>{member.district || '-'}</Table.Td>
      <Table.Td>{member.email || '-'}</Table.Td>
      <Table.Td>{member.phone || '-'}</Table.Td>
      <Table.Td>
        <Badge color={member.isActive ? 'green' : 'red'}>
          {member.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Tooltip label="View Details">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => openViewModal(member)}
            >
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit">
            <ActionIcon
              variant="light"
              color="yellow"
              onClick={() => openEditModal(member)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon
              variant="light"
              color="red"
              onClick={() => handleDelete(member.id)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  if (loading) {
    return (
      <Container size="xl" className="py-8">
        <div className="flex items-center justify-center h-64">
          <Loader size="lg" />
        </div>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8">
        <div className="mb-6">
          <Title order={1} className="text-3xl font-bold text-gray-900 mb-2">
            Board Member Management
          </Title>
          <Text className="text-gray-600">
            Manage board members and their information
          </Text>
        </div>

        <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-6">
          <Group justify="space-between" className="mb-4">
            <TextInput
              placeholder="Search board members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1, maxWidth: 400 }}
            />
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openAddModal}
              color="blue"
            >
              Add Board Member
            </Button>
          </Group>

          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Position</Table.Th>
                <Table.Th>District</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? (
                rows
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={7} className="text-center py-8">
                    <Text className="text-gray-500">
                      {searchTerm ? 'No board members found matching your search.' : 'No board members found.'}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingMember ? 'Edit Board Member' : 'Add Board Member'}
          size="lg"
        >
          <Stack gap="md">
            <TextInput
              label="Name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextInput
              label="Position"
              placeholder="e.g., Board President, Board Member"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />
            <TextInput
              label="District"
              placeholder="e.g., District 1"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            />
            <TextInput
              label="Email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              type="email"
            />
            <TextInput
              label="Phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Textarea
              label="Bio"
              placeholder="Enter biographical information"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
            />
            <TextInput
              label="Term Start Date"
              placeholder="YYYY-MM-DD"
              value={formData.termStart}
              onChange={(e) => setFormData({ ...formData, termStart: e.target.value })}
            />
            <TextInput
              label="Term End Date"
              placeholder="YYYY-MM-DD"
              value={formData.termEnd}
              onChange={(e) => setFormData({ ...formData, termEnd: e.target.value })}
            />
            
            <Group justify="flex-end" gap="md">
              <Button variant="light" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!formData.name || !formData.position}
              >
                {editingMember ? 'Update' : 'Add'} Member
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* View Modal */}
        <Modal
          opened={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title="Board Member Details"
          size="lg"
        >
          {selectedMember && (
            <Stack gap="lg">
              <div>
                <Text fw={500} size="sm" c="dimmed">Name</Text>
                <Text>{selectedMember.name}</Text>
              </div>
              <div>
                <Text fw={500} size="sm" c="dimmed">Position</Text>
                <Text>{selectedMember.position}</Text>
              </div>
              {selectedMember.district && (
                <div>
                  <Text fw={500} size="sm" c="dimmed">District</Text>
                  <Text>{selectedMember.district}</Text>
                </div>
              )}
              {selectedMember.email && (
                <div>
                  <Text fw={500} size="sm" c="dimmed">Email</Text>
                  <Text>{selectedMember.email}</Text>
                </div>
              )}
              {selectedMember.phone && (
                <div>
                  <Text fw={500} size="sm" c="dimmed">Phone</Text>
                  <Text>{selectedMember.phone}</Text>
                </div>
              )}
              {selectedMember.bio && (
                <div>
                  <Text fw={500} size="sm" c="dimmed">Bio</Text>
                  <Text>{selectedMember.bio}</Text>
                </div>
              )}
              {(selectedMember.termStart || selectedMember.termEnd) && (
                <div>
                  <Text fw={500} size="sm" c="dimmed">Term</Text>
                  <Text>
                    {selectedMember.termStart && new Date(selectedMember.termStart).getFullYear()} - 
                    {selectedMember.termEnd && new Date(selectedMember.termEnd).getFullYear()}
                  </Text>
                </div>
              )}
              <div>
                <Text fw={500} size="sm" c="dimmed">Status</Text>
                <Badge color={selectedMember.isActive ? 'green' : 'red'}>
                  {selectedMember.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </Stack>
          )}
        </Modal>
      </Container>
  );
};

export default BoardMemberManagement; 