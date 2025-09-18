import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
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

// Response interceptor for handling common errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
};

// Agent API calls
export const agentAPI = {
  getAgents: () => API.get('/agents'),
  createAgent: (agentData) => API.post('/agents', agentData),
  getAgent: (id) => API.get(`/agents/${id}`),
  updateAgent: (id, agentData) => API.put(`/agents/${id}`, agentData),
  deleteAgent: (id) => API.delete(`/agents/${id}`),
};

// Upload API calls
export const uploadAPI = {
  uploadFile: (formData) => API.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getTasks: () => API.get('/upload/tasks'),
  getTasksByAgent: () => API.get('/upload/tasks/by-agent'),
};

// Health check
export const healthAPI = {
  check: () => API.get('/health'),
};

export default API;