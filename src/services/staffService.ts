import API from './api';

export interface Staff {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone?: string;
  location?: string;
  experience?: number;
  imageUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffData {
  name: string;
  position: string;
  department: string;
  email: string;
  phone?: string;
  location?: string;
  experience?: number;
  imageUrl?: string;
  bio?: string;
}

export interface StaffResponse {
  data: Staff[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Get all staff members with pagination and filters
export const getStaff = async (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  department: string = ''
): Promise<StaffResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(department && { department })
    });

    const response = await API.get(`/staff?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
};

// Get a single staff member by ID
export const getStaffById = async (id: string): Promise<Staff> => {
  try {
    const response = await API.get(`/staff/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching staff member:', error);
    throw error;
  }
};

// Create a new staff member
export const createStaff = async (data: CreateStaffData): Promise<Staff> => {
  try {
    const response = await API.post('/staff', data);
    return response.data;
  } catch (error) {
    console.error('Error creating staff member:', error);
    throw error;
  }
};

// Update a staff member
export const updateStaff = async (id: string, data: Partial<CreateStaffData>): Promise<Staff> => {
  try {
    const response = await API.put(`/staff/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating staff member:', error);
    throw error;
  }
};

// Delete a staff member
export const deleteStaff = async (id: string): Promise<void> => {
  try {
    await API.delete(`/staff/${id}`);
  } catch (error) {
    console.error('Error deleting staff member:', error);
    throw error;
  }
};

// Get departments
export const getDepartments = async (): Promise<string[]> => {
  try {
    const response = await API.get('/staff/departments');
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
}; 