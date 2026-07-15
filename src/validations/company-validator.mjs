import Joi from 'joi';
import { COMPANY_ROLES } from '../constants/companyRoles.mjs';

const manageableRoles = Object.values(COMPANY_ROLES).filter((role) => role !== COMPANY_ROLES.OWNER);

export const validateCompanyCreate = Joi.object({
    name: Joi.string().trim().min(2).max(120).required(),
    legalName: Joi.string().trim().max(160).allow('').optional(),
    taxId: Joi.string().trim().max(60).allow('').optional(),
    timezone: Joi.string().trim().max(80).optional(),
    currency: Joi.string().trim().uppercase().length(3).optional(),
});

export const validateCompanyUpdate = Joi.object({
    name: Joi.string().trim().min(2).max(120).required(),
    legalName: Joi.string().trim().max(160).allow('').optional(),
    taxId: Joi.string().trim().max(60).allow('').optional(),
    timezone: Joi.string().trim().max(80).optional(),
    currency: Joi.string().trim().uppercase().length(3).optional(),
    logoUrl: Joi.string().trim().uri({ scheme: ['http', 'https'] }).max(500).allow('').optional(),
});

export const validateCompanyMemberRoleUpdate = Joi.object({
    role: Joi.string().valid(...Object.values(COMPANY_ROLES)).required(),
});

export const validateCompanyInvitationCreate = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    role: Joi.string().valid(...manageableRoles).default(COMPANY_ROLES.OPERATOR),
});
