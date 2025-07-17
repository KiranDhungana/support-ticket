import { useEffect, useState } from "react";
import { getUsers, promoteUser } from "../../services/api";
import { Button, Menu, Table, Card, Paper, Group, Text, Avatar, Badge, TextInput, Pagination } from "@mantine/core";
import { IconUser, IconSearch, IconDotsVertical, IconEdit, IconLock, IconTrash, IconUserUp, IconInbox } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const UserPage = () => {
  const [users, setusers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
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

  const handleEdit = (id: any) => {
    console.log(id);
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

  if (loading) return <div className="mt-[100px]">Loading tickets...</div>;
  if (error) return <div className="mt-[100px] text-red-500">{error}</div>;
  return (
    <Card shadow="lg" radius="lg" p="xl" className="mt-8">
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
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.length > 0 ? (
              paged.map((user: any) => (
                <tr key={user.id} className="hover:bg-blue-50 transition">
                  <td className="py-3 px-4">
                    <Avatar color="blue" radius="xl" size="sm" src={null}>{user.name ? user.name[0] : "U"}</Avatar>
                  </td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <Badge color={user.role === "admin" ? "green" : "gray"} variant="light">{user.role}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <Menu shadow="md" width={150}>
                        <Menu.Target>
                          <Button variant="subtle" className="p-2">
                            <IconDotsVertical size={20} className="text-gray-600 hover:text-gray-800" />
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEdit(user.id)}>
                            Edit
                          </Menu.Item>
                          <Menu.Item leftSection={<IconUserUp size={14} />} onClick={() => handlePromoteUser(user.id)}>
                            Make Admin
                          </Menu.Item>
                          <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(user.id)}>
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
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
  );
};

export default UserPage;
