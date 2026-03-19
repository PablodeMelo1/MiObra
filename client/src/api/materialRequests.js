import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getMaterialRequests = () => api.get('/api/v1/material-requests');
export const getMaterialRequestById = (id) => api.get(`/api/v1/material-requests/${id}`);
export const createMaterialRequest = (payload) => api.post('/api/v1/material-requests', payload);
export const updateMaterialRequest = (id, payload) => api.put(`/api/v1/material-requests/${id}`, payload);
export const deleteMaterialRequest = (id) => api.delete(`/api/v1/material-requests/${id}`);
