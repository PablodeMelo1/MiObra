import Joi from 'joi';
import { EMPLOYEE_STATUS } from '../constants/employeeStatus.mjs';

const nullableString = Joi.string().allow('', null);
const objectId = Joi.string().hex().length(24);

export const validateEmployeeCreate = Joi.object({
    fullName: Joi.string().min(2).max(120).required(),
    documentType: nullableString.max(40).optional(),
    documentNumber: nullableString.max(60).optional(),
    position: nullableString.max(80).optional(),
    department: nullableString.max(80).optional(),
    phone: nullableString.max(40).optional(),
    workEmail: Joi.string().email().allow('', null).optional(),
    status: Joi.string().valid(...Object.values(EMPLOYEE_STATUS)).optional(),
    hireDate: Joi.date().allow(null).optional(),
    leaveDate: Joi.date().allow(null).optional(),
    notes: nullableString.max(1000).optional(),
    userId: objectId.allow('', null).optional(),
});

export const validateEmployeeUpdate = validateEmployeeCreate.fork(['fullName'], (schema) => schema.optional());

export const validateEmployeeInvitationCreate = Joi.object({
    email: Joi.string().email().optional(),
});

export const validateEmployeeInvitationAccept = Joi.object({
    token: Joi.string().min(20).max(200).required(),
});
