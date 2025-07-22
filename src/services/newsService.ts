import API from './api';

export interface News {
  id: string;
  title: string;
  content: string;
  summary?: string;
  author: string;
  imageUrl?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsData {
  title: string;
  content: string;
  summary?: string;
  author: string;
  imageUrl?: string;
  isPublished?: boolean;
}

export interface NewsResponse {
  data: News[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Get all news with pagination and filters (admin)
export const getAllNews = async (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  published: string = ''
): Promise<NewsResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(published && { published })
    });

    const response = await API.get(`/news?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

// Get published news (public)
export const getPublishedNews = async (
  page: number = 1,
  limit: number = 10
): Promise<NewsResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await API.get(`/news/published?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching published news:', error);
    throw error;
  }
};

// Get a single news by ID
export const getNewsById = async (id: string): Promise<News> => {
  try {
    const response = await API.get(`/news/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

// Create a new news
export const createNews = async (data: CreateNewsData): Promise<News> => {
  try {
    const response = await API.post('/news', data);
    return response.data;
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

// Update a news
export const updateNews = async (id: string, data: Partial<CreateNewsData>): Promise<News> => {
  try {
    const response = await API.put(`/news/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
};

// Delete a news
export const deleteNews = async (id: string): Promise<void> => {
  try {
    await API.delete(`/news/${id}`);
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
};

// Toggle publish status
export const togglePublishStatus = async (id: string, isPublished: boolean): Promise<News> => {
  try {
    const response = await API.patch(`/news/${id}/publish`, { isPublished });
    return response.data;
  } catch (error) {
    console.error('Error toggling publish status:', error);
    throw error;
  }
}; 