import { Container, Title, Text, Grid, Card, Table, Anchor, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import HomeNavigation from '../../components/HomeNavigation';

const LunchAndBreakfast = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />
      <Container size="xl" py="xl">
        <Grid gutter="xl">
          {/* Main Content */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="xl">
              <Title order={1} size="h1" fw={700} c="dark">
                Lunch and Breakfast
              </Title>
              
              <Text size="lg" c="dimmed" lh={1.6}>
                Breakfast and Lunch are provided daily for students. Prices are based on students ability to pay. 
                You should have received forms to fill out assessing your family's income. If not then contact 
                your school to request appropriate forms.
              </Text>

              <Card withBorder shadow="sm" p="lg" radius="md">
                <Title order={3} size="h3" fw={600} mb="md">
                  Prices:
                </Title>
                
                <Stack gap="md">
                  <div>
                    <Text fw={600} size="sm" mb="sm" c="dark">
                      Student Prices
                    </Text>
                    <Table striped highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Meal</Table.Th>
                          <Table.Th>Full Price</Table.Th>
                          <Table.Th>Reduced Price</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        <Table.Tr>
                          <Table.Td>Breakfast</Table.Td>
                          <Table.Td>$0.75</Table.Td>
                          <Table.Td>$0.35</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Td>Lunch</Table.Td>
                          <Table.Td>$1.50</Table.Td>
                          <Table.Td>$0.40</Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    </Table>
                  </div>

                  <div>
                    <Text fw={600} size="sm" mb="sm" c="dark">
                      Other Prices
                    </Text>
                    <Table striped highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Meal</Table.Th>
                          <Table.Th>Employee</Table.Th>
                          <Table.Th>Visitor</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        <Table.Tr>
                          <Table.Td>Breakfast</Table.Td>
                          <Table.Td>$2.00</Table.Td>
                          <Table.Td>$3.00</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Td>Lunch</Table.Td>
                          <Table.Td>$3.75</Table.Td>
                          <Table.Td>$5.00</Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    </Table>
                  </div>
                </Stack>
              </Card>

              <Card withBorder shadow="sm" p="md" radius="md" bg="yellow.0">
                <Text size="sm" c="orange" fw={500}>
                  <strong>Disclaimer:</strong> The Lunch and Breakfast Menu is subject to change.
                </Text>
              </Card>
            </Stack>
          </Grid.Col>

          {/* Sidebar */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder shadow="sm" p="lg" radius="md" bg="white">
              <Stack gap="md">
                <Title order={3} size="h3" fw={700} c="dark">
                  Resources
                </Title>
                
                <Stack gap="sm">
                  <Text 
                    size="md" 
                    c="blue"
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                    className="hover:underline"
                    onClick={() => navigate('/wellness-policy')}
                  >
                    Wellness Policy
                  </Text>
                  
                  <Text 
                    size="md" 
                    c="blue"
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                    className="hover:underline"
                    onClick={() => navigate('/non-discrimination-policy')}
                  >
                    Non Discrimination Policy
                  </Text>
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};

export default LunchAndBreakfast;
