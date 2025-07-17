import { useState } from 'react';
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
  Breadcrumbs
} from '@mantine/core';
import { 
  IconSearch, 
  IconMail, 
  IconPhone, 
  IconMapPin,
  IconBuilding,
  IconCalendar,
  IconUser,
  IconEye
} from '@tabler/icons-react';
import HomeNavigation from '../../components/HomeNavigation';

// Sample board members data with images
const boardMembersData = [
  {
    id: 1,
    name: 'Dr. Danielle Williams',
    district: 'District 1',
    position: 'Board President',
    address: 'P.O. Box 1234 Ruston, LA 71273',
    phone: '318-614-5663',
    email: 'williamsdan@gram.edu',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
    term: '2020-2024',
    bio: 'Dr. Williams has served on the Lincoln Parish School Board since 2020. She brings over 15 years of experience in educational leadership and is passionate about improving student outcomes.',
    committees: ['Academic Excellence', 'Budget & Finance'],
    education: 'Ph.D. Educational Leadership, Louisiana Tech University'
  },
  {
    id: 2,
    name: 'David Ferguson',
    district: 'District 2',
    position: 'Board Vice President',
    address: 'P.O. Box 5678 Ruston, LA 71273',
    phone: '318-614-5664',
    email: 'david.ferguson@lincolnschools.org',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    term: '2018-2024',
    bio: 'David Ferguson has been a dedicated member of the school board for over 6 years. He focuses on fiscal responsibility and community engagement.',
    committees: ['Budget & Finance', 'Facilities'],
    education: 'M.B.A. Business Administration, Louisiana State University'
  },
  {
    id: 3,
    name: 'Clark Canterbury',
    district: 'District 3',
    position: 'Board Member',
    address: 'P.O. Box 9012 Ruston, LA 71273',
    phone: '318-614-5665',
    email: 'clark.canterbury@lincolnschools.org',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    term: '2022-2026',
    bio: 'Clark Canterbury joined the board in 2022 and brings a fresh perspective on technology integration and modern educational practices.',
    committees: ['Technology', 'Student Services'],
    education: 'M.S. Computer Science, Louisiana Tech University'
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    district: 'District 4',
    position: 'Board Member',
    address: 'P.O. Box 3456 Ruston, LA 71273',
    phone: '318-614-5666',
    email: 'sarah.johnson@lincolnschools.org',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    term: '2021-2025',
    bio: 'Sarah Johnson is a former teacher with 20 years of classroom experience. She advocates for teacher support and student well-being.',
    committees: ['Academic Excellence', 'Student Services'],
    education: 'M.Ed. Curriculum & Instruction, University of Louisiana'
  },
  {
    id: 5,
    name: 'Michael Davis',
    district: 'District 5',
    position: 'Board Member',
    address: 'P.O. Box 7890 Ruston, LA 71273',
    phone: '318-614-5667',
    email: 'michael.davis@lincolnschools.org',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    term: '2019-2025',
    bio: 'Michael Davis is a business leader who brings strategic planning expertise to the board. He focuses on long-term district growth.',
    committees: ['Budget & Finance', 'Strategic Planning'],
    education: 'B.S. Business Management, Louisiana Tech University'
  },
  {
    id: 6,
    name: 'Lisa Martinez',
    district: 'District 6',
    position: 'Board Member',
    address: 'P.O. Box 2345 Ruston, LA 71273',
    phone: '318-614-5668',
    email: 'lisa.martinez@lincolnschools.org',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
    term: '2023-2027',
    bio: 'Lisa Martinez is a community advocate and parent who ensures the board represents diverse community perspectives.',
    committees: ['Community Relations', 'Student Services'],
    education: 'B.A. Communications, Louisiana State University'
  },
  {
    id: 7,
    name: 'Robert Wilson',
    district: 'District 7',
    position: 'Board Member',
    address: 'P.O. Box 6789 Ruston, LA 71273',
    phone: '318-614-5669',
    email: 'robert.wilson@lincolnschools.org',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face',
    term: '2020-2024',
    bio: 'Robert Wilson is a retired principal who provides valuable insights into school administration and educational leadership.',
    committees: ['Academic Excellence', 'Facilities'],
    education: 'M.Ed. Educational Administration, University of Louisiana'
  },
  {
    id: 8,
    name: 'Jennifer Brown',
    district: 'District 8',
    position: 'Board Member',
    address: 'P.O. Box 4567 Ruston, LA 71273',
    phone: '318-614-5670',
    email: 'jennifer.brown@lincolnschools.org',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
    term: '2022-2026',
    bio: 'Jennifer Brown is a technology consultant who helps the district stay current with educational technology trends.',
    committees: ['Technology', 'Strategic Planning'],
    education: 'M.S. Information Technology, Louisiana Tech University'
  },
  {
    id: 9,
    name: 'Thomas Anderson',
    district: 'District 9',
    position: 'Board Member',
    address: 'P.O. Box 8901 Ruston, LA 71273',
    phone: '318-614-5671',
    email: 'thomas.anderson@lincolnschools.org',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    term: '2021-2025',
    bio: 'Thomas Anderson is a local attorney who ensures the board operates within legal guidelines and best practices.',
    committees: ['Legal Affairs', 'Budget & Finance'],
    education: 'J.D. Law, Louisiana State University Law Center'
  },
  {
    id: 10,
    name: 'Amanda Garcia',
    district: 'District 10',
    position: 'Board Member',
    address: 'P.O. Box 1235 Ruston, LA 71273',
    phone: '318-614-5672',
    email: 'amanda.garcia@lincolnschools.org',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
    term: '2023-2027',
    bio: 'Amanda Garcia is a healthcare professional who brings expertise in student health and wellness programs.',
    committees: ['Student Services', 'Community Relations'],
    education: 'M.S. Public Health, Tulane University'
  },
  {
    id: 11,
    name: 'Christopher Lee',
    district: 'District 11',
    position: 'Board Member',
    address: 'P.O. Box 5679 Ruston, LA 71273',
    phone: '318-614-5673',
    email: 'christopher.lee@lincolnschools.org',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    term: '2020-2024',
    bio: 'Christopher Lee is an engineer who focuses on facility improvements and infrastructure development.',
    committees: ['Facilities', 'Technology'],
    education: 'M.S. Civil Engineering, Louisiana Tech University'
  },
  {
    id: 12,
    name: 'Rachel Taylor',
    district: 'District 12',
    position: 'Board Member',
    address: 'P.O. Box 9013 Ruston, LA 71273',
    phone: '318-614-5674',
    email: 'rachel.taylor@lincolnschools.org',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    term: '2022-2026',
    bio: 'Rachel Taylor is a former school counselor who advocates for student mental health and social-emotional learning.',
    committees: ['Student Services', 'Academic Excellence'],
    education: 'M.Ed. School Counseling, University of Louisiana'
  }
];

