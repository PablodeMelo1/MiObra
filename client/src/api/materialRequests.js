import api from './http';

export const getMaterialRequests = () => api.get('/api/v1/material-requests');
export const getMaterialRequestById = (id) => api.get(`/api/v1/material-requests/${id}`);
export const createMaterialRequest = (payload) => api.post('/api/v1/material-requests', payload);
export const updateMaterialRequest = (id, payload) => api.put(`/api/v1/material-requests/${id}`, payload);
export const deleteMaterialRequest = (id) => api.delete(`/api/v1/material-requests/${id}`);
