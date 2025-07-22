import { useEffect, useState } from "react";
import TicketTable from "../../components/TicketTable";
import { logout, getTickets, getDashboardStats } from "../../services/api";
import { 
  Card, 
  Group, 
  Text, 
  Button, 
  Paper, 
  Grid, 
  Stack,
  RingProgress,
  Badge,
  ActionIcon,
  Tooltip,
  Container,
  Flex,
  Box,
  Divider
} from "@mantine/core";
import { 
  IconLogout, 
  IconTicket, 
  IconLockOpen2, 
  IconX, 
  IconUsers,
  IconClock,
  IconTrendingUp,
  IconBell,
  IconSettings,
  IconRefresh,
  IconDashboard,
  IconFileText,
  IconUser,
  IconBuilding
} from "@tabler/icons-react";

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Default values if stats are not loaded yet
  const openCount = dashboardStats?.overview?.openTickets || 0;
  const closedCount = dashboardStats?.overview?.closedTickets || 0;
  const totalCount = dashboardStats?.overview?.totalTickets || 0;
  const resolutionRate = dashboardStats?.overview?.resolutionRate || 0;



  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const [ticketsResponse, statsResponse] = await Promise.all([
        getTickets(),
        getDashboardStats()
      ]);
      
      setTickets(ticketsResponse.data);
      setDashboardStats(statsResponse.data.data);
      console.log('Dashboard stats:', statsResponse.data.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchTickets = async () => {
    try {
      setRefreshing(true);
      const response = await getTickets();
      setTickets(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch tickets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container size="xl" className="mt-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <Text size="lg" c="dimmed">Loading dashboard...</Text>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" className="mt-8">
        <Paper withBorder p="xl" className="text-center">
          <IconX size={48} className="text-red-500 mx-auto mb-4" />
          <Text size="lg" c="red" mb="md">{error}</Text>
          <Button onClick={fetchDashboardData} leftSection={<IconRefresh size={16} />}>
            Retry
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-6 px-4">
        {/* Header Section */}
        <Paper withBorder shadow="sm" radius="lg" p="xl" mb="xl" className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <Flex justify="space-between" align="center" wrap="wrap" gap="md">
            <Group gap="md">
              <div className="p-3 bg-blue-600 rounded-xl">
                <IconTicket size={32} className="text-white" />
              </div>
              <div>
                <Text fw={700} size="2xl" className="text-gray-800">Admin Dashboard</Text>
                <Text size="sm" c="dimmed">Manage support tickets and monitor system performance</Text>
              </div>
            </Group>
            <Group gap="sm">
              <Tooltip label="Refresh data">
                <ActionIcon 
                  variant="light" 
                  size="lg" 
                  onClick={fetchDashboardData}
                  loading={refreshing}
                  className="hover:bg-blue-100"
                >
                  <IconRefresh size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Notifications">
                <ActionIcon variant="light" size="lg" className="hover:bg-blue-100">
                  <IconBell size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Settings">
                <ActionIcon variant="light" size="lg" className="hover:bg-blue-100">
                  <IconSettings size={20} />
                </ActionIcon>
              </Tooltip>
              <Button 
                leftSection={<IconLogout size={18} />} 
                color="red" 
                variant="light" 
                onClick={logout}
                className="hover:bg-red-50"
              >
                Logout
              </Button>
            </Group>
          </Flex>
        </Paper>

        {/* Stats Cards */}
        <Grid gutter="lg" mb="xl">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder shadow="sm" radius="lg" p="xl" className="hover:shadow-md transition-shadow">
              <Group gap="md">
                <div className="p-3 bg-green-100 rounded-xl">
                  <IconLockOpen2 size={24} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <Text size="lg" fw={600} className="text-gray-800">{openCount}</Text>
                  <Text size="sm" c="dimmed">Open Tickets</Text>
                </div>
              </Group>
              <Badge color="green" variant="light" size="sm" mt="sm">
                Active
              </Badge>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder shadow="sm" radius="lg" p="xl" className="hover:shadow-md transition-shadow">
              <Group gap="md">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <IconX size={24} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <Text size="lg" fw={600} className="text-gray-800">{closedCount}</Text>
                  <Text size="sm" c="dimmed">Closed Tickets</Text>
                </div>
              </Group>
              <Badge color="gray" variant="light" size="sm" mt="sm">
                Resolved
              </Badge>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder shadow="sm" radius="lg" p="xl" className="hover:shadow-md transition-shadow">
              <Group gap="md">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <IconUsers size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <Text size="lg" fw={600} className="text-gray-800">{totalCount}</Text>
                  <Text size="sm" c="dimmed">Total Tickets</Text>
                </div>
              </Group>
              <Badge color="blue" variant="light" size="sm" mt="sm">
                All Time
              </Badge>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder shadow="sm" radius="lg" p="xl" className="hover:shadow-md transition-shadow">
              <Group gap="md">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <IconTrendingUp size={24} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <Text size="lg" fw={600} className="text-gray-800">{resolutionRate}%</Text>
                  <Text size="sm" c="dimmed">Resolution Rate</Text>
                </div>
              </Group>
              <Badge color="purple" variant="light" size="sm" mt="sm">
                Success
              </Badge>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Progress Ring */}
        <Grid gutter="lg" mb="xl">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder shadow="sm" radius="lg" p="xl" className="text-center">
              <RingProgress
                size={120}
                thickness={12}
                roundCaps
                sections={[
                  { value: resolutionRate, color: 'green' },
                  { value: 100 - resolutionRate, color: 'gray.3' }
                ]}
                label={
                  <Text ta="center" size="lg" fw={700}>
                    {resolutionRate}%
                  </Text>
                }
              />
              <Text size="sm" c="dimmed" mt="md">Overall Resolution Rate</Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card withBorder shadow="sm" radius="lg" p="xl">
              <Group gap="md" mb="md">
                <IconClock size={20} className="text-blue-600" />
                <Text fw={600} size="lg">Recent Activity</Text>
              </Group>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm">New tickets today</Text>
                  <Badge color="blue" variant="light">{dashboardStats?.today?.newTickets || 0}</Badge>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text size="sm">Tickets resolved today</Text>
                  <Badge color="green" variant="light">{dashboardStats?.today?.resolvedTickets || 0}</Badge>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text size="sm">Total active tickets</Text>
                  <Badge color="purple" variant="light">{dashboardStats?.today?.activeTickets || 0}</Badge>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Management Links */}
      

        {/* Tickets Table */}
        <Card withBorder shadow="sm" radius="lg" p="xl">
          <Group gap="md" mb="md">
            <IconTicket size={20} className="text-blue-600" />
            <Text fw={600} size="lg">Recent Support Tickets</Text>
          </Group>
          <TicketTable data={tickets} refreshTickets={fetchDashboardData} isAdmin={true} />
        </Card>
      </Container>
  );
};

export default AdminDashboard;