const BoardMembers = () => {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = boardMembersData.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewMember = (member: any) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const breadcrumbItems = [
    { title: 'Lincoln Parish Schools', href: '/' },
    { title: 'Leadership', href: '#' },
    { title: 'Board Members', href: '/board-members' }
  ].map((item, index) => (
    <Anchor href={item.href} key={index} size="sm">
      {item.title}
    </Anchor>
  ));

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
              <img src="/public/Logo.png" alt="Logo" className="w-12 h-12" />
              <Title order={1} className="text-4xl font-bold text-red-600">
                Board Members
              </Title>
            </div>
          </Group>
          <Text className="text-gray-600 text-lg">
            Meet the dedicated members of the Lincoln Parish School Board who work to ensure quality education for all students.
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
                    src={member.image} 
                    alt={member.name} 
                    size={120} 
                    radius={120} 
                    mx="auto"
                    className="mb-3"
                  />
                  <Title order={3} className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </Title>
                  <Badge color="blue" variant="light" size="sm" className="mb-2">
                    {member.district}
                  </Badge>
                  <Text size="sm" className="text-gray-600 font-medium">
                    {member.position}
                  </Text>
                </div>

                <Divider className="my-4" />

                <Stack gap="xs" className="mb-4">
                  <Group gap="xs">
                    <IconMail size={16} className="text-gray-500" />
                    <Text size="sm" className="text-gray-600 truncate">
                      {member.email}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconPhone size={16} className="text-gray-500" />
                    <Text size="sm" className="text-gray-600">
                      {member.phone}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconMapPin size={16} className="text-gray-500" />
                    <Text size="sm" className="text-gray-600 truncate">
                      {member.address}
                    </Text>
                  </Group>
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
                src={selectedMember.image} 
                alt={selectedMember.name} 
                size={150} 
                radius={150} 
                mx="auto"
                className="mb-4"
              />
              <Title order={2} className="text-2xl font-bold text-gray-900 mb-2">
                {selectedMember.name}
              </Title>
              <Badge color="blue" variant="light" size="lg" className="mb-2">
                {selectedMember.district}
              </Badge>
              <Text size="lg" className="text-gray-600 font-medium">
                {selectedMember.position}
              </Text>
            </div>

            <Divider />

            <div>
              <Title order={4} className="text-lg font-semibold mb-3">Contact Information</Title>
              <Stack gap="sm">
                <Group gap="sm">
                  <IconMail size={18} className="text-gray-500" />
                  <Text size="sm">{selectedMember.email}</Text>
                </Group>
                <Group gap="sm">
                  <IconPhone size={18} className="text-gray-500" />
                  <Text size="sm">{selectedMember.phone}</Text>
                </Group>
                <Group gap="sm">
                  <IconMapPin size={18} className="text-gray-500" />
                  <Text size="sm">{selectedMember.address}</Text>
                </Group>
              </Stack>
            </div>

            <div>
              <Title order={4} className="text-lg font-semibold mb-3">Background</Title>
              <Text size="sm" className="text-gray-700 mb-3">
                {selectedMember.bio}
              </Text>
              <Group gap="sm">
                <IconUser size={16} className="text-gray-500" />
                <Text size="sm" className="font-medium">Education:</Text>
                <Text size="sm">{selectedMember.education}</Text>
              </Group>
            </div>

            <div>
              <Title order={4} className="text-lg font-semibold mb-3">Committee Involvement</Title>
              <Group gap="xs">
                {selectedMember.committees.map((committee: string, index: number) => (
                  <Badge key={index} color="gray" variant="light" size="sm">
                    {committee}
                  </Badge>
                ))}
              </Group>
            </div>

            <div>
              <Title order={4} className="text-lg font-semibold mb-3">Term Information</Title>
              <Group gap="sm">
                <IconCalendar size={16} className="text-gray-500" />
                <Text size="sm" className="font-medium">Term:</Text>
                <Text size="sm">{selectedMember.term}</Text>
              </Group>
            </div>
          </Stack>
        )}
      </Modal>
    </div>
  );
};

export default BoardMembers; 