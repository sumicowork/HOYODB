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
    tagId?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get<PaginatedResponse<Material>>('/api/materials', { params }),
  getMaterial: (id: number) => apiClient.get<ApiResponse<Material>>(`/api/materials/${id}`),
  recordDownload: (id: number) => apiClient.post(`/api/materials/${id}/download`),
  getPopularMaterials: (limit?: number) =>
    apiClient.get<ApiResponse<Material[]>>('/api/materials/stats/popular', { params: { limit } }),
  getRecentMaterials: (limit?: number) =>
    apiClient.get<ApiResponse<Material[]>>('/api/materials/stats/recent', { params: { limit } }),

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
  // 创建素材（带文件上传的原子操作）
  createMaterialWithUpload: (data: {
    file?: File;
    gameId: number;
    gameSlug: string;
    categoryId: number;
    categorySlug?: string;
    title: string;
    description?: string;
    filePath?: string;
    fileSize?: string;
    fileType?: string;
    duration?: number;
    resolution?: string;
    version?: string;
    isFeatured?: boolean;
    status?: string;
    tagIds?: number[];
  }) => {
    const formData = new FormData();
    if (data.file) {
      formData.append('file', data.file);
    }
    formData.append('gameId', String(data.gameId));
    formData.append('gameSlug', data.gameSlug);
    formData.append('categoryId', String(data.categoryId));
    if (data.categorySlug) formData.append('categorySlug', data.categorySlug);
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.filePath) formData.append('filePath', data.filePath);
    if (data.fileSize) formData.append('fileSize', data.fileSize);
    if (data.fileType) formData.append('fileType', data.fileType);
    if (data.duration) formData.append('duration', String(data.duration));
    if (data.resolution) formData.append('resolution', data.resolution);
    if (data.version) formData.append('version', data.version);
    if (data.isFeatured !== undefined) formData.append('isFeatured', String(data.isFeatured));
    if (data.status) formData.append('status', data.status);
    if (data.tagIds && data.tagIds.length > 0) {
      formData.append('tagIds', JSON.stringify(data.tagIds));
    }
    return apiClient.post<ApiResponse<Material>>('/api/admin/materials/with-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateMaterial: (id: number, data: Partial<Material> & { tagIds?: number[] }) =>
    apiClient.put(`/api/admin/materials/${id}`, data),
  deleteMaterial: (id: number) => apiClient.delete(`/api/admin/materials/${id}`),

  // 标签管理
  getTags: (type?: string) =>
    apiClient.get<ApiResponse<Tag[]>>('/api/admin/tags', { params: { type } }),
  createTag: (data: Partial<Tag>) => apiClient.post('/api/admin/tags', data),
  updateTag: (id: number, data: Partial<Tag>) => apiClient.put(`/api/admin/tags/${id}`, data),
  deleteTag: (id: number) => apiClient.delete(`/api/admin/tags/${id}`),

  // 文件上传
  uploadFile: (file: File, gameSlug: string, categorySlug?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('gameSlug', gameSlug);
    if (categorySlug) {
      formData.append('categorySlug', categorySlug);
    }
    return apiClient.post<ApiResponse<{
      url: string;
      filename: string;
      originalName: string;
      size: number;
      mimeType: string;
      path: string;
    }>>('/api/upload/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadFiles: (files: File[], gameSlug: string, categorySlug?: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('gameSlug', gameSlug);
    if (categorySlug) {
      formData.append('categorySlug', categorySlug);
    }
    return apiClient.post<ApiResponse<{
      uploaded: Array<{
        url: string;
        filename: string;
        originalName: string;
        size: number;
        mimeType: string;
        path: string;
      }>;
      failed: Array<{ originalName: string; error: string }>;
      total: number;
      successCount: number;
      failedCount: number;
    }>>('/api/upload/upload/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteUploadedFile: (path: string, filename: string) =>
    apiClient.delete('/api/upload/delete', { data: { path, filename } }),

  listFiles: (path?: string) =>
    apiClient.get<ApiResponse<Array<{
      name: string;
      type: string;
      size: number;
      lastModified: string;
      path: string;
    }>>>('/api/upload/list', { params: { path } }),

  getStorageInfo: () =>
    apiClient.get<ApiResponse<{
      used: number;
      available: number;
      usedFormatted: string;
      availableFormatted: string;
    } | null>>('/api/upload/storage'),

  getWebDAVStatus: () =>
    apiClient.get<ApiResponse<{
      connected: boolean;
      webdavUrl?: string;
      error?: string;
    }>>('/api/upload/status'),
};

export default apiClient;

