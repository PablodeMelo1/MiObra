import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getPendings = () => api.get('/api/v1/pendings');
export const getPendingById = (id) => api.get(`/api/v1/pendings/${id}`);
export const getPendingsByUser = (userId) => api.get(`/api/v1/pendings/user/${userId}`);
export const createPending = (payload) => api.post('/api/v1/pendings', payload);
export const updatePending = (id, payload) => api.put(`/api/v1/pendings/${id}`, payload);
export const deletePending = (id) => api.delete(`/api/v1/pendings/${id}`);
