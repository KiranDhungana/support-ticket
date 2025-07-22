import API from './api';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  author: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  category: string;
  priority: string;
  author: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface AnnouncementResponse {
  data: Announcement[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Get all announcements with pagination and filters
export const getAnnouncements = async (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  category: string = '',
  priority: string = ''
): Promise<AnnouncementResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(category && { category }),
      ...(priority && { priority })
    });

    const response = await API.get(`/announcements?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

// Get active announcements (public)
export const getActiveAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const response = await API.get('/announcements/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active announcements:', error);
    throw error;
  }
};

// Get a single announcement by ID
export const getAnnouncementById = async (id: string): Promise<Announcement> => {
  try {
    const response = await API.get(`/announcements/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching announcement:', error);
    throw error;
  }
};

// Create a new announcement
export const createAnnouncement = async (data: CreateAnnouncementData): Promise<Announcement> => {
  try {
    const response = await API.post('/announcements', data);
    return response.data;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

// Update an announcement
export const updateAnnouncement = async (id: string, data: Partial<CreateAnnouncementData>): Promise<Announcement> => {
  try {
    const response = await API.put(`/announcements/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};

// Delete an announcement
export const deleteAnnouncement = async (id: string): Promise<void> => {
  try {
    await API.delete(`/announcements/${id}`);
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};

// Get categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await API.get('/announcements/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}; 