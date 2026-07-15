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
import { requireRole } from '../../middleware/role-middleware.mjs';
import { validateRequest } from '../../middleware/validation.middleware.mjs';
import reqValidate from '../../constants/request-validate-constants.mjs';
import { COMPANY_ROLES } from '../../constants/companyRoles.mjs';
import {
    validateCompanyCreate,
    validateCompanyInvitationCreate,
    validateCompanyMemberRoleUpdate,
    validateCompanyUpdate,
} from '../../validations/company-validator.mjs';

const routes = express.Router();

routes.get('/', auth, getMyCompanies);
const requireCompanyAdmin = requireRole(COMPANY_ROLES.OWNER, COMPANY_ROLES.ADMIN);

routes.post('/', auth, validateRequest(validateCompanyCreate, reqValidate.BODY), createCompany);
routes.patch('/active', auth, switchActiveCompany);
routes.put('/current', auth, requireCompanyAdmin, validateRequest(validateCompanyUpdate, reqValidate.BODY), updateCompany);
routes.get('/members', auth, getCompanyMembers);
routes.put('/members/:id/role', auth, requireCompanyAdmin, validateRequest(validateCompanyMemberRoleUpdate, reqValidate.BODY), updateCompanyMemberRole);
routes.delete('/members/:id', auth, requireCompanyAdmin, removeCompanyMember);
routes.get('/invitations', auth, requireCompanyAdmin, getCompanyInvitations);
routes.post('/invitations', auth, requireCompanyAdmin, validateRequest(validateCompanyInvitationCreate, reqValidate.BODY), createCompanyInvitation);
routes.delete('/invitations/:id', auth, requireCompanyAdmin, revokeCompanyInvitation);

export default routes;
