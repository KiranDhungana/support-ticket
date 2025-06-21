import { useEffect, useState } from "react";
import { getUsers, promoteUser } from "../../services/api";
import { Button, Menu, Table } from "@mantine/core";
import { IconDotsVertical, IconEdit, IconLock, IconTrash, IconUserUp } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const UserPage = () => {
  const [users, setusers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div className="mt-[100px]">Loading tickets...</div>;
  if (error) return <div className="mt-[100px] text-red-500">{error}</div>;
  return (
    <div>
      <div className="pl-4 pt-4 bg-white rounded-  overflow-x-auto">
        <Table
          striped
          highlightOnHover
          verticalSpacing="md"
          horizontalSpacing="lg"
          withTableBorder
          className="text-[15px]"
        >
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="text-gray-700 uppercase text-[13px] tracking-wide">
              <th className="py-3 px-4">Ticket ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-100 transition">
                  <td className="py-3 px-4">{user.id}</td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.role}</td>

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
                          <Menu.Item
                            leftSection={<IconTrash size={14} />}
                            color="red"
                            onClick={() => handleDelete(user.id)}
                          >
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
                <td colSpan={9} className="text-center py-8 text-gray-400">
                  No tickets found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default UserPage;
