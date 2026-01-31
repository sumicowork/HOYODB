import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ==================== 类型定义 ====================

export interface Game {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  gameId: number;
  name: string;
  slug: string;
  parentId?: number;
  sortOrder: number;
  game?: Game;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  type: 'CHARACTER' | 'ELEMENT' | 'RARITY' | 'VERSION' | 'SCENE' | 'OTHER';
}

export interface Material {
  id: number;
  gameId: number;
  categoryId: number;
  title: string;
  description?: string;
  filePath: string;
  fileSize: string;
  fileType: string;
  duration?: number;
  resolution?: string;
  version?: string;
  uploadTime: string;
  downloadCount: number;
  isFeatured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  game?: Game;
  category?: Category;
  tags?: { tag: Tag }[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ==================== 公共 API ====================

export const api = {
  // 游戏
  getGames: () => apiClient.get<ApiResponse<Game[]>>('/api/games'),
  getGame: (slug: string) => apiClient.get<ApiResponse<Game>>(`/api/games/${slug}`),

  // 素材
  getMaterials: (params?: {
    gameId?: number;
    categoryId?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get<PaginatedResponse<Material>>('/api/materials', { params }),
  getMaterial: (id: number) => apiClient.get<ApiResponse<Material>>(`/api/materials/${id}`),
  recordDownload: (id: number) => apiClient.post(`/api/materials/${id}/download`),

  // 标签
  getTags: (type?: string) => apiClient.get<ApiResponse<Tag[]>>('/api/tags', { params: { type } }),
  getTag: (slug: string) => apiClient.get<ApiResponse<Tag>>(`/api/tags/${slug}`),

  // 认证
  login: (username: string, password: string) =>
    apiClient.post<ApiResponse<{ token: string; admin: { id: number; username: string } }>>(
      '/api/auth/login',
      { username, password }
    ),
  verifyToken: () => apiClient.get('/api/auth/verify'),
};

// ==================== 管理员 API ====================

export const adminApi = {
  // 仪表盘
  getDashboardStats: () => apiClient.get('/api/admin/dashboard/stats'),

  // 游戏管理
  getGames: () => apiClient.get<ApiResponse<Game[]>>('/api/admin/games'),
  createGame: (data: Partial<Game>) => apiClient.post('/api/admin/games', data),
  updateGame: (id: number, data: Partial<Game>) => apiClient.put(`/api/admin/games/${id}`, data),
  deleteGame: (id: number) => apiClient.delete(`/api/admin/games/${id}`),

  // 分类管理
  getCategories: (gameId?: number) =>
    apiClient.get<ApiResponse<Category[]>>('/api/admin/categories', { params: { gameId } }),
  createCategory: (data: Partial<Category>) => apiClient.post('/api/admin/categories', data),
  updateCategory: (id: number, data: Partial<Category>) =>
    apiClient.put(`/api/admin/categories/${id}`, data),
  deleteCategory: (id: number) => apiClient.delete(`/api/admin/categories/${id}`),

  // 素材管理
  getMaterials: (params?: {
    gameId?: number;
    categoryId?: number;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get<PaginatedResponse<Material>>('/api/admin/materials', { params }),
  createMaterial: (data: Partial<Material> & { tagIds?: number[] }) =>
    apiClient.post('/api/admin/materials', data),
  updateMaterial: (id: number, data: Partial<Material> & { tagIds?: number[] }) =>
    apiClient.put(`/api/admin/materials/${id}`, data),
  deleteMaterial: (id: number) => apiClient.delete(`/api/admin/materials/${id}`),

  // 标签管理
  getTags: (type?: string) =>
    apiClient.get<ApiResponse<Tag[]>>('/api/admin/tags', { params: { type } }),
  createTag: (data: Partial<Tag>) => apiClient.post('/api/admin/tags', data),
  updateTag: (id: number, data: Partial<Tag>) => apiClient.put(`/api/admin/tags/${id}`, data),
  deleteTag: (id: number) => apiClient.delete(`/api/admin/tags/${id}`),
};

export default apiClient;

