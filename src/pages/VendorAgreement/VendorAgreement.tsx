import { 
  Card, 
  Text, 
  Title, 
  Container, 
  Breadcrumbs,
  Anchor,
  Tabs,
  TabsList,
  TabsTab
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import HomeNavigation from '../../components/HomeNavigation';

const VendorAgreement = () => {
  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title: 'Vendor Agreement', href: '#' }
  ].map((item, index) => (
    <Anchor href={item.href} key={index} onClick={(e) => { e.preventDefault(); navigate(item.href); }}>
      {item.title}
    </Anchor>
  ));

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />
      
      <Container size="xl" className="py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs className="mb-6">
          {breadcrumbItems}
        </Breadcrumbs>

        {/* Page Header */}
        <div className="mb-8">
          <Title order={1} className="text-4xl font-bold text-gray-900 mb-4">
            Vendor Agreements & Student Privacy
          </Title>
          <Text className="text-gray-600">
            State and Local Vendor Agreements along with Student Privacy Requirements
          </Text>
        </div>

        {/* PDF Viewer with Tabs */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Tabs defaultValue="vendor-agreements">
            <TabsList className="mb-6">
              <TabsTab value="vendor-agreements">LEA Vendor Agreements</TabsTab>
              <TabsTab value="student-privacy">Student Privacy Agreements</TabsTab>
            </TabsList>

            <Tabs.Panel value="vendor-agreements">
              <div className="mb-6">
                <Title order={2} className="text-2xl font-bold text-gray-900 mb-2">
                  LEA Vendor Agreements
                </Title>
                <Text className="text-gray-600">
                  View the complete vendor agreement document
                </Text>
              </div>

              <div className="w-full h-screen">
                <iframe
                  src="/policies/LEA Vendor Agreements.pdf"
                  width="100%"
                  height="100%"
                  style={{ border: 'none', minHeight: '600px' }}
                  title="Vendor Agreements PDF"
                />
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="student-privacy">
              <div className="mb-6">
                <Title order={2} className="text-2xl font-bold text-gray-900 mb-2">
                  Student Privacy Agreements
                </Title>
                <Text className="text-gray-600">
                  View the complete student privacy agreement document
                </Text>
              </div>

              <div className="w-full h-screen">
                <iframe
                  src="/policies/studentprivacy-agreementsrequirementsharing.pdf"
                  width="100%"
                  height="100%"
                  style={{ border: 'none', minHeight: '600px' }}
                  title="Student Privacy PDF"
                />
              </div>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Container>
    </div>
  );
};

export default VendorAgreement;
