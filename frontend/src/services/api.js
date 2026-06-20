import axios from 'axios';

// Create Axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to format responses or errors consistently
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg = 
      error.response?.data?.message || 
      error.response?.data?.errors?.join(', ') || 
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(errorMsg));
  }
);

export const getTasks = (params = {}) => {
  // Pass query parameters directly (search, status, sort, page, limit)
  return api.get('/tasks', { params });
};

export const createTask = (taskData) => {
  return api.post('/tasks', taskData);
};

export const updateTask = (id, statusData) => {
  return api.put(`/tasks/${id}`, statusData);
};

export const deleteTask = (id) => {
  return api.delete(`/tasks/${id}`);
};

export default {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
