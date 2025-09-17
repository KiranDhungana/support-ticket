import { Container, Title, Text, Card, Grid, Group, Stack, Divider } from '@mantine/core';
import { IconPhone, IconMail, IconMapPin } from '@tabler/icons-react';
import HomeNavigation from '../../components/HomeNavigation';

const WCSchoolBoard = () => {
  const boardMembers = [
    {
      district: 1,
      name: "Johnny Smith",
      phone: "(318) 355-4114",
      email: "jwpas1973@gmail.com",
      address: "P.O. Box 567, Epps, LA 71237"
    },
    {
      district: 2,
      name: "Charles Townsend",
      phone: "(318) 282-8997",
      email: "cstownsend53@outlook.com",
      address: "2594 Highway 2 West, Oak Grove, LA 71263"
    },
    {
      district: 3,
      name: "Todd Smith",
      phone: "(318) 282-4199 / (318) 418-5302",
      email: "toddsmith@wcpsb.com",
      address: "250 Tackett Road, Oak Grove, LA 71263"
    },
    {
      district: 4,
      name: "Shane Ray",
      phone: "(318) 732-7588",
      email: "shane.ray@simplot.com",
      address: "407 Macon Front Rd, Oak Grove, LA 71263"
    },
    {
      district: 5,
      name: "Laura Beth Perkins",
      phone: "(318) 669-0901",
      email: "lbperkinspharmd@aol.com",
      address: "1844 Chickasaw Loop, Oak Grove, LA 71263"
    },
    {
      district: 6,
      name: "Kent Davis",
      phone: "(318) 418-1383",
      email: "davisroger1945@gmail.com",
      address: "P.O. Box 335, Oak Grove, LA 71263"
    },
    {
      district: 7,
      name: "Deborah Allen",
      phone: "(318) 669-9218",
      email: "deballen2@hotmail.com",
      address: "PO Box 382, Kilbourne, LA 71253"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />
      <Container size="xl" py="xl">
        <Stack gap="xl">
          <div className="text-center">
            <Title order={1} size="h1" className="text-wcpsb-blue mb-4">
              West Carroll Parish School Board
            </Title>
            <Text size="lg" c="dimmed" className="max-w-2xl mx-auto">
              Meet the dedicated members of our school board who work tirelessly to ensure quality education for our community.
            </Text>
          </div>

          <Grid gutter="lg">
            {boardMembers.map((member) => (
              <Grid.Col key={member.district} span={{ base: 12, sm: 6, md: 4 }}>
                <Card 
                  withBorder 
                  shadow="sm" 
                  radius="md" 
                  p="lg"
                  className="h-full hover:shadow-md transition-shadow duration-200"
                >
                  <Stack gap="md">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-wcpsb-blue rounded-full flex items-center justify-center mx-auto mb-3">
                        <Text size="xl" fw={700} c="white">
                          {member.district}
                        </Text>
                      </div>
                      <Title order={3} size="h4" className="text-wcpsb-blue">
                        District {member.district}
                      </Title>
                      <Text size="lg" fw={600} className="text-gray-800">
                        {member.name}
                      </Text>
                    </div>

                    <Divider />

                    <Stack gap="sm">
                      <Group gap="sm">
                        <IconPhone size={16} className="text-gray-500" />
                        <Text size="sm" className="text-gray-700">
                          {member.phone}
                        </Text>
                      </Group>

                      <Group gap="sm">
                        <IconMail size={16} className="text-gray-500" />
                        <Text size="sm" className="text-gray-700 break-all">
                          {member.email}
                        </Text>
                      </Group>

                      <Group gap="sm" align="flex-start">
                        <IconMapPin size={16} className="text-gray-500 mt-0.5" />
                        <Text size="sm" className="text-gray-700">
                          {member.address}
                        </Text>
                      </Group>
                    </Stack>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>

          <Card withBorder shadow="sm" radius="md" p="lg" className="bg-white">
            <Stack gap="md">
              <Title order={3} className="text-wcpsb-blue">
                About the School Board
              </Title>
              <Text size="sm" className="text-gray-700 leading-relaxed">
                The West Carroll Parish School Board consists of seven elected members, each representing a specific district within our parish. 
                These dedicated individuals work collaboratively to establish policies, oversee the district's operations, and ensure that every 
                student receives a quality education that prepares them for success in life.
              </Text>
              <Text size="sm" className="text-gray-700 leading-relaxed">
                Board members serve staggered terms and are committed to transparency, accountability, and the best interests of our students, 
                families, and community. Regular board meetings are held monthly and are open to the public.
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </div>
  );
};

export default WCSchoolBoard;
