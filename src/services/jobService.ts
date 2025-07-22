import api from './api';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  category: string;
  salary: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  isRemote: boolean;
  isUrgent: boolean;
  isActive: boolean;
  postedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobData {
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  salary: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  isRemote: boolean;
  isUrgent: boolean;
}

export interface UpdateJobData extends Partial<CreateJobData> {
  isActive?: boolean;
}

export interface JobsResponse {
  data: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Get all jobs with pagination and filtering
export const getJobs = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: string,
  type?: string,
  isRemote?: boolean,
  isUrgent?: boolean
): Promise<JobsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (type) params.append('type', type);
  if (isRemote !== undefined) params.append('isRemote', isRemote.toString());
  if (isUrgent !== undefined) params.append('isUrgent', isUrgent.toString());

  const response = await api.get(`/jobs?${params.toString()}`);
  return response.data;
};

// Get a single job by ID
export const getJobById = async (id: string): Promise<Job> => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

// Create a new job (admin only)
export const createJob = async (jobData: CreateJobData): Promise<Job> => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

// Update a job (admin only)
export const updateJob = async (id: string, jobData: UpdateJobData): Promise<Job> => {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
};

// Delete a job (admin only)
export const deleteJob = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};

// Toggle job active status (admin only)
export const toggleJobStatus = async (id: string): Promise<Job> => {
  const response = await api.patch(`/jobs/${id}/toggle-status`);
  return response.data;
};

// Get job categories
export const getJobCategories = async (): Promise<string[]> => {
  const response = await api.get('/jobs/categories');
  return response.data;
};

// Get job types
export const getJobTypes = async (): Promise<string[]> => {
  const response = await api.get('/jobs/types');
  return response.data;
}; 