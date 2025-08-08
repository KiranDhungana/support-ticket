import { useState } from 'react';
import { 
  Card, 
  Text, 
  Group, 
  Button, 
  Container, 
  Title, 
  Grid,
  Badge,
  Stack,
  Breadcrumbs,
  Anchor,
  Divider
} from '@mantine/core';
import { 
  IconMail, 
  IconMapPin,
  IconPhone,
  IconArrowRight
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import HomeNavigation from '../../components/HomeNavigation';

// Schools data with contact information
const schoolsData = [
  {
    id: 1,
    name: 'Oak Grove High School',
    type: 'High School',
    location: 'Oak Grove',
    address: '1234 Oak Grove Road, Oak Grove, LA 71263',
    phone: '318-428-5001',
    email: 'jwait@wcpsb.com',
    description: 'Oak Grove High School provides comprehensive education for grades 9-12, preparing students for college and career success.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
    features: ['College Prep', 'Career & Technical Education', 'Athletics', 'Fine Arts']
  },
  {
    id: 2,
    name: 'Oak Grove Elementary School',
    type: 'Elementary',
    location: 'Oak Grove',
    address: '5678 Elementary Drive, Oak Grove, LA 71263',
    phone: '318-428-5002',
    email: 'jwarner@wcpsb.com',
    description: 'Oak Grove Elementary School serves students in grades K-5, fostering a love of learning and academic excellence.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    features: ['Early Childhood Education', 'Reading Programs', 'STEM Activities', 'Parent Involvement']
  },
  {
    id: 3,
    name: 'Forest High School',
    type: 'High School',
    location: 'Forest',
    address: '910 Forest Avenue, Forest, LA 71263',
    phone: '318-428-5003',
    email: 'lisasmith@wcpsb.com',
    description: 'Forest High School offers a rigorous academic curriculum with diverse extracurricular opportunities for students.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=400&h=300&fit=crop',
    features: ['Advanced Placement', 'Dual Enrollment', 'Sports Programs', 'Student Leadership']
  }
];

const Schools = () => {
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState<typeof schoolsData[0] | null>(null);

  const handleSchoolClick = (school: typeof schoolsData[0]) => {
    setSelectedSchool(school);
  };

  const handleContactClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title: 'Schools', href: '#' }
  ].map((item, index) => (
    <Anchor href={item.href} key={index} onClick={(e) => { e.preventDefault(); navigate(item.href); }}>
      {item.title}
    </Anchor>
  ));

  const getSchoolTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'high school':
        return 'blue';
      case 'elementary':
        return 'green';
      case 'middle':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />
      
      <Container size="xl" py="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs className="mb-6">
          {breadcrumbItems}
        </Breadcrumbs>

        {/* Page Header */}
        <div className="text-center mb-8">
          <Title order={1} className="text-4xl font-bold text-gray-900 mb-4">
            Our Schools
          </Title>
          <Text size="lg" className="text-gray-600 max-w-2xl mx-auto">
            Discover the exceptional educational opportunities available at West Carroll Parish School Board's schools.
          </Text>
        </div>

        {/* Schools Grid */}
        <Grid gutter="lg">
          {schoolsData.map((school) => (
            <Grid.Col key={school.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <Card 
                shadow="sm" 
                padding="lg" 
                radius="md" 
                withBorder 
                className="h-full hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSchoolClick(school)}
              >
                <div className="text-center mb-4">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={school.image} 
                      alt={school.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLElement;
                        target.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'flex';
                        }
                      }}
                    />
                    <div 
                      className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold"
                      style={{ display: 'none' }}
                    >
                      {school.name.split(' ').map(word => word[0]).join('')}
                    </div>
                  </div>
                  
                  <Title order={3} className="text-xl font-bold text-gray-900 mb-2">
                    {school.name}
                  </Title>
                  
                  <Badge 
                    color={getSchoolTypeColor(school.type)} 
                    variant="light" 
                    size="sm" 
                    className="mb-2"
                  >
                    {school.type}
                  </Badge>
                  
                  <Text size="sm" className="text-gray-600 mb-4">
                    {school.location}
                  </Text>
                </div>

                <Divider className="my-4" />

                <Stack gap="sm" className="mb-4">
                  <Group gap="xs">
                    <IconMapPin size={16} className="text-gray-500" />
                    <Text size="sm" className="text-gray-600 truncate">
                      {school.address}
                    </Text>
                  </Group>
                  
                  <Group gap="xs">
                    <IconPhone size={16} className="text-gray-500" />
                    <Text size="sm" className="text-gray-600">
                      {school.phone}
                    </Text>
                  </Group>
                  
                  <Group gap="xs">
                    <IconMail size={16} className="text-gray-500" />
                    <Text size="sm" className="text-gray-600 truncate">
                      {school.email}
                    </Text>
                  </Group>
                </Stack>

                <Button 
                  fullWidth
                  variant="light" 
                  color="blue"
                  leftSection={<IconArrowRight size={16} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContactClick(school.email);
                  }}
                >
                  Contact School
                </Button>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* School Detail Modal */}
        {selectedSchool && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <Title order={2} className="text-2xl font-bold text-gray-900">
                  {selectedSchool.name}
                </Title>
                <Button
                  variant="subtle"
                  onClick={() => setSelectedSchool(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                {/* School Image */}
                <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={selectedSchool.image} 
                    alt={selectedSchool.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* School Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Badge 
                      color={getSchoolTypeColor(selectedSchool.type)} 
                      variant="light" 
                      size="lg" 
                      className="mb-2"
                    >
                      {selectedSchool.type}
                    </Badge>
                    <Text size="lg" className="text-gray-600">
                      {selectedSchool.description}
                    </Text>
                  </div>
                  
                  <div>
                    <Title order={4} className="text-lg font-semibold mb-3">Contact Information</Title>
                    <Stack gap="sm">
                      <Group gap="sm">
                        <IconMapPin size={18} className="text-gray-500" />
                        <Text size="sm">{selectedSchool.address}</Text>
                      </Group>
                      <Group gap="sm">
                        <IconPhone size={18} className="text-gray-500" />
                        <Text size="sm">{selectedSchool.phone}</Text>
                      </Group>
                      <Group gap="sm">
                        <IconMail size={18} className="text-gray-500" />
                        <Text size="sm">{selectedSchool.email}</Text>
                      </Group>
                    </Stack>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <Title order={4} className="text-lg font-semibold mb-3">Key Features</Title>
                  <div className="flex flex-wrap gap-2">
                    {selectedSchool.features.map((feature, index) => (
                      <Badge key={index} color="blue" variant="light">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact Button */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    fullWidth
                    color="blue"
                    leftSection={<IconMail size={16} />}
                    onClick={() => handleContactClick(selectedSchool.email)}
                  >
                    Contact School
                  </Button>
                  <Button 
                    fullWidth
                    variant="light"
                    onClick={() => setSelectedSchool(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Schools;
