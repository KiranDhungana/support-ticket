import { useState, useEffect } from 'react';
import { 
  Card, 
  Text, 
  Group, 
  Avatar, 
  Badge, 
  Button, 
  Modal, 
  Stack, 
  Title, 
  Container, 
  TextInput, 
  Grid,
  Divider,
  Anchor,
  Breadcrumbs,
  Loader
} from '@mantine/core';
import { 
  IconSearch, 
  IconMail, 
  IconPhone, 
  IconCalendar,
  IconEye
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import HomeNavigation from '../../components/HomeNavigation';
import { boardMemberService } from '../../services/boardMemberService';
import type { BoardMember } from '../../services/boardMemberService';
import logoImage from '../../assets/logo.png';

const BoardMembers = () => {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  
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

  const filteredMembers = boardMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.district && member.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewMember = (member: BoardMember) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const breadcrumbItems = [
          { title: 'West Carroll Parish Schools', href: '/' },
  { title: 'Leadership', href: '#' },
  { title: 'Board Members', href: '/board-members' }
].map((item, index) => (
  <Anchor href={item.href} key={index} size="sm">
    {item.title}
  </Anchor>
));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

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
              <img 
                src={logoImage} 
                alt="Logo" 
                className="w-12 h-12" 
                onError={(e) => {
                  console.error('Logo failed to load:', e);
                  e.currentTarget.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-12 h-12 bg-blue-700 text-white rounded flex items-center justify-center text-xs font-bold';
                  fallback.textContent = 'WCPSB';
                  e.currentTarget.parentNode?.insertBefore(fallback, e.currentTarget);
                }}
              />
                              <Title order={1} className="text-4xl font-bold wcpsb-gold">
                Board Members
              </Title>
            </div>

          </Group>
          <Text className="text-gray-600 text-lg">
            Meet the dedicated members of the West Carroll Parish School Board who work to ensure quality education for all students.
          </Text>
        </div>

        {/* Search Section */}
        <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-6">
          <TextInput
            placeholder="Search by name, district, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftSection={<IconSearch size={16} />}
            size="md"
          />
        </Card>

        {/* Board Members Grid */}
        <Grid gutter="lg">
          {filteredMembers.map((member) => (
            <Grid.Col key={member.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full hover:shadow-md transition-shadow">
                <div className="text-center mb-4">
                  <Avatar 
                    src={member.imageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'} 
                    alt={member.name} 
                    size={120} 
                    radius={120} 
                    mx="auto"
                    className="mb-3"
                  />
                  <Title order={3} className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </Title>
                  {member.district && (
                    <Badge color="blue" variant="light" size="sm" className="mb-2">
                      {member.district}
                    </Badge>
                  )}
                  <Text size="sm" className="text-gray-600 font-medium">
                    {member.position}
                  </Text>
                </div>

                <Divider className="my-4" />

                <Stack gap="xs" className="mb-4">
                  {member.email && (
                    <Group gap="xs">
                      <IconMail size={16} className="text-gray-500" />
                      <Text size="sm" className="text-gray-600 truncate">
                        {member.email}
                      </Text>
                    </Group>
                  )}
                  {member.phone && (
                    <Group gap="xs">
                      <IconPhone size={16} className="text-gray-500" />
                      <Text size="sm" className="text-gray-600">
                        {member.phone}
                      </Text>
                    </Group>
                  )}
                </Stack>

                <Button 
                  fullWidth
                  variant="light" 
                  color="blue"
                  leftSection={<IconEye size={16} />}
                  onClick={() => handleViewMember(member)}
                >
                  View Details
                </Button>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {filteredMembers.length === 0 && (
          <Card shadow="sm" padding="xl" radius="md" withBorder className="text-center">
            <Text size="lg" className="text-gray-500">
              No board members found matching your search.
            </Text>
          </Card>
        )}
      </Container>

      {/* Board Member Detail Modal */}
      <Modal 
        opened={modalOpen} 
        onClose={() => setModalOpen(false)} 
        size="lg"
        title="Board Member Details"
      >
        {selectedMember && (
          <Stack gap="lg">
            <div className="text-center">
              <Avatar 
                src={selectedMember.imageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'} 
                alt={selectedMember.name} 
                size={150} 
                radius={150} 
                mx="auto"
                className="mb-4"
              />
              <Title order={2} className="text-2xl font-bold text-gray-900 mb-2">
                {selectedMember.name}
              </Title>
              {selectedMember.district && (
                <Badge color="blue" variant="light" size="lg" className="mb-2">
                  {selectedMember.district}
                </Badge>
              )}
              <Text size="lg" className="text-gray-600 font-medium">
                {selectedMember.position}
              </Text>
            </div>

            <Divider />

            <div>
              <Title order={4} className="text-lg font-semibold mb-3">Contact Information</Title>
              <Stack gap="sm">
                {selectedMember.email && (
                  <Group gap="sm">
                    <IconMail size={18} className="text-gray-500" />
                    <Text size="sm">{selectedMember.email}</Text>
                  </Group>
                )}
                {selectedMember.phone && (
                  <Group gap="sm">
                    <IconPhone size={18} className="text-gray-500" />
                    <Text size="sm">{selectedMember.phone}</Text>
                  </Group>
                )}
              </Stack>
            </div>

            {selectedMember.bio && (
              <div>
                <Title order={4} className="text-lg font-semibold mb-3">Background</Title>
                <Text size="sm" className="text-gray-700">
                  {selectedMember.bio}
                </Text>
              </div>
            )}

            {(selectedMember.termStart || selectedMember.termEnd) && (
              <div>
                <Title order={4} className="text-lg font-semibold mb-3">Term Information</Title>
                <Group gap="sm">
                  <IconCalendar size={16} className="text-gray-500" />
                  <Text size="sm" className="font-medium">Term:</Text>
                  <Text size="sm">
                    {selectedMember.termStart && new Date(selectedMember.termStart).getFullYear()} - 
                    {selectedMember.termEnd && new Date(selectedMember.termEnd).getFullYear()}
                  </Text>
                </Group>
              </div>
            )}
          </Stack>
        )}
      </Modal>

      
    </div>
  );
};

export default BoardMembers; 