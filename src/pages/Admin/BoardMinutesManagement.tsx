import { useEffect, useState } from 'react';
import { Button, Group, Text, FileButton, Modal, Grid, Paper, ActionIcon, Loader, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { listBoardMinutesPDFs, uploadPDF, deleteFile, getSignedPDFUrl, type CloudinaryPDFInfo } from '../../services/uploadService';
import { IconTrash, IconRefresh, IconUpload, IconFileText, IconEye, IconDownload } from '@tabler/icons-react';

const BOARD_MINUTES_FOLDER = 'board-minutes';

const BoardMinutesManagement = () => {
  const [pdfs, setPdfs] = useState<CloudinaryPDFInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedPdf, setSelectedPdf] = useState<CloudinaryPDFInfo | null>(null);

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
        window.open(signedUrlResponse.url, '_blank');
      } else {
        // Fallback to original URL
        window.open(pdf.url, '_blank');
      }
    } catch (error) {
      console.error('Error getting signed URL:', error);
      // Fallback to original URL
      window.open(pdf.url, '_blank');
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
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileName = (publicId: string) => {
    const parts = publicId.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.replace(/\.[^/.]+$/, ''); // Remove extension
  };

  return (
    <div className="p-4 md:p-6">
      <Group justify="space-between" mb="md">
        <Text fw={700} size="xl">Board Minutes Management</Text>
        <Group>
          <FileButton onChange={handleUpload} accept="application/pdf" disabled={uploading}>
            {(props) => (
              <Button leftSection={<IconUpload size={16} />} loading={uploading} {...props}>Upload Minutes</Button>
            )}
          </FileButton>
          <ActionIcon variant="light" onClick={loadPDFs} title="Refresh">
            <IconRefresh size={18} />
          </ActionIcon>
        </Group>
      </Group>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600"><Loader size="sm" /> Loading…</div>
      ) : pdfs.length === 0 ? (
        <Paper withBorder p="lg" className="text-center text-gray-600">No board minutes yet.</Paper>
      ) : (
        <Grid gutter="md">
          {pdfs.map((pdf) => (
            <Grid.Col key={pdf.public_id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <Paper withBorder p="sm" className="flex flex-col gap-2">
                <div className="w-full h-32 bg-red-50 rounded flex items-center justify-center mb-2">
                  <IconFileText size={48} className="text-red-600" />
                </div>
                <Text size="sm" fw={500} className="truncate">{getFileName(pdf.public_id)}</Text>
                <Text size="xs" c="dimmed">{formatDate(pdf.created_at)}</Text>
                <Text size="xs" c="dimmed">{formatFileSize(pdf.bytes)}</Text>
                <Group justify="apart">
                  <Tooltip label="View PDF">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      onClick={() => handleViewPDF(pdf)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                  </Tooltip>
                  
                  <Tooltip label="Download">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      onClick={() => handleDownloadPDF(pdf)}
                      className="text-green-600 hover:bg-green-50"
                    >
                      <IconDownload size={16} />
                    </ActionIcon>
                  </Tooltip>
                  
                  <Tooltip label="Delete">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      onClick={() => handleDelete(pdf.public_id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default BoardMinutesManagement;
