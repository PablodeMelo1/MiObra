import api from './http';

export const getPendings = () => api.get('/api/v1/pendings');
export const getPendingById = (id) => api.get(`/api/v1/pendings/${id}`);
export const getPendingsByUser = (userId) => api.get(`/api/v1/pendings/user/${userId}`);
export const createPending = (payload) => api.post('/api/v1/pendings', payload);
export const updatePending = (id, payload) => api.put(`/api/v1/pendings/${id}`, payload);
export const deletePending = (id) => api.delete(`/api/v1/pendings/${id}`);
