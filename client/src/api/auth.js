import api from "./http";

export const registerRequest = user => api.post('/api/v1/auth/signup', user);

export const loginRequest = credentials => api.post('/api/v1/auth/login', credentials);

export const logoutRequest = () => api.post('/api/v1/auth/logout');

export const verifySessionRequest = () => api.get('/api/v1/auth/me');

export default api;
