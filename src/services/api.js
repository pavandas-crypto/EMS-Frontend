import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling common errors
api.interceptors.response.use((response) => {
  return response.data;
}, (error) => {
  const message = error.response?.data?.message || error.message || 'Something went wrong';
  console.error('API Error:', message);
  return Promise.reject(new Error(message));
});

export const eventService = {
  getEvents: (page = 1, pageSize = 10) => api.get(`/events?page=${page}&pageSize=${pageSize}`),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};

export const registrationService = {
  registerForEvent: (data) => api.post('/registrations', data),
  getAllRegistrations: (page = 1, pageSize = 10) => api.get(`/registrations?page=${page}&pageSize=${pageSize}`),
  updateStatus: (id, status) => api.patch(`/registrations/${id}/status`, { status }),
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  getUsers: () => api.get('/auth/users'),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};

export default {
  events: eventService,
  registrations: registrationService,
  auth: authService,
  dashboard: dashboardService,
};
