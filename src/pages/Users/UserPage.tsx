import { useEffect, useState } from "react";
import { getUsers, promoteUser } from "../../services/api";
import { 
  Button, 
  Menu, 
  Table, 
  Card, 
  Paper, 
  Group, 
  Text, 
  Avatar, 
  Badge, 
  TextInput, 
  Pagination,
  Container,
  Stack,
  Grid,
  ActionIcon,
  Tooltip,
  Modal
} from "@mantine/core";
import { 
  IconUser, 
  IconSearch, 
  IconDotsVertical, 
  IconEdit, 
  IconTrash, 
  IconUserUp, 
  IconInbox,
  IconMail,
  IconCalendar,
  IconId,
  IconEye,
  IconCrown
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from '@mantine/hooks';
import { createPortal } from "react-dom";

const UserPage = () => {
  const [users, setusers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pageSize = 8;

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if (response) {
        console.log(response.data.data, "all");
        setusers(response.data.data);
      }
      console.log(response);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    open();
  };

  const handleEdit = (id: any) => {
    const user = users.find((u: any) => u.id === id) as any;
    if (user) {
      setEditingUser(user);
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user'
      });
      openEdit();
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`https://api.82.25.95.230.nip.io/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        notifications.show({
          title: "Success",
          message: "User updated successfully",
          color: "green",
          position: "top-right",
        });
        closeEdit();
        fetchUsers();
      } else {
        const errorData = await response.json();
        notifications.show({
          title: "Error",
          message: errorData.message || "Failed to update user",
          color: "red",
          position: "top-right",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong. Please try again.",
        color: "red",
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePromoteUser = async (id: any) => {
    try {
      const response = await promoteUser(id);

      if (response && response.data.success) {
        notifications.show({
          title: "User Promoted",
          message: "The user Has been promoted successfully.",
          color: "green",
          position: "top-right",
        });
        fetchUsers();
      } else {
        notifications.show({
          title: "Failed",
          message: "Failed to promote user",
          color: "red",
          position: "top-right",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong. Please try again.",
        color: "red",
      });
      console.error("Ticket creation error:", error);
    }
  };
  const handleDelete = (id: any) => {
    console.log(id);
  };
  console.log(users, "all data");

  // Filtered and paginated users
  const filtered = users.filter((u: any) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <div className="mt-[100px]">Loading users...</div>;
  if (error) return <div className="mt-[100px] text-red-500">{error}</div>;
  
  const adminCount = users.filter((u: any) => u.role === 'admin').length;
  const userCount = users.filter((u: any) => u.role === 'user').length;
  const totalCount = users.length;

  return (
    <Container size="xl" className="py-6 px-4">
      {/* Header */}
      <Paper withBorder shadow="sm" radius="lg" p="xl" mb="xl" className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <div className="p-3 bg-blue-600 rounded-xl">
              <IconUser size={32} className="text-white" />
            </div>
            <div>
              <Text fw={700} size="2xl" className="text-gray-800">User Management</Text>
              <Text size="sm" c="dimmed">Manage all users and their permissions</Text>
            </div>
          </Group>
        </Group>
      </Paper>

      {/* Stats Cards */}
      <Grid gutter="lg" mb="xl">
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Card withBorder shadow="sm" radius="lg" p="xl" className="hover:shadow-md transition-shadow">
            <Group gap="md">
              <div className="p-3 bg-blue-100 rounded-xl">
                <IconUser size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <Text size="lg" fw={600} className="text-gray-800">{totalCount}</Text>
                <Text size="sm" c="dimmed">Total Users</Text>
              </div>
            </Group>
            <Badge color="blue" variant="light" size="sm" mt="sm">
              All Users
            </Badge>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Card withBorder shadow="sm" radius="lg" p="xl" className="hover:shadow-md transition-shadow">
            <Group gap="md">
              <div className="p-3 bg-green-100 rounded-xl">
                <IconCrown size={24} className="text-green-600" />
              </div>
              <div className="flex-1">
                <Text size="lg" fw={600} className="text-gray-800">{adminCount}</Text>
                <Text size="sm" c="dimmed">Administrators</Text>
              </div>
            </Group>
            <Badge color="green" variant="light" size="sm" mt="sm">
              Admins
            </Badge>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Card withBorder shadow="sm" radius="lg" p="xl" className="hover:shadow-md transition-shadow">
            <Group gap="md">
              <div className="p-3 bg-gray-100 rounded-xl">
                <IconUser size={24} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <Text size="lg" fw={600} className="text-gray-800">{userCount}</Text>
                <Text size="sm" c="dimmed">Regular Users</Text>
              </div>
            </Group>
            <Badge color="gray" variant="light" size="sm" mt="sm">
              Users
            </Badge>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Users Table */}
      <Card shadow="lg" radius="lg" p="xl">
      <Group gap="sm" align="center" className="mb-6">
        <IconUser size={28} className="text-blue-700" />
        <Text fw={700} size="xl">All Users</Text>
      </Group>
      <TextInput
        leftSection={<IconSearch size={18} />}
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        w={240}
        mb="md"
      />
      <div className="overflow-x-auto">
        <Table
          striped
          highlightOnHover
          verticalSpacing="md"
          horizontalSpacing="lg"
          withTableBorder
          className="rounded-xl shadow text-[15px] border border-gray-200"
        >
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="text-gray-700 uppercase text-[13px] tracking-wide">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length > 0 ? (
              paged.map((user: any) => (
                <tr key={user.id} className="hover:bg-blue-50 transition">
                  <td className="py-3 px-4">
                    <Avatar color="blue" radius="xl" size="sm" src={user.picture}>{user.name ? user.name[0] : "U"}</Avatar>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <Text fw={500}>{user.name}</Text>
                      <Text size="xs" c="dimmed">ID: {user.id.slice(0, 8)}...</Text>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Group gap="xs">
                      <IconMail size={14} className="text-gray-500" />
                      <Text>{user.email}</Text>
                    </Group>
                  </td>
                  <td className="py-3 px-4">
                    <Badge 
                      color={user.role === "admin" ? "green" : "gray"} 
                      variant="light"
                      leftSection={user.role === "admin" ? <IconCrown size={12} /> : <IconUser size={12} />}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Group gap="xs">
                      <IconCalendar size={14} className="text-gray-500" />
                      <Text size="sm">{new Date(user.createdAt).toLocaleDateString()}</Text>
                    </Group>
                  </td>
                  <td className="py-3 px-4">
                    <Group gap="xs" justify="center">
                      <Tooltip label="View Details">
                        <ActionIcon
                          variant="light"
                          size="sm"
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Menu shadow="md" width={150}>
                        <Menu.Target>
                          <ActionIcon variant="light" size="sm">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEdit(user.id)}>
                            Edit
                          </Menu.Item>
                          {user.role !== "admin" && (
                            <Menu.Item leftSection={<IconUserUp size={14} />} onClick={() => handlePromoteUser(user.id)}>
                              Make Admin
                            </Menu.Item>
                          )}
                          <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(user.id)}>
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <IconInbox size={48} />
                    <div className="mt-2">No users found</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <Group justify="end" mt="md">
        <Pagination total={Math.ceil(filtered.length / pageSize)} value={page} onChange={setPage} />
      </Group>
      </Card>

      {/* User Details Modal */}
      <Modal 
        opened={opened} 
        onClose={close}
        title="User Details"
        size="md"
        centered
      >
        {selectedUser && (
          <Stack gap="md">
            <Group gap="md">
              <Avatar color="blue" radius="xl" size="lg" src={selectedUser.picture}>
                {selectedUser.name ? selectedUser.name[0] : "U"}
              </Avatar>
              <div>
                <Text fw={600} size="lg">{selectedUser.name}</Text>
                <Badge 
                  color={selectedUser.role === "admin" ? "green" : "gray"} 
                  variant="light"
                  leftSection={selectedUser.role === "admin" ? <IconCrown size={12} /> : <IconUser size={12} />}
                >
                  {selectedUser.role}
                </Badge>
              </div>
            </Group>

            <div>
              <Group gap="xs" mb="xs">
                <IconMail size={16} className="text-gray-500" />
                <Text fw={500}>Email</Text>
              </Group>
              <Text size="sm" c="dimmed">{selectedUser.email}</Text>
            </div>

            <div>
              <Group gap="xs" mb="xs">
                <IconId size={16} className="text-gray-500" />
                <Text fw={500}>User ID</Text>
              </Group>
              <Text size="sm" c="dimmed" style={{ fontFamily: 'monospace' }}>{selectedUser.id}</Text>
            </div>

            <div>
              <Group gap="xs" mb="xs">
                <IconCalendar size={16} className="text-gray-500" />
                <Text fw={500}>Created At</Text>
              </Group>
              <Text size="sm" c="dimmed">{new Date(selectedUser.createdAt).toLocaleString()}</Text>
            </div>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close}>
                Close
              </Button>
              {selectedUser.role !== "admin" && (
                <Button 
                  leftSection={<IconUserUp size={16} />}
                  onClick={() => {
                    handlePromoteUser(selectedUser.id);
                    close();
                  }}
                >
                  Make Admin
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Edit User Modal */}
      {editOpened && createPortal(
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
                {editingUser ? `Edit User #${editingUser.id.slice(0, 8)}` : 'Edit User'}
              </h2>
              <button 
                onClick={closeEdit}
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

            {editingUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Name *</label>
                  <input
                    type="text"
                    placeholder="Enter user name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
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
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Email *</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
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
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Role *</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button 
                    onClick={closeEdit}
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
                    onClick={handleSaveEdit}
                    disabled={!editForm.name || !editForm.email || !editForm.role || isSubmitting}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      background: (!editForm.name || !editForm.email || !editForm.role || isSubmitting) ? '#ccc' : '#007bff',
                      color: 'white',
                      cursor: (!editForm.name || !editForm.email || !editForm.role || isSubmitting) ? 'not-allowed' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', color: '#666' }}>
                <IconUser size={48} />
                <div style={{ marginTop: '16px', fontSize: '18px', fontWeight: '500' }}>Loading user details...</div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </Container>
  );
};

export default UserPage;
