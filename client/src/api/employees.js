import api from './http';

export const getEmployees = () => api.get('/api/v1/employees');

export const createEmployee = (payload) => api.post('/api/v1/employees', payload);

export const updateEmployee = (id, payload) => api.put(`/api/v1/employees/${id}`, payload);

export const deleteEmployee = (id) => api.delete(`/api/v1/employees/${id}`);

export const getEmployeeInvitations = () => api.get('/api/v1/employees/invitations');

export const createEmployeeInvitation = (id, payload = {}) => api.post(`/api/v1/employees/${id}/invitations`, payload);

export const acceptEmployeeInvitationRequest = (token) => api.post(`/api/v1/auth/employee-invitations/${token}/accept`);
