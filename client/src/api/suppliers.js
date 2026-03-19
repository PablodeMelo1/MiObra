import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getSuppliers = () => api.get('/api/v1/suppliers');
export const getSupplierById = (id) => api.get(`/api/v1/suppliers/${id}`);
export const createSupplier = (payload) => api.post('/api/v1/suppliers', payload);
export const updateSupplier = (id, payload) => api.put(`/api/v1/suppliers/${id}`, payload);
export const deleteSupplier = (id) => api.delete(`/api/v1/suppliers/${id}`);
export const searchSuppliersByName = (name) => api.get('/api/v1/suppliers/search', { params: { name } });
