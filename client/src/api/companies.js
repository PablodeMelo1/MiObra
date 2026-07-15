import api from './http';

export const getCompanies = () => api.get('/api/v1/companies');

export const createCompany = (payload) => api.post('/api/v1/companies', payload);

export const updateCurrentCompany = (payload) => api.put('/api/v1/companies/current', payload);

export const getCompanyMembers = () => api.get('/api/v1/companies/members');

export const updateCompanyMemberRole = (id, role) => api.put(`/api/v1/companies/members/${id}/role`, { role });

export const deactivateCompanyMember = (id) => api.delete(`/api/v1/companies/members/${id}`);

export const createCompanyInvitation = (payload) => api.post('/api/v1/companies/invitations', payload);

export const getCompanyInvitations = () => api.get('/api/v1/companies/invitations');

export const revokeCompanyInvitation = (id) => api.delete(`/api/v1/companies/invitations/${id}`);
