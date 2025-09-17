import { Container, Title, Text, Card, Stack, Button, Group, Alert } from '@mantine/core';
import { IconDownload, IconArrowLeft, IconAlertTriangle, IconExternalLink } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import HomeNavigation from '../../components/HomeNavigation';

const WellnessPolicy = () => {
  const navigate = useNavigate();
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/policies/WELLNESSPOLICY.pdf';
    link.download = 'WELLNESSPOLICY.pdf';
    link.target = '_blank';
    link.click();
  };

  const handleOpenInNewTab = () => {
    window.open('/policies/WELLNESSPOLICY.pdf', '_blank');
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    // Don't automatically set error state on load
  };

  const handleIframeError = () => {
    console.error('PDF failed to load in iframe');
    setIsLoading(false);
    setPdfLoadError(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavigation />
      <Container size="xl" py="xl">
        <Stack gap="md" mb="xl">
          <Group>
            <Button
              variant="light"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Group>
          
          <Title order={1} size="h1" fw={700} c="dark">
            Wellness Policy
          </Title>
          
          <Text size="lg" c="dimmed">
            West Carroll Parish School Board Wellness Policy
          </Text>
        </Stack>

        <Card withBorder shadow="sm" p="lg" radius="md">
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={600} size="lg">
                Document Viewer
              </Text>
              <Group gap="sm">
                <Button
                  leftSection={<IconDownload size={16} />}
                  onClick={handleDownload}
                  variant="light"
                >
                  Download PDF
                </Button>
                <Button
                  leftSection={<IconExternalLink size={16} />}
                  onClick={handleOpenInNewTab}
                  variant="light"
                >
                  Open in New Tab
                </Button>
              </Group>
            </Group>
            
            {pdfLoadError ? (
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
                    onClick={handleDownload}
                    size="sm"
                  >
                    Download PDF
                  </Button>
                  <Button
                    leftSection={<IconExternalLink size={16} />}
                    onClick={handleOpenInNewTab}
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
                {isLoading && (
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
                  src="/policies/WELLNESSPOLICY.pdf#toolbar=1&navpanes=1&scrollbar=1"
                  width="100%"
                  height="100%"
                  title="Wellness Policy"
                  style={{ border: 'none' }}
                  onError={handleIframeError}
                  onLoad={handleIframeLoad}
                />
              </div>
            )}
            
            <Text size="sm" c="dimmed" ta="center">
              If the PDF doesn't load above, use the buttons above to download or open in a new tab.
            </Text>
          </Stack>
        </Card>
      </Container>
    </div>
  );
};

export default WellnessPolicy;
