const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper for API calls
 */
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const api = {
  // Auth
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  getProfile: () => apiCall('/auth/profile'),
  getUsers: () => apiCall('/auth/users'),
  updateVerifierEvents: (userId, eventIds) => apiCall(`/auth/users/${userId}/events`, {
    method: 'PATCH',
    body: JSON.stringify({ eventIds }),
  }),
  deleteUser: (userId) => apiCall(`/auth/users/${userId}`, {
    method: 'DELETE',
  }),

  // Events
  getEvents: (page = 1, pageSize = 10) => apiCall(`/events?page=${page}&pageSize=${pageSize}`),
  getEvent: (id) => apiCall(`/events/${id}`),
  createEvent: (eventData) => apiCall('/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  }),
  updateEvent: (id, eventData) => apiCall(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  }),
  deleteEvent: (id) => apiCall(`/events/${id}`, {
    method: 'DELETE',
  }),

  // Registrations
  registerForEvent: (registrationData) => apiCall('/registrations', {
    method: 'POST',
    body: JSON.stringify(registrationData),
  }),
  getEventRegistrations: (eventId, page = 1, pageSize = 10) => 
    apiCall(`/registrations/event/${eventId}?page=${page}&pageSize=${pageSize}`),
  getAllRegistrations: (page = 1, pageSize = 10) => 
    apiCall(`/registrations?page=${page}&pageSize=${pageSize}`),
  updateRegistrationStatus: (registrationId, status) => 
    apiCall(`/registrations/${registrationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Dashboard
  getStats: () => apiCall('/dashboard'),

  // Scans
  scanQRCode: (qrData) => apiCall('/scans', {
    method: 'POST',
    body: JSON.stringify(qrData),
  }),
  getScanLogs: (eventId, page = 1, pageSize = 10) => 
    apiCall(`/scans/${eventId}?page=${page}&pageSize=${pageSize}`),
};

export default api;
