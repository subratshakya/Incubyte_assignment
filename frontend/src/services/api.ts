import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(username: string, email: string, password: string) {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
};

export const sweetService = {
  async getAllSweets(): Promise<Sweet[]> {
    const response = await api.get('/sweets');
    return response.data;
  },

  async searchSweets(filters: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Sweet[]> {
    const response = await api.get('/sweets/search', { params: filters });
    return response.data;
  },

  async createSweet(data: {
    name: string;
    category: string;
    price: number;
    quantity: number;
  }): Promise<Sweet> {
    const response = await api.post('/sweets', data);
    return response.data;
  },

  async updateSweet(id: number, data: Partial<Sweet>): Promise<Sweet> {
    const response = await api.put(`/sweets/${id}`, data);
    return response.data;
  },

  async deleteSweet(id: number): Promise<void> {
    await api.delete(`/sweets/${id}`);
  },

  async purchaseSweet(id: number, quantity: number): Promise<Sweet> {
    const response = await api.post(`/sweets/${id}/purchase`, { quantity });
    return response.data;
  },

  async restockSweet(id: number, quantity: number): Promise<Sweet> {
    const response = await api.post(`/sweets/${id}/restock`, { quantity });
    return response.data;
  },
};

