import API from './api';

export interface BoardMember {
  id: string;
  name: string;
  position: string;
  district?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  bio?: string;
  termStart?: string;
  termEnd?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardMemberData {
  name: string;
  position: string;
  district?: string;
  email?: string;
  phone?: string;
  bio?: string;
  termStart?: string;
  termEnd?: string;
}

export interface UpdateBoardMemberData extends CreateBoardMemberData {
  isActive?: boolean;
}

export const boardMemberService = {
  getAllBoardMembers: async (): Promise<BoardMember[]> => {
    const response = await API.get('/board-members');
    return response.data;
  },

  getBoardMemberById: async (id: string): Promise<BoardMember> => {
    const response = await API.get(`/board-members/${id}`);
    return response.data;
  },

  createBoardMember: async (data: CreateBoardMemberData): Promise<BoardMember> => {
    const response = await API.post('/board-members', data);
    return response.data;
  },

  updateBoardMember: async (id: string, data: UpdateBoardMemberData): Promise<BoardMember> => {
    const response = await API.put(`/board-members/${id}`, data);
    return response.data;
  },

  deleteBoardMember: async (id: string): Promise<void> => {
    await API.delete(`/board-members/${id}`);
  }
}; 