import { useState, useRef } from 'react';
import { 
  Button, 
  Group, 
  Text, 
  Stack, 
  Card, 
  ActionIcon, 
  Progress,
  Badge,
  Tooltip,
  Tabs,
  Box,
  Image,
  Anchor
} from '@mantine/core';
import { 
  IconUpload, 
  IconX, 
  IconFile, 
  IconPhoto, 
  IconFileText,
  IconCheck,
  IconAlertCircle,
  IconEye,
  IconDownload
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { 
  uploadImage, 
  uploadPDF, 
  validateImageFile, 
  validatePDFFile,
  formatFileSize 
} from '../services/uploadService';

interface MediaFile {
  url: string;
  public_id: string;
  format: string;
  size: string;
  originalName: string;
  type: 'image' | 'pdf';
}

interface MediaUploadProps {
  onUploadComplete: (files: MediaFile[]) => void;
  onUploadError?: (error: string) => void;
  contentType: 'notices' | 'news' | 'principals' | 'documents';
  maxFiles?: number;
  label?: string;
  description?: string;
  showPreview?: boolean;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  onUploadComplete,
  onUploadError,
  contentType = 'notices',
  maxFiles = 5,
  label = 'Upload Media',
  description = 'Upload images and PDFs',
  showPreview = true
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFolderName = () => {
    switch (contentType) {
      case 'notices': return 'notices';
      case 'news': return 'news';
      case 'principals': return 'principals';
      case 'documents': return 'documents';
      default: return 'notices';
    }
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
      return `File size must be less than 10MB`;
    }

    if (file.type.startsWith('image/')) {
      return validateImageFile(file);
    } else if (file.type === 'application/pdf') {
      return validatePDFFile(file);
    }

    return 'Only images and PDF files are allowed';
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      notifications.show({
        title: 'Validation Error',
        message: validationError,
        color: 'red'
      });
      onUploadError?.(validationError);
      return;
    }

    const uploadingFile: UploadingFile = {
      file,
      progress: 0,
      status: 'uploading'
    };

    setUploadingFiles(prev => [...prev, uploadingFile]);

    try {
      let result;
      const folder = getFolderName();
      
      if (file.type === 'application/pdf') {
        result = await uploadPDF(file, folder);
      } else {
        result = await uploadImage(file, folder);
      }

      const mediaFile: MediaFile = {
        ...result.data,
        type: file.type === 'application/pdf' ? 'pdf' : 'image'
      };

      setUploadingFiles(prev => 
        prev.map(f => 
          f.file === file 
            ? { ...f, progress: 100, status: 'success' as const }
            : f
        )
      );

      setUploadedFiles(prev => [...prev, mediaFile]);
      onUploadComplete([...uploadedFiles, mediaFile]);
      
      notifications.show({
        title: 'Upload Successful',
        message: `${file.name} uploaded successfully`,
        color: 'green'
      });

      // Remove from uploading files after a delay
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(f => f.file !== file));
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadingFiles(prev => 
        prev.map(f => 
          f.file === file 
            ? { ...f, status: 'error' as const, error: 'Upload failed' }
            : f
        )
      );

      const errorMessage = 'Failed to upload file';
      notifications.show({
        title: 'Upload Failed',
        message: errorMessage,
        color: 'red'
      });
      onUploadError?.(errorMessage);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (uploadedFiles.length + files.length > maxFiles) {
      notifications.show({
        title: 'Too Many Files',
        message: `Maximum ${maxFiles} files allowed`,
        color: 'yellow'
      });
      return;
    }

    files.forEach(handleFileUpload);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files);
    
    if (uploadedFiles.length + files.length > maxFiles) {
      notifications.show({
        title: 'Too Many Files',
        message: `Maximum ${maxFiles} files allowed`,
        color: 'yellow'
      });
      return;
    }

    files.forEach(handleFileUpload);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const removeUploadingFile = (file: File) => {
    setUploadingFiles(prev => prev.filter(f => f.file !== file));
  };

  const removeUploadedFile = (publicId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.public_id !== publicId));
    onUploadComplete(uploadedFiles.filter(f => f.public_id !== publicId));
  };

  const getFileIcon = (file: File | MediaFile) => {
    if ('type' in file && (file as MediaFile).type) {
      return (file as MediaFile).type === 'pdf' ? <IconFileText size={20} /> : <IconPhoto size={20} />;
    }
    if ((file as File).type.startsWith('image/')) {
      return <IconPhoto size={20} />;
    } else if ((file as File).type === 'application/pdf') {
      return <IconFileText size={20} />;
    }
    return <IconFile size={20} />;
  };

  return (
    <Stack gap="md">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileSelect}
        multiple
        style={{ display: 'none' }}
      />

      <Card
        withBorder
        p="xl"
        className={`transition-all duration-200 cursor-pointer ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Stack gap="md" align="center">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <IconUpload size={32} className={isDragging ? 'text-blue-600' : 'text-gray-600'} />
          </div>
          <div className="text-center">
            <Text fw={500} size="lg">{label}</Text>
            <Text size="sm" c="dimmed">{description}</Text>
            <Text size="xs" c="dimmed" mt="xs">
              Max {maxFiles} files • 10MB each • Images & PDFs
            </Text>
          </div>
        </Stack>
      </Card>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <Stack gap="sm">
          <Text size="sm" fw={500}>Uploading Files</Text>
          {uploadingFiles.map((uploadingFile, index) => (
            <Card key={index} withBorder p="sm">
              <Group gap="sm" align="center">
                {getFileIcon(uploadingFile.file)}
                <div className="flex-1 min-w-0">
                  <Text size="sm" fw={500} truncate>
                    {uploadingFile.file.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {formatFileSize(uploadingFile.file.size)}
                  </Text>
                </div>
                <Group gap="xs">
                  {uploadingFile.status === 'uploading' && (
                    <Badge color="blue" variant="light" size="sm">
                      Uploading...
                    </Badge>
                  )}
                  {uploadingFile.status === 'success' && (
                    <Badge color="green" variant="light" size="sm" leftSection={<IconCheck size={12} />}>
                      Success
                    </Badge>
                  )}
                  {uploadingFile.status === 'error' && (
                    <Badge color="red" variant="light" size="sm" leftSection={<IconAlertCircle size={12} />}>
                      Failed
                    </Badge>
                  )}
                  <Tooltip label="Remove">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      onClick={() => removeUploadingFile(uploadingFile.file)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
              {uploadingFile.status === 'uploading' && (
                <Progress 
                  value={uploadingFile.progress} 
                  size="sm" 
                  mt="sm"
                  color="blue"
                />
              )}
            </Card>
          ))}
        </Stack>
      )}

      {/* Uploaded Files Preview */}
      {showPreview && uploadedFiles.length > 0 && (
        <Stack gap="sm">
          <Text size="sm" fw={500}>Uploaded Files</Text>
          <Tabs defaultValue="grid">
            <Tabs.List>
              <Tabs.Tab value="grid">Grid View</Tabs.Tab>
              <Tabs.Tab value="list">List View</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="grid" pt="xs">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedFiles.map((file, index) => (
                  <Card key={index} withBorder p="sm" className="relative">
                    {file.type === 'image' ? (
                      <Image
                        src={file.url}
                        alt={file.originalName}
                        height={120}
                        className="rounded-md"
                      />
                    ) : (
                      <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center">
                        <IconFileText size={32} className="text-gray-400" />
                      </div>
                    )}
                    <Text size="xs" fw={500} mt="xs" lineClamp={1}>
                      {file.originalName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {file.size}
                    </Text>
                    <Group gap="xs" mt="xs">
                      <Tooltip label="View">
                        <ActionIcon
                          variant="light"
                          size="xs"
                          onClick={() => window.open(file.url, '_blank')}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <IconEye size={12} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Download">
                        <ActionIcon
                          variant="light"
                          size="xs"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = file.url;
                            link.download = file.originalName;
                            link.click();
                          }}
                          className="text-green-600 hover:bg-green-50"
                        >
                          <IconDownload size={12} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Remove">
                        <ActionIcon
                          variant="light"
                          size="xs"
                          onClick={() => removeUploadedFile(file.public_id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <IconX size={12} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Card>
                ))}
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="list" pt="xs">
              <Stack gap="sm">
                {uploadedFiles.map((file, index) => (
                  <Card key={index} withBorder p="sm">
                    <Group gap="sm" align="center">
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <Text size="sm" fw={500} truncate>
                          {file.originalName}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {file.size} • {file.format.toUpperCase()}
                        </Text>
                      </div>
                      <Group gap="xs">
                        <Tooltip label="View">
                          <ActionIcon
                            variant="light"
                            size="sm"
                            onClick={() => window.open(file.url, '_blank')}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <IconEye size={14} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Download">
                          <ActionIcon
                            variant="light"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = file.url;
                              link.download = file.originalName;
                              link.click();
                            }}
                            className="text-green-600 hover:bg-green-50"
                          >
                            <IconDownload size={14} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Remove">
                          <ActionIcon
                            variant="light"
                            size="sm"
                            onClick={() => removeUploadedFile(file.public_id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <IconX size={14} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      )}
    </Stack>
  );
};

export default MediaUpload; 