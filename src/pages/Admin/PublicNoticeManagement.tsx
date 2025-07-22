import { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Title, 
  Button, 
  Group, 
  Text, 
  Stack, 
  Card, 
  Badge, 
  ActionIcon, 
  Tooltip,
  Grid,
  Divider,
  LoadingOverlay
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createPortal } from 'react-dom';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconEye, 
  IconFileText,
  IconCalendar,
  IconUser,
  IconDownload
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import API from '../../services/api';
import MediaUpload from '../../components/MediaUpload';

interface PublicNotice {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
  pdfUrl: string;
  fileSize: string;
  imageUrl?: string;
  publicId?: string;
}

const PublicNoticeManagement = () => {
  const [notices, setNotices] = useState<PublicNotice[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingNotice, setEditingNotice] = useState<PublicNotice | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    author: '',
    pdfUrl: '',
    fileSize: '',
    imageUrl: '',
    publicId: ''
  });

  const categories = [
    'Policy',
    'Safety',
    'Administration',
    'Health',
    'Report',
    'Program',
    'Compliance',
    'Assessment'
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Policy': 'blue',
      'Safety': 'red',
      'Administration': 'gray',
      'Health': 'green',
      'Report': 'purple',
      'Program': 'orange',
      'Compliance': 'yellow',
      'Assessment': 'cyan'
    };
    return colors[category] || 'gray';
  };

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await API.get('/public-notices');
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch public notices',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (editingNotice) {
        await API.put(`/public-notices/${editingNotice.id}`, formData);
        notifications.show({
          title: 'Success',
          message: 'Public notice updated successfully',
          color: 'green'
        });
      } else {
        await API.post('/public-notices', formData);
        notifications.show({
          title: 'Success',
          message: 'Public notice created successfully',
          color: 'green'
        });
      }
      
      close();
      setEditingNotice(null);
      resetForm();
      fetchNotices();
    } catch (error) {
      console.error('Error saving notice:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to save public notice',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (notice: PublicNotice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      description: notice.description,
      category: notice.category,
      author: notice.author,
      pdfUrl: notice.pdfUrl,
      fileSize: notice.fileSize,
      imageUrl: notice.imageUrl || '',
      publicId: notice.publicId || ''
    });
    open();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    
    try {
      setLoading(true);
      await API.delete(`/public-notices/${id}`);
      notifications.show({
        title: 'Success',
        message: 'Public notice deleted successfully',
        color: 'green'
      });
      fetchNotices();
    } catch (error) {
      console.error('Error deleting notice:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete public notice',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      author: '',
      pdfUrl: '',
      fileSize: '',
      imageUrl: '',
      publicId: ''
    });
  };

  const openCreateModal = () => {
    setEditingNotice(null);
    resetForm();
    open();
  };

  return (
    <Container size="xl" className="py-6 px-4">
      <LoadingOverlay visible={loading} />
      


      {/* Header */}
      <Paper withBorder shadow="sm" radius="lg" p="xl" mb="xl" className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <div className="p-3 bg-blue-600 rounded-xl">
              <IconFileText size={32} className="text-white" />
            </div>
            <div>
              <Title order={1} size="h2" className="text-gray-800">Public Notice Management</Title>
              <Text size="sm" c="dimmed">Create and manage public notices and announcements</Text>
            </div>
          </Group>
          <Group gap="sm">
            <Button 
              leftSection={<IconPlus size={18} />} 
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Notice
            </Button>

          </Group>
        </Group>
      </Paper>

      {/* Notices Grid */}
      <Grid gutter="lg">
        {notices.map((notice) => (
          <Grid.Col key={notice.id} span={{ base: 12, sm: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full">
              <Stack gap="md" className="h-full">
                {notice.imageUrl && (
                  <div style={{ height: '200px', overflow: 'hidden', borderRadius: '8px' }}>
                    <img 
                      src={notice.imageUrl} 
                      alt={notice.title}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }} 
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <Group justify="space-between" mb="xs">
                    <Badge color={getCategoryColor(notice.category)} variant="light">
                      {notice.category}
                    </Badge>
                    <Text size="xs" color="dimmed">
                      {notice.fileSize}
                    </Text>
                  </Group>
                  
                  <Title order={3} size="h4" mb="xs" className="text-gray-800 line-clamp-2">
                    {notice.title}
                  </Title>
                  
                  <Text size="sm" color="dimmed" lineClamp={3} mb="md">
                    {notice.description}
                  </Text>
                </div>

                <div className="space-y-2">
                  <Group gap="xs" className="text-xs text-gray-600">
                    <IconCalendar size={14} />
                    <Text size="xs">{new Date(notice.date).toLocaleDateString()}</Text>
                  </Group>
                  
                  <Group gap="xs" className="text-xs text-gray-600">
                    <IconUser size={14} />
                    <Text size="xs">{notice.author}</Text>
                  </Group>
                </div>

                <Divider />

                <Group gap="xs">
                  <Tooltip label="View PDF">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      onClick={() => window.open(notice.pdfUrl, '_blank')}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                  </Tooltip>
                  
                  <Tooltip label="Download">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = notice.pdfUrl;
                        link.download = `${notice.title}.pdf`;
                        link.click();
                      }}
                      className="text-green-600 hover:bg-green-50"
                    >
                      <IconDownload size={16} />
                    </ActionIcon>
                  </Tooltip>
                  
                  <Tooltip label="Edit">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      onClick={() => handleEdit(notice)}
                      className="text-orange-600 hover:bg-orange-50"
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                  
                  <Tooltip label="Delete">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      onClick={() => handleDelete(notice.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Create/Edit Modal with CKEditor */}
      {opened && createPortal(
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            minWidth: '600px',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
                {editingNotice ? 'Edit Public Notice' : 'Add New Public Notice'}
              </h2>
              <button 
                onClick={close}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Title *</label>
                <input
                  type="text"
                  placeholder="Enter notice title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Author *</label>
                <input
                  type="text"
                  placeholder="Enter author name"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Upload Media Files</label>
                <MediaUpload
                  onUploadComplete={(files) => {
                    const pdfFile = files.find(f => f.type === 'pdf');
                    const imageFile = files.find(f => f.type === 'image');
                    
                    setFormData({
                      ...formData,
                      pdfUrl: pdfFile?.url || formData.pdfUrl,
                      fileSize: pdfFile?.size || formData.fileSize,
                      publicId: pdfFile?.public_id || formData.publicId,
                      imageUrl: imageFile?.url || formData.imageUrl
                    });
                  }}
                  contentType="notices"
                  maxFiles={3}
                  label="Upload PDF & Images"
                  description="Upload PDF documents and images for this notice"
                  showPreview={true}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Description *</label>
                <div style={{ border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                  <textarea
                    placeholder="Enter notice description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{
                      width: '100%',
                      minHeight: '150px',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button 
                  onClick={close}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={!formData.title || !formData.category || !formData.author || !formData.pdfUrl}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    background: (!formData.title || !formData.category || !formData.author || !formData.pdfUrl) ? '#ccc' : '#007bff',
                    color: 'white',
                    cursor: (!formData.title || !formData.category || !formData.author || !formData.pdfUrl) ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {editingNotice ? 'Update Notice' : 'Create Notice'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </Container>
  );
};

export default PublicNoticeManagement; 