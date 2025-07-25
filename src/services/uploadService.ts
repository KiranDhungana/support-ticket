import API from './api';

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    public_id: string;
    format: string;
    size: string;
    originalName: string;
  };
}

export interface MultipleUploadResponse {
  success: boolean;
  data: Array<{
    url: string;
    public_id: string;
    format: string;
    size: string;
    originalName: string;
  }>;
}

// Upload single image
export const uploadImage = async (file: File, folder?: string): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await API.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Upload single PDF
export const uploadPDF = async (file: File, folder?: string): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await API.post('/upload/pdf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Upload multiple files
export const uploadMultipleFiles = async (files: File[], folder?: string): Promise<MultipleUploadResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await API.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Delete file from Cloudinary
export const deleteFile = async (publicId: string, resourceType: 'image' | 'raw' = 'image') => {
  const response = await API.delete(`/upload/${publicId}?resource_type=${resourceType}`);
  return response.data;
};

// File validation helpers
export const validateImageFile = (file: File): string | null => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, GIF, WebP)';
  }

  if (file.size > maxSize) {
    return 'Image file size must be less than 10MB';
  }

  return null;
};

export const validatePDFFile = (file: File): string | null => {
  const allowedTypes = ['application/pdf'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return 'Please select a valid PDF file';
  }

  if (file.size > maxSize) {
    return 'PDF file size must be less than 10MB';
  }

  return null;
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 