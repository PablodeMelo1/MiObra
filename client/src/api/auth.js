import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const registerRequest = user => api.post('api/v1/auth/signup', user);

export const loginRequest = credentials => api.post('api/v1/auth/login', credentials);

export const logoutRequest = () => api.post('api/v1/auth/logout');

export const verifySessionRequest = () => api.get('api/v1/auth/me');                                                            

export default api;