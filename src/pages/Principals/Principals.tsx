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
  Breadcrumbs,
  Select
} from '@mantine/core';
import { 
  IconSearch, 
  IconMail, 
  IconPhone, 
  IconMapPin,
  IconSchool,
  IconCalendar,
  IconUser,
  IconEye,
  IconFilter
} from '@tabler/icons-react';
import HomeNavigation from '../../components/HomeNavigation';

// Sample principals data with images
const principalsData = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    school: 'Oak Grove Elementary School',
    schoolType: 'Elementary',
    address: '1234 Oak Grove Road, Oak Grove, LA 71263',
    phone: '318-428-5001',
    email: 'sarah.johnson@wcpsb.org',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
    startDate: '2020-08-01',
    education: 'Ph.D. Educational Leadership, Louisiana Tech University',
    experience: '15 years in education',
    bio: 'Dr. Johnson has been leading Oak Grove Elementary School since 2020. She brings extensive experience in early childhood education and is passionate about creating a nurturing learning environment.',
    achievements: ['National Blue Ribbon School Award', 'Excellence in Leadership Award'],
    specialties: ['Early Childhood Education', 'Reading Intervention', 'Parent Engagement']
  },
  {
    id: 2,
    name: 'Michael Davis',
    school: 'Oak Grove High School',
    schoolType: 'High',
    address: '5678 Oak Grove Road, Oak Grove, LA 71263',
    phone: '318-428-5002',
    email: 'michael.davis@wcpsb.org',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    startDate: '2018-07-01',
    education: 'M.Ed. Educational Administration, Louisiana State University',
    experience: '12 years in education',
    bio: 'Michael Davis has been the principal at Oak Grove High School since 2018. He focuses on academic excellence and community partnerships.',
    achievements: ['Distinguished Principal Award', 'Community Partnership Excellence'],
    specialties: ['Mathematics Education', 'STEM Programs', 'Community Outreach']
  },
  {
    id: 3,
    name: 'Emily Wilson',
    school: 'Forest High School',
    schoolType: 'High',
    address: '9012 Forest Street, Forest, LA 71263',
    phone: '318-428-5003',
    email: 'emily.wilson@wcpsb.org',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    startDate: '2021-08-01',
    education: 'M.Ed. Curriculum & Instruction, University of Louisiana',
    experience: '10 years in education',
    bio: 'Emily Wilson joined Forest High School in 2021. She is dedicated to fostering creativity and critical thinking in young learners.',
    achievements: ['Innovation in Education Award', 'Teacher Support Excellence'],
    specialties: ['Arts Integration', 'Project-Based Learning', 'Teacher Development']
  }
];

const Principals = () => {
  const [selectedPrincipal, setSelectedPrincipal] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchoolType, setSelectedSchoolType] = useState('All Schools');

  const schoolTypes = ['All Schools', 'Elementary', 'Middle', 'High'];

  const filteredPrincipals = principalsData.filter(principal =>
    (principal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     principal.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
     principal.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedSchoolType === 'All Schools' || principal.schoolType === selectedSchoolType)
  );

  const handleViewPrincipal = (principal: any) => {
    setSelectedPrincipal(principal);
    setModalOpen(true);
  };

  const breadcrumbItems = [
            { title: 'West Carroll Parish School Board', href: '/' },
    { title: 'Leadership', href: '#' },
    { title: 'Principals', href: '/principals' }
  ].map((item, index) => (
    <Anchor href={item.href} key={index} size="sm">
      {item.title}
    </Anchor>
  ));

  const getSchoolTypeColor = (type: string) => {
    switch (type) {
      case 'Elementary': return 'blue';
      case 'Middle': return 'blue';
      case 'High': return 'yellow';
      default: return 'gray';
    }
  };

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
                src="/Logo.png" 
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
                Principals
              </Title>
            </div>
          </Group>
          <Text className="text-gray-600 text-lg">
            Meet the dedicated principals who lead our schools and inspire excellence in education across West Carroll Parish.
          </Text>
        </div>

        {/* Search and Filter Section */}
        <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              placeholder="Search by name, school, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftSection={<IconSearch size={16} />}
              size="md"
            />
            <Select
              placeholder="School Type"
              value={selectedSchoolType}
              onChange={(value) => setSelectedSchoolType(value || 'All Schools')}
              data={schoolTypes}
              leftSection={<IconFilter size={16} />}
              size="md"
            />
          </div>
        </Card>

        {/* Principals Grid */}
        <Grid gutter="lg">
          {filteredPrincipals.map((principal) => (
            <Grid.Col key={principal.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full hover:shadow-md transition-shadow">
                <div className="text-center mb-4">
                  <Avatar 
                    src={principal.image} 
                    alt={principal.name} 
                    size={120} 
                    radius={120} 
                    mx="auto"
                    className="mb-3"
                  />
                  <Title order={3} className="text-xl font-bold text-gray-900 mb-1">
                    {principal.name}
                  </Title>
                  <Badge 
                    color={getSchoolTypeColor(principal.schoolType)} 
                    variant="light" 
                    size="sm" 
                    className="mb-2"
                  >
                    {principal.schoolType}
                  </Badge>
                  <Text size="sm" className="text-gray-600 font-medium">
                    {principal.school}
                  </Text>
                </div>

                <Divider className="my-4" />

                <Stack gap="xs" className="mb-4">
                  <Group gap="xs">
                    <IconSchool size={16} className="text-gray-500" />
                    <Text size="sm" className="text-gray-600 truncate">
                      {principal.school}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconMail size={16} className="text-gray-500" />
                    <Text size="sm" className="text-gray-600 truncate">
                      {principal.email}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconPhone size={16} className="text-gray-500" />
                    <Text size="sm" className="text-gray-600">
                      {principal.phone}
                    </Text>
                  </Group>
                </Stack>

                <Button 
                  fullWidth 
                  variant="light" 
                  color="blue"
                  leftSection={<IconEye size={16} />}
                  onClick={() => handleViewPrincipal(principal)}
                >
                  View Details
                </Button>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {filteredPrincipals.length === 0 && (
          <Card shadow="sm" padding="xl" radius="md" withBorder className="text-center">
            <Text size="lg" className="text-gray-500">
              No principals found matching your search criteria.
            </Text>
          </Card>
        )}
      </Container>

      {/* Principal Detail Modal */}
      <Modal 
        opened={modalOpen} 
        onClose={() => setModalOpen(false)} 
        size="lg"
        title="Principal Details"
      >
        {selectedPrincipal && (
          <Stack gap="lg">
            <div className="text-center">
              <Avatar 
                src={selectedPrincipal.image} 
                alt={selectedPrincipal.name} 
                size={150} 
                radius={150} 
                mx="auto"
                className="mb-4"
              />
              <Title order={2} className="text-2xl font-bold text-gray-900 mb-2">
                {selectedPrincipal.name}
              </Title>
              <Badge 
                color={getSchoolTypeColor(selectedPrincipal.schoolType)} 
                variant="light" 
                size="lg" 
                className="mb-2"
              >
                {selectedPrincipal.schoolType}
              </Badge>
              <Text size="lg" className="text-gray-600 font-medium">
                {selectedPrincipal.school}
              </Text>
            </div>

            <Divider />

            <div>
              <Title order={4} className="text-lg font-semibold mb-3">Contact Information</Title>
              <Stack gap="sm">
                <Group gap="sm">
                  <IconSchool size={18} className="text-gray-500" />
                  <Text size="sm" className="font-medium">School:</Text>
                  <Text size="sm">{selectedPrincipal.school}</Text>
                </Group>
                <Group gap="sm">
                  <IconMapPin size={18} className="text-gray-500" />
                  <Text size="sm" className="font-medium">Address:</Text>
                  <Text size="sm">{selectedPrincipal.address}</Text>
                </Group>
                <Group gap="sm">
                  <IconMail size={18} className="text-gray-500" />
                  <Text size="sm" className="font-medium">Email:</Text>
                  <Text size="sm">{selectedPrincipal.email}</Text>
                </Group>
                <Group gap="sm">
                  <IconPhone size={18} className="text-gray-500" />
                  <Text size="sm" className="font-medium">Phone:</Text>
                  <Text size="sm">{selectedPrincipal.phone}</Text>
                </Group>
              </Stack>
            </div>

            <div>
              <Title order={4} className="text-lg font-semibold mb-3">Background</Title>
              <Text size="sm" className="text-gray-700 mb-3">
                {selectedPrincipal.bio}
              </Text>
              <Group gap="sm">
                <IconUser size={16} className="text-gray-500" />
                <Text size="sm" className="font-medium">Education:</Text>
                <Text size="sm">{selectedPrincipal.education}</Text>
              </Group>
              <Group gap="sm">
                <IconCalendar size={16} className="text-gray-500" />
                <Text size="sm" className="font-medium">Experience:</Text>
                <Text size="sm">{selectedPrincipal.experience}</Text>
              </Group>
              <Group gap="sm">
                <IconCalendar size={16} className="text-gray-500" />
                <Text size="sm" className="font-medium">Started:</Text>
                <Text size="sm">{new Date(selectedPrincipal.startDate).toLocaleDateString()}</Text>
              </Group>
            </div>

            <div>
              <Title order={4} className="text-lg font-semibold mb-3">Specialties</Title>
              <Group gap="xs">
                {selectedPrincipal.specialties.map((specialty: string, index: number) => (
                  <Badge key={index} color="blue" variant="light" size="sm">
                    {specialty}
                  </Badge>
                ))}
              </Group>
            </div>

            <div>
              <Title order={4} className="text-lg font-semibold mb-3">Achievements</Title>
              <Stack gap="xs">
                {selectedPrincipal.achievements.map((achievement: string, index: number) => (
                  <Text key={index} size="sm" className="text-gray-700">
                    • {achievement}
                  </Text>
                ))}
              </Stack>
            </div>
          </Stack>
        )}
      </Modal>
    </div>
  );
};

export default Principals; 