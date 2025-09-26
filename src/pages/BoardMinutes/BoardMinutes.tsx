import { useState, useEffect } from 'react';
import { 
  Card, 
  Text, 
  Group, 
  Button, 
  Stack, 
  Title, 
  Container, 
  Grid,
  Loader,
  Alert,
  FileButton,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { 
  IconFileText, 
  IconDownload, 
  IconEye, 
  IconUpload,
  IconTrash,
  IconRefresh,
  IconAlertTriangle
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import HomeNavigation from '../../components/HomeNavigation';
import { listBoardMinutesPDFs, uploadPDF, deleteFile, getSignedPDFUrl, type CloudinaryPDFInfo } from '../../services/uploadService';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';

const BOARD_MINUTES_FOLDER = 'board-minutes';

const BoardMinutes = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [pdfs, setPdfs] = useState<CloudinaryPDFInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedPdf, setSelectedPdf] = useState<CloudinaryPDFInfo | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const isAdmin = user?.email === 'utsab@wcpsb.com';
  const isAdminRoute = location.pathname === '/wc-school-board-minutes' && isAdmin;

  const loadPDFs = async () => {
    try {
      setLoading(true);
      const res = await listBoardMinutesPDFs(BOARD_MINUTES_FOLDER);
      if (res.success) {
        // Sort by creation date (newest first)
        const sortedPdfs = res.data.sort((a, b) => {
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateB.getTime() - dateA.getTime();
        });
        setPdfs(sortedPdfs);
      }
    } catch (e) {
      notifications.show({ color: 'red', title: 'Error', message: 'Failed to load board minutes' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPDFs();
  }, []);

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadPDF(file, BOARD_MINUTES_FOLDER);
      if (res.success) {
        notifications.show({ color: 'green', title: 'Uploaded', message: res.data.originalName });
        await loadPDFs();
      }
    } catch (e) {
      notifications.show({ color: 'red', title: 'Error', message: 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    try {
      await deleteFile(publicId, 'raw');
      notifications.show({ color: 'green', title: 'Deleted', message: 'Board minutes removed' });
      await loadPDFs();
    } catch (e) {
      notifications.show({ color: 'red', title: 'Error', message: 'Delete failed' });
    }
  };

  const handleViewPDF = async (pdf: CloudinaryPDFInfo) => {
    try {
      // Get signed URL for secure access
      const signedUrlResponse = await getSignedPDFUrl(pdf.public_id);
      if (signedUrlResponse.success) {
        const pdfWithSignedUrl = { ...pdf, url: signedUrlResponse.url };
        setSelectedPdf(pdfWithSignedUrl);
        setPdfModalOpen(true);
      } else {
        // Fallback to original URL
        setSelectedPdf(pdf);
        setPdfModalOpen(true);
      }
    } catch (error) {
      console.error('Error getting signed URL:', error);
      // Fallback to original URL
      setSelectedPdf(pdf);
      setPdfModalOpen(true);
    }
  };

  const handleDownloadPDF = (pdf: CloudinaryPDFInfo) => {
    const link = document.createElement('a');
    link.href = pdf.url;
    link.download = pdf.public_id.split('/').pop() || 'board-minutes.pdf';
    link.target = '_blank';
    link.click();
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFileName = (publicId: string) => {
    const parts = publicId.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.replace(/\.[^/.]+$/, ''); // Remove extension
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAdminRoute && <HomeNavigation />}
      
      <Container size="lg" className="py-8">
        {/* Header */}
        <div className="mb-8">
          <Group gap="md" align="center" className="mb-4">
            <div className="flex items-center gap-3">
              <img 
                src={(localStorage.getItem('app_logo_url') || '/logo.png')} 
                alt="West Carroll Parish School Board Logo" 
                className="w-16 h-16" 
              />
              <Title order={1} className="text-4xl font-bold text-wcpsb-blue">
                Board Meeting Minutes
              </Title>
            </div>
          </Group>
          <Text className="text-gray-600 text-lg mb-4">
            Access meeting minutes and documents from West Carroll Parish School Board meetings.
          </Text>
          
          {/* Admin Controls */}
          {isAdmin && (
            <Card withBorder shadow="sm" radius="md" p="md" className="mb-6 bg-blue-50">
              <Group justify="space-between">
                <Text fw={600} size="sm" className="text-blue-800">
                  Admin Controls
                </Text>
                <Group gap="sm">
                  <FileButton onChange={handleUpload} accept="application/pdf" disabled={uploading}>
                    {(props) => (
                      <Button 
                        leftSection={<IconUpload size={16} />} 
                        loading={uploading} 
                        size="sm"
                        {...props}
                      >
                        Upload Minutes
                      </Button>
                    )}
                  </FileButton>
                  <ActionIcon variant="light" onClick={loadPDFs} title="Refresh">
                    <IconRefresh size={18} />
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          )}
          
          {/* Disclaimer Alert */}
          <Alert 
            icon={<IconAlertTriangle size={16} />} 
            title="Important Notice" 
            color="blue" 
            variant="light"
            className="mb-6"
          >
            THE WEST CARROLL PARISH SCHOOL BOARD RESERVES THE RIGHT TO ENTER INTO EXECUTIVE SESSION, IF NEEDED, IN ACCORDANCE WITH La.R.S. 42:17
          </Alert>
        </div>

        {/* PDF List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Group gap="md">
              <Loader size="md" />
              <Text size="lg" className="text-gray-600">Loading board minutes...</Text>
            </Group>
          </div>
        ) : pdfs.length === 0 ? (
          <Card withBorder shadow="sm" radius="md" p="xl" className="text-center">
            <Stack gap="md">
              <IconFileText size={48} className="text-gray-400 mx-auto" />
              <Title order={3} className="text-gray-600">No Board Minutes Available</Title>
              <Text className="text-gray-500">
                Board meeting minutes will be posted here once they are uploaded.
              </Text>
            </Stack>
        </Card>
        ) : (
          <Grid gutter="md">
            {pdfs.map((pdf) => (
              <Grid.Col key={pdf.public_id} span={{ base: 12, sm: 6, md: 4 }}>
                <Card 
                  withBorder 
                  shadow="sm" 
                  radius="md" 
                  p="lg"
                  className="h-full hover:shadow-md transition-shadow duration-200"
                >
                  <Stack gap="md">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <IconFileText size={32} className="text-red-600" />
                      </div>
                      <Title order={4} size="h5" className="text-gray-800 text-center">
                        {getFileName(pdf.public_id)}
                      </Title>
                      <Text size="sm" className="text-gray-500">
                        {formatDate(pdf.created_at)}
                      </Text>
                    </div>

                    <div className="text-center">
                      <Text size="xs" className="text-gray-500">
                        {formatFileSize(pdf.bytes)}
                      </Text>
                    </div>

                    <Group justify="center" gap="sm">
                      <Button 
                        size="sm"
                        variant="light" 
                            leftSection={<IconEye size={14} />}
                        onClick={() => handleViewPDF(pdf)}
                          >
                            View
                          </Button>
                          <Button 
                        size="sm" 
                            variant="light" 
                            color="green" 
                            leftSection={<IconDownload size={14} />}
                        onClick={() => handleDownloadPDF(pdf)}
                          >
                            Download
                          </Button>
                      {isAdmin && (
                        <Tooltip label="Delete">
                          <ActionIcon
                            color="red" 
                            variant="light"
                            onClick={() => handleDelete(pdf.public_id)}
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                      </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>

      {/* PDF Viewer Modal */}
      {pdfModalOpen && selectedPdf && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                Board Minutes - {getFileName(selectedPdf.public_id)}
              </h2>
              <button 
                onClick={() => setPdfModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
                </div>

            {/* PDF Viewer */}
                <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Document</label>
              <div style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                overflow: 'hidden',
                height: '400px'
              }}>
                <iframe
                  src={`${selectedPdf.url}#toolbar=1&navpanes=1&scrollbar=1`}
                  width="100%"
                  height="100%"
                  title={getFileName(selectedPdf.public_id)}
                  style={{ border: 'none' }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                onClick={() => setPdfModalOpen(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
              <button 
                onClick={() => handleDownloadPDF(selectedPdf)}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#007bff',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>,
        document.body
        )}
    </div>
  );
};

export default BoardMinutes; 