import { 
  Card, 
  Text, 
  Title, 
  Container, 
  Breadcrumbs,
  Anchor,
  Tabs,
  TabsList,
  TabsTab,
  Button,
  Group,
  Alert,
  Stack
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IconDownload, IconExternalLink, IconAlertTriangle } from '@tabler/icons-react';
import HomeNavigation from '../../components/HomeNavigation';

const VendorAgreement = () => {
  const navigate = useNavigate();
  const [vendorPdfError, setVendorPdfError] = useState(false);
  const [vendorPdfLoading, setVendorPdfLoading] = useState(true);
  const [privacyPdfError, setPrivacyPdfError] = useState(false);
  const [privacyPdfLoading, setPrivacyPdfLoading] = useState(true);

  const handleVendorDownload = () => {
    const link = document.createElement('a');
    link.href = '/policies/LEAVendorAgreements.pdf';
    link.download = 'LEAVendorAgreements.pdf';
    link.target = '_blank';
    link.click();
  };

  const handleVendorOpenInNewTab = () => {
    window.open('/policies/LEAVendorAgreements.pdf', '_blank');
  };

  const handlePrivacyDownload = () => {
    const link = document.createElement('a');
    link.href = '/policies/studentprivacy-agreementsrequirementsharing.pdf';
    link.download = 'studentprivacy-agreementsrequirementsharing.pdf';
    link.target = '_blank';
    link.click();
  };

  const handlePrivacyOpenInNewTab = () => {
    window.open('/policies/studentprivacy-agreementsrequirementsharing.pdf', '_blank');
  };

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

              <Stack gap="md">
                <Group justify="flex-end">
                  <Button
                    leftSection={<IconDownload size={16} />}
                    onClick={handleVendorDownload}
                    variant="light"
                    size="sm"
                  >
                    Download PDF
                  </Button>
                  <Button
                    leftSection={<IconExternalLink size={16} />}
                    onClick={handleVendorOpenInNewTab}
                    variant="light"
                    size="sm"
                  >
                    Open in New Tab
                  </Button>
                </Group>

                {vendorPdfError ? (
                  <Alert
                    icon={<IconAlertTriangle size={16} />}
                    title="PDF Loading Issue"
                    color="yellow"
                    variant="light"
                  >
                    <Text size="sm" mb="md">
                      The PDF viewer is having trouble loading. You can:
                    </Text>
                    <Group gap="sm">
                      <Button
                        leftSection={<IconDownload size={16} />}
                        onClick={handleVendorDownload}
                        size="sm"
                      >
                        Download PDF
                      </Button>
                      <Button
                        leftSection={<IconExternalLink size={16} />}
                        onClick={handleVendorOpenInNewTab}
                        size="sm"
                        variant="light"
                      >
                        Open in New Tab
                      </Button>
                    </Group>
                  </Alert>
                ) : (
                  <div style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    height: '80vh',
                    width: '100%',
                    position: 'relative'
                  }}>
                    {vendorPdfLoading && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        <Text size="sm" c="dimmed">Loading PDF...</Text>
                      </div>
                    )}
                    <iframe
                      src="/policies/LEAVendorAgreements.pdf#toolbar=1&navpanes=1&scrollbar=1"
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                      title="Vendor Agreements PDF"
                      onError={() => {
                        console.error('Vendor PDF failed to load in iframe');
                        setVendorPdfLoading(false);
                        setVendorPdfError(true);
                      }}
                      onLoad={() => {
                        setVendorPdfLoading(false);
                      }}
                    />
                  </div>
                )}
              </Stack>
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

              <Stack gap="md">
                <Group justify="flex-end">
                  <Button
                    leftSection={<IconDownload size={16} />}
                    onClick={handlePrivacyDownload}
                    variant="light"
                    size="sm"
                  >
                    Download PDF
                  </Button>
                  <Button
                    leftSection={<IconExternalLink size={16} />}
                    onClick={handlePrivacyOpenInNewTab}
                    variant="light"
                    size="sm"
                  >
                    Open in New Tab
                  </Button>
                </Group>

                {privacyPdfError ? (
                  <Alert
                    icon={<IconAlertTriangle size={16} />}
                    title="PDF Loading Issue"
                    color="yellow"
                    variant="light"
                  >
                    <Text size="sm" mb="md">
                      The PDF viewer is having trouble loading. You can:
                    </Text>
                    <Group gap="sm">
                      <Button
                        leftSection={<IconDownload size={16} />}
                        onClick={handlePrivacyDownload}
                        size="sm"
                      >
                        Download PDF
                      </Button>
                      <Button
                        leftSection={<IconExternalLink size={16} />}
                        onClick={handlePrivacyOpenInNewTab}
                        size="sm"
                        variant="light"
                      >
                        Open in New Tab
                      </Button>
                    </Group>
                  </Alert>
                ) : (
                  <div style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    height: '80vh',
                    width: '100%',
                    position: 'relative'
                  }}>
                    {privacyPdfLoading && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        <Text size="sm" c="dimmed">Loading PDF...</Text>
                      </div>
                    )}
                    <iframe
                      src="/policies/studentprivacy-agreementsrequirementsharing.pdf#toolbar=1&navpanes=1&scrollbar=1"
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                      title="Student Privacy PDF"
                      onError={() => {
                        console.error('Privacy PDF failed to load in iframe');
                        setPrivacyPdfLoading(false);
                        setPrivacyPdfError(true);
                      }}
                      onLoad={() => {
                        setPrivacyPdfLoading(false);
                      }}
                    />
                  </div>
                )}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Container>
    </div>
  );
};

export default VendorAgreement;
