import express from 'express';
import {
    createCompany,
    createCompanyInvitation,
    getCompanyInvitations,
    getCompanyMembers,
    getMyCompanies,
    removeCompanyMember,
    revokeCompanyInvitation,
    switchActiveCompany,
    updateCompany,
    updateCompanyMemberRole,
} from '../../controllers/company-controller.mjs';
import { auth } from '../../middleware/auth-middleware.mjs';

const routes = express.Router();

routes.get('/', auth, getMyCompanies);
routes.post('/', auth, createCompany);
routes.patch('/active', auth, switchActiveCompany);
routes.put('/current', auth, updateCompany);
routes.get('/members', auth, getCompanyMembers);
routes.put('/members/:id/role', auth, updateCompanyMemberRole);
routes.delete('/members/:id', auth, removeCompanyMember);
routes.get('/invitations', auth, getCompanyInvitations);
routes.post('/invitations', auth, createCompanyInvitation);
routes.delete('/invitations/:id', auth, revokeCompanyInvitation);

export default routes;
