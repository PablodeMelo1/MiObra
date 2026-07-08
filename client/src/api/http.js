import axios from 'axios';

const normalizeBaseURL = (url) => {
  const baseURL = url || (import.meta.env.PROD ? '/' : 'http://localhost:3000');
  return baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
};

export const API_URL = normalizeBaseURL(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const activeCompanyId = window.localStorage.getItem('activeCompanyId');
  if (activeCompanyId) {
    config.headers['X-Company-Id'] = activeCompanyId;
  }
  return config;
});

export default api;
