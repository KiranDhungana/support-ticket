import { useState, useRef } from 'react';
import { 
  Group, 
  Text, 
  Stack, 
  Card, 
  ActionIcon, 
  Progress,
  Badge,
  Tooltip
} from '@mantine/core';
import { 
  IconUpload, 
  IconX, 
  IconFile, 
  IconPhoto, 
  IconFileText,
  IconCheck,
  IconAlertCircle
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { 
  uploadImage, 
  uploadPDF, 
  validateImageFile, 
  validatePDFFile,
  formatFileSize 
} from '../services/uploadService';

interface FileUploadProps {
  onUploadComplete: (fileData: {
    url: string;
    public_id: string;
    format: string;
    size: string;
    originalName: string;
  }) => void;
  onUploadError?: (error: string) => void;
  accept?: 'image' | 'pdf' | 'both';
  folder?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  label?: string;
  description?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  accept = 'both',
  folder = 'notices',
  maxSize = 10,
  multiple = false,
  label = 'Upload File',
  description = 'Click to upload or drag and drop'
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptTypes = () => {
    switch (accept) {
      case 'image':
        return 'image/*';
      case 'pdf':
        return 'application/pdf';
      case 'both':
        return 'image/*,application/pdf';
      default:
        return '*/*';
    }
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    if (accept === 'image') {
      return validateImageFile(file);
    } else if (accept === 'pdf') {
      return validatePDFFile(file);
    } else if (accept === 'both') {
      if (file.type.startsWith('image/')) {
        return validateImageFile(file);
      } else if (file.type === 'application/pdf') {
        return validatePDFFile(file);
      }
    }

    return null;
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
      if (file.type === 'application/pdf') {
        result = await uploadPDF(file, folder);
      } else {
        result = await uploadImage(file, folder);
      }

      setUploadingFiles(prev => 
        prev.map(f => 
          f.file === file 
            ? { ...f, progress: 100, status: 'success' as const }
            : f
        )
      );

      onUploadComplete(result.data);
      
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
    if (!multiple && files.length > 1) {
      notifications.show({
        title: 'Multiple Files',
        message: 'Only one file can be selected',
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
    if (!multiple && files.length > 1) {
      notifications.show({
        title: 'Multiple Files',
        message: 'Only one file can be dropped',
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

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <IconPhoto size={20} />;
    } else if (file.type === 'application/pdf') {
      return <IconFileText size={20} />;
    }
    return <IconFile size={20} />;
  };

  return (
    <Stack gap="md">
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptTypes()}
        onChange={handleFileSelect}
        multiple={multiple}
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
              Max size: {maxSize}MB • {accept === 'image' ? 'Images only' : accept === 'pdf' ? 'PDFs only' : 'Images & PDFs'}
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
    </Stack>
  );
};

export default FileUpload; 