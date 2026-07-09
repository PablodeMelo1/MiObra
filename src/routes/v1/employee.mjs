import express from 'express';
import {
    createEmployee,
    createEmployeeInvitation,
    deleteEmployee,
    getEmployeeById,
    getEmployeeInvitations,
    getEmployees,
    revokeEmployeeInvitation,
    updateEmployee,
} from '../../controllers/employee-controller.mjs';
import { auth } from '../../middleware/auth-middleware.mjs';
import { requireRole } from '../../middleware/role-middleware.mjs';
import { COMPANY_ROLES } from '../../constants/companyRoles.mjs';
import { validateRequest } from '../../middleware/validation.middleware.mjs';
import {
    validateEmployeeCreate,
    validateEmployeeInvitationCreate,
    validateEmployeeUpdate,
} from '../../validations/employee-validator.mjs';
import reqValidate from '../../constants/request-validate-constants.mjs';

const routes = express.Router();

routes.get('/', auth, getEmployees);
routes.post(
    '/',
    auth,
    requireRole(COMPANY_ROLES.OWNER, COMPANY_ROLES.ADMIN),
    validateRequest(validateEmployeeCreate, reqValidate.BODY),
    createEmployee,
);
routes.get('/invitations', auth, getEmployeeInvitations);
routes.get('/:id', auth, getEmployeeById);
routes.put(
    '/:id',
    auth,
    requireRole(COMPANY_ROLES.OWNER, COMPANY_ROLES.ADMIN),
    validateRequest(validateEmployeeUpdate, reqValidate.BODY),
    updateEmployee,
);
routes.delete('/:id', auth, requireRole(COMPANY_ROLES.OWNER, COMPANY_ROLES.ADMIN), deleteEmployee);
routes.post(
    '/:id/invitations',
    auth,
    requireRole(COMPANY_ROLES.OWNER, COMPANY_ROLES.ADMIN),
    validateRequest(validateEmployeeInvitationCreate, reqValidate.BODY),
    createEmployeeInvitation,
);
routes.delete(
    '/invitations/:invitationId',
    auth,
    requireRole(COMPANY_ROLES.OWNER, COMPANY_ROLES.ADMIN),
    revokeEmployeeInvitation,
);

export default routes;
