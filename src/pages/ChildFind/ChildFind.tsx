import { Container, Title, Text, Card, Stack } from '@mantine/core';
import HomeNavigation from '../../components/HomeNavigation';

const ChildFind = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />
      <Container size="xl" py="xl">
        <Card withBorder shadow="sm" p="xl" radius="md">
          <Stack gap="md">
            <Title order={1} size="h1" fw={700} c="dark">Child Find</Title>

            <Text size="md" c="dimmed" lh={1.8}>
              Child Find is a free service for referral and information for the West Carroll Parish School System children and their families. It is crucial to recognize that each child develops at their own pace, and some may face challenges that hinder their academic performance. Child Find offers valuable support for children experiencing learning difficulties, including issues related to social interaction, speech, vision, hearing, and motor skills. Additionally, it provides programs for those who exhibit high academic and intellectual potential.
            </Text>

            <Text size="md" c="dimmed" lh={1.8}>
              These services cater to children from birth up to 21 years of age, ensuring that families have access to the necessary resources and assistance. If you have any concerns regarding your child’s development or believe they may benefit from these programs, you are encouraged to reach out to the Special Education Department for further information. They are dedicated to helping you address your child’s learning needs.
            </Text>

            <Stack gap={2} mt="sm">
              <Text size="md">Robin Brister - Oak Grove Elementary and Oak Grove High School, 318-428-2308 ext. 2306</Text>
              <Text size="md">Kayla Neathery - Forest High School, 318-428-3672 ext. 2309</Text>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </div>
  );
};

export default ChildFind;


