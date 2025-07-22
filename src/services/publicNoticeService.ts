import API from './api';

export interface PublicNotice {
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

export interface CreateNoticeData {
  title: string;
  description: string;
  category: string;
  author: string;
  pdfUrl: string;
  fileSize: string;
  imageUrl?: string;
  publicId?: string;
}

// Get all public notices
export const getPublicNotices = async (): Promise<PublicNotice[]> => {
  try {
    const response = await API.get('/public-notices');
    return response.data;
  } catch (error) {
    console.error('Error fetching public notices:', error);
    throw error;
  }
};

// Get a single public notice by ID
export const getPublicNoticeById = async (id: string): Promise<PublicNotice> => {
  try {
    const response = await API.get(`/public-notices/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching public notice:', error);
    throw error;
  }
};

// Create a new public notice
export const createPublicNotice = async (data: CreateNoticeData): Promise<PublicNotice> => {
  try {
    const response = await API.post('/public-notices', data);
    return response.data;
  } catch (error) {
    console.error('Error creating public notice:', error);
    throw error;
  }
};

// Update a public notice
export const updatePublicNotice = async (id: string, data: Partial<CreateNoticeData>): Promise<PublicNotice> => {
  try {
    const response = await API.put(`/public-notices/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating public notice:', error);
    throw error;
  }
};

// Delete a public notice
export const deletePublicNotice = async (id: string): Promise<void> => {
  try {
    await API.delete(`/public-notices/${id}`);
  } catch (error) {
    console.error('Error deleting public notice:', error);
    throw error;
  }
};

// Get notices by category
export const getNoticesByCategory = async (category: string): Promise<PublicNotice[]> => {
  try {
    const response = await API.get(`/public-notices?category=${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notices by category:', error);
    throw error;
  }
};

// Search notices
export const searchNotices = async (query: string): Promise<PublicNotice[]> => {
  try {
    const response = await API.get(`/public-notices?search=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching notices:', error);
    throw error;
  }
}; 