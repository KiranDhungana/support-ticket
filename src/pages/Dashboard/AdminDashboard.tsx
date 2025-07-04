import { useEffect, useState } from "react";
import TicketTable from "../../components/TicketTable";
import { logout, getTickets } from "../../services/api";
import { useDisclosure } from "@mantine/hooks";
import { Card, Group, Text, Button, Paper } from "@mantine/core";
import { IconLogout, IconTicket, IconLockOpen2, IconX } from "@tabler/icons-react";

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const openCount = tickets.filter((t: any) => t.status !== 0).length;
  const closedCount = tickets.filter((t: any) => t.status === 0).length;
  const fetchTickets = async () => {
    try {
      const response = await getTickets();
      setTickets(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) return <div className="mt-[100px]">Loading tickets...</div>;
  if (error) return <div className="mt-[100px] text-red-500">{error}</div>;
  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Group justify="space-between" align="center" className="mb-6">
        <Group gap="sm">
          <IconTicket size={32} className="text-blue-700" />
          <Text fw={700} size="2xl">Admin Dashboard</Text>
        </Group>
        <Button leftSection={<IconLogout size={18} />} color="red" variant="light" onClick={logout}>
          Logout
        </Button>
      </Group>
      <Paper withBorder shadow="md" radius="lg" p="lg" className="mb-8">
        <Group gap="xl">
          <Group gap="xs"><IconLockOpen2 size={20} className="text-green-600" /><Text size="lg">Open Tickets: <b>{openCount}</b></Text></Group>
          <Group gap="xs"><IconX size={20} className="text-gray-600" /><Text size="lg">Closed Tickets: <b>{closedCount}</b></Text></Group>
        </Group>
      </Paper>
      <Paper withBorder shadow="md" radius="lg" p="lg">
        <TicketTable isAdmin={true} data={tickets} refreshTickets={fetchTickets} />
      </Paper>
    </div>
  );
};

export default AdminDashboard;
