import axios from 'axios';
import { API_URL } from './http';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getItems = (params = {}) => api.get('/api/v1/items', { params });
export const getItemById = (id) => api.get(`/api/v1/items/${id}`);
export const createItem = (payload) => api.post('/api/v1/items', payload);
export const updateItem = (id, payload) => api.put(`/api/v1/items/${id}`, payload);
export const deleteItem = (id) => api.delete(`/api/v1/items/${id}`);
export const checkoutItem = (id, payload) => api.post(`/api/v1/items/${id}/checkout`, payload);
export const checkinItem = (id, payload) => api.post(`/api/v1/items/${id}/checkin`, payload);
export const getItemActivities = (id, params = {}) => api.get(`/api/v1/items/${id}/activities`, { params });
export const getInventoryActivities = (params = {}) => api.get('/api/v1/items/activities', { params });
