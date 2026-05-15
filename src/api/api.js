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
  updateUser: (userId, userData) => apiCall(`/auth/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  deleteUser: (userId) => apiCall(`/auth/users/${userId}`, {
    method: 'DELETE',
  }),

  // Events
  getEvents: (page = 1, pageSize = 10) => apiCall(`/events?page=${page}&pageSize=${pageSize}`),
  getEvent: (id) => apiCall(`/events/${id}`),
  getAssignedEvents: () => apiCall('/events/verifier/assigned'),
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
  
  // Draft event management
  getDraftEvent: () => apiCall('/events/user/draft'),
  publishDraftEvent: (eventId) => apiCall(`/events/${eventId}/publish`, {
    method: 'PUT',
    body: JSON.stringify({ is_draft: false }),
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

  // Tickets
  getTicketTemplate: (eventId) => apiCall(`/tickets/templates/${eventId}`),
  getTicketTemplatesList: () => apiCall('/tickets/templates'),
  saveTicketTemplate: (templateData) => apiCall('/tickets/templates', {
    method: 'POST',
    body: JSON.stringify(templateData),
  }),

  // Ticket Management
  getTicket: (ticketId) => apiCall(`/tickets/${ticketId}`),
  getEventTickets: (eventId, page = 1, pageSize = 10, sortBy = 'created_at', sortOrder = 'desc', search = '') => 
    apiCall(`/tickets/event/${eventId}?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`),
  getRegistrationTicket: (registrationId) => 
    apiCall(`/tickets/registration/${registrationId}`),
  getAllTickets: (page = 1, pageSize = 10, sortBy = 'created_at', sortOrder = 'desc', search = '') => 
    apiCall(`/tickets?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`),
  markTicketDownloaded: (ticketId) => 
    apiCall(`/tickets/${ticketId}/downloaded`, { method: 'PATCH' }),
  markTicketPrinted: (ticketId) => 
    apiCall(`/tickets/${ticketId}/printed`, { method: 'PATCH' }),
  updateTicketData: (ticketId, ticketData) => 
    apiCall(`/tickets/${ticketId}/data`, {
      method: 'PATCH',
      body: JSON.stringify({ ticket_data: ticketData }),
    }),
  deleteTicket: (ticketId) => 
    apiCall(`/tickets/${ticketId}`, { method: 'DELETE' }),

  // Images
  uploadImage: (imageData, fileName, altText) => apiCall('/images/upload', {
    method: 'POST',
    body: JSON.stringify({ imageData, fileName, altText }),
  }),
  getImage: (imageId) => apiCall(`/images/${imageId}`),
  deleteImage: (imageId) => apiCall(`/images/${imageId}`, { method: 'DELETE' }),

  // Sponsors
  getEventSponsors: (eventId) => apiCall(`/sponsors/event/${eventId}`),
  getTemplateSponsors: (templateId) => apiCall(`/sponsors/template/${templateId}`),
  addSponsor: (sponsorData) => apiCall('/sponsors', {
    method: 'POST',
    body: JSON.stringify(sponsorData),
  }),
  updateSponsor: (sponsorId, sponsorData) => apiCall(`/sponsors/${sponsorId}`, {
    method: 'PUT',
    body: JSON.stringify(sponsorData),
  }),
  deleteSponsor: (sponsorId) => apiCall(`/sponsors/${sponsorId}`, { 
    method: 'DELETE' 
  }),
  reorderSponsors: (sponsors) => apiCall('/sponsors/reorder/all', {
    method: 'PUT',
    body: JSON.stringify({ sponsors }),
  }),
};

export default api;
