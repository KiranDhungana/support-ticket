import { Container, Title, Text, Card, Stack, List, ThemeIcon } from '@mantine/core';
import { IconCheck, IconHeart, IconUsers, IconTarget, IconShield, IconStar } from '@tabler/icons-react';
import HomeNavigation from '../../components/HomeNavigation';

const VisionStatement = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />
      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* Header */}
          <div className="text-center">
            <Title order={1} size="h1" className="text-wcpsb-blue mb-4">
              Vision Statement
            </Title>
            <Text size="lg" c="dimmed" className="max-w-3xl mx-auto">
              Our commitment to providing quality education and fostering student success
            </Text>
          </div>

          {/* Main Vision Statement */}
          <Card withBorder shadow="sm" radius="md" p="xl" className="bg-white">
            <Stack gap="lg">
              <Title order={2} size="h2" className="text-wcpsb-blue">
                Vision Statement
              </Title>
              
              <Text size="md" className="text-gray-700 leading-relaxed">
                The vision of West Carroll Parish schools is to provide a safe, positive school climate in which all students—regardless of their ability levels and ethnicity—are engaged in learning so that, when they leave our schools, they will have acquired and can ably demonstrate:
              </Text>

              <List
                spacing="md"
                size="md"
                center
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <IconCheck size={16} />
                  </ThemeIcon>
                }
                className="text-gray-700"
              >
                <List.Item>
                  <Text size="md" className="text-gray-700">
                    A healthy self image and self confidence gained through developmentally appropriate activities and challenges
                  </Text>
                </List.Item>
                <List.Item>
                  <Text size="md" className="text-gray-700">
                    Strategies that enable them to operate as resourceful and responsible problem solvers, both independently and cooperatively
                  </Text>
                </List.Item>
                <List.Item>
                  <Text size="md" className="text-gray-700">
                    Tolerance, respect, and acceptance for the diversity in our society and the differences in others
                  </Text>
                </List.Item>
                <List.Item>
                  <Text size="md" className="text-gray-700">
                    The ability to apply a strong foundation of knowledge and communications skills to meet the demands of a rapidly changing world
                  </Text>
                </List.Item>
              </List>
            </Stack>
          </Card>

          {/* Vision Statement in Practice */}
          <Card withBorder shadow="sm" radius="md" p="xl" className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <Stack gap="lg">
              <div className="flex items-center gap-3">
                <ThemeIcon color="blue" size={40} radius="xl">
                  <IconTarget size={24} />
                </ThemeIcon>
                <Title order={2} size="h2" className="text-wcpsb-blue">
                  Vision Statement in Practice
                </Title>
              </div>
              
              <Text size="md" className="text-gray-700 leading-relaxed mb-4">
                Our commitment to excellence is reflected in our daily practices and interactions:
              </Text>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <ThemeIcon color="green" size={32} radius="xl">
                    <IconHeart size={18} />
                  </ThemeIcon>
                  <Text size="sm" className="text-gray-700">
                    Acknowledge that children are our greatest natural resources
                  </Text>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <ThemeIcon color="blue" size={32} radius="xl">
                    <IconUsers size={18} />
                  </ThemeIcon>
                  <Text size="sm" className="text-gray-700">
                    Treat all students, colleagues, and parents with respect and dignity
                  </Text>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <ThemeIcon color="purple" size={32} radius="xl">
                    <IconUsers size={18} />
                  </ThemeIcon>
                  <Text size="sm" className="text-gray-700">
                    Work cooperatively with fellow educators, staff members, and parents to establish a positive school culture with a focus on instruction and student achievement
                  </Text>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <ThemeIcon color="orange" size={32} radius="xl">
                    <IconShield size={18} />
                  </ThemeIcon>
                  <Text size="sm" className="text-gray-700">
                    Model and promote the qualities of good citizenship, honesty, character, integrity, leadership, fairness, and responsibility
                  </Text>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <ThemeIcon color="teal" size={32} radius="xl">
                    <IconStar size={18} />
                  </ThemeIcon>
                  <Text size="sm" className="text-gray-700">
                    Motivate and encourage students and others to reach their potential
                  </Text>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <ThemeIcon color="red" size={32} radius="xl">
                    <IconTarget size={18} />
                  </ThemeIcon>
                  <Text size="sm" className="text-gray-700">
                    Prepare all students to meet the challenges of real life
                  </Text>
                </div>
              </div>
            </Stack>
          </Card>

          {/* Call to Action */}
          <Card withBorder shadow="sm" radius="md" p="xl" className="bg-wcpsb-blue text-white text-center">
            <Stack gap="md">
              <Title order={3} size="h3" className="text-white">
                Join Us in Our Mission
              </Title>
              <Text size="md" className="text-blue-100 max-w-2xl mx-auto">
                Together, we can create an environment where every student thrives and reaches their full potential. 
                Our vision guides everything we do, from classroom instruction to community engagement.
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </div>
  );
};

export default VisionStatement;
