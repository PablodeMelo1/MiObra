import mongoose from 'mongoose';
import EmployeeRepository from '../repositories/employee-repository.mjs';
import EmployeeInvitationRepository from '../repositories/employeeInvitation-repository.mjs';
import CompanyMemberRepository from '../repositories/companyMember-repository.mjs';
import UserRepository from '../repositories/user-repository.mjs';
import { COMPANY_ADMIN_ROLES, COMPANY_ROLES } from '../constants/companyRoles.mjs';
import { EMPLOYEE_INVITATION_STATUS } from '../constants/employeeStatus.mjs';
import { createInvitationToken, hashInvitationToken } from '../utils/invitation-token.mjs';
import { buildEmployeeInvitationUrl, sendEmployeeInvitation } from '../services/email-service.mjs';

const EMPLOYEE_INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const normalizeEmail = (email) => {
    const value = String(email || '').trim().toLowerCase();
    return value || null;
};

const canAdminCompany = (role) => COMPANY_ADMIN_ROLES.includes(role);

const sanitizeEmployeePayload = (payload = {}) => {
    const workEmail = normalizeEmail(payload.workEmail);
    return {
        fullName: payload.fullName?.trim(),
        documentType: payload.documentType?.trim() || '',
        documentNumber: payload.documentNumber?.trim() || '',
        position: payload.position?.trim() || '',
        department: payload.department?.trim() || '',
        phone: payload.phone?.trim() || '',
        workEmail,
        status: payload.status,
        hireDate: payload.hireDate || null,
        leaveDate: payload.leaveDate || null,
        notes: payload.notes?.trim() || '',
        userId: payload.userId || null,
    };
};

const sanitizeEmployeeUpdatePayload = (payload = {}) => {
    const update = {};
    const stringFields = ['fullName', 'documentType', 'documentNumber', 'position', 'department', 'phone', 'notes'];
    stringFields.forEach((field) => {
        if (Object.hasOwn(payload, field)) update[field] = payload[field]?.trim() || '';
    });
    if (Object.hasOwn(payload, 'workEmail')) update.workEmail = normalizeEmail(payload.workEmail);
    if (Object.hasOwn(payload, 'status')) update.status = payload.status;
    if (Object.hasOwn(payload, 'hireDate')) update.hireDate = payload.hireDate || null;
    if (Object.hasOwn(payload, 'leaveDate')) update.leaveDate = payload.leaveDate || null;
    if (Object.hasOwn(payload, 'userId')) update.userId = payload.userId || null;
    return update;
};

const getValidEmployeeInvitation = async ({ token, email = null }) => {
    const invitationRepo = new EmployeeInvitationRepository();
    const invitation = await invitationRepo.getByTokenHash(hashInvitationToken(token));

    if (!invitation) {
        const error = new Error('Invitacion de empleado no encontrada');
        error.statusCode = 404;
        throw error;
    }
    if (![EMPLOYEE_INVITATION_STATUS.SENT, EMPLOYEE_INVITATION_STATUS.PENDING].includes(invitation.status)) {
        const error = new Error('La invitacion de empleado no esta disponible');
        error.statusCode = 409;
        throw error;
    }
    if (invitation.expiresAt && invitation.expiresAt.getTime() < Date.now()) {
        const error = new Error('La invitacion de empleado expiro');
        error.statusCode = 409;
        throw error;
    }
    if (email && normalizeEmail(invitation.email) !== normalizeEmail(email)) {
        const error = new Error('El email de la cuenta no coincide con la invitacion de empleado');
        error.statusCode = 403;
        throw error;
    }

    return invitation;
};

export const acceptEmployeeInvitationForUser = async ({ token, user, session = null }) => {
    const invitation = await getValidEmployeeInvitation({ token, email: user.email });
    const employeeRepo = new EmployeeRepository();
    const invitationRepo = new EmployeeInvitationRepository();
    const employee = invitation.employeeId;
    const employeeCompanyId = employee?.companyId || invitation.companyId;

    if (employee?.userId && String(employee.userId) !== String(user._id)) {
        const error = new Error('El empleado ya esta vinculado a otra cuenta');
        error.statusCode = 409;
        throw error;
    }

    const existingEmployeeForUser = await employeeRepo.getByUserIdForCompany(user._id, employeeCompanyId);
    if (existingEmployeeForUser && String(existingEmployeeForUser._id) !== String(employee._id)) {
        const error = new Error('Esta cuenta ya esta vinculada a otro empleado de la empresa');
        error.statusCode = 409;
        throw error;
    }

    const memberRepo = new CompanyMemberRepository();
    const membership = await memberRepo.findActiveMembership({ userId: user._id, companyId: employeeCompanyId });
    if (!membership) {
        await memberRepo.createOne({
            companyId: employeeCompanyId,
            userId: user._id,
            role: COMPANY_ROLES.OPERATOR,
            invitedByUserId: invitation.createdByUserId,
            joinedAt: new Date(),
        }, session);
    }

    const linkedEmployee = await employeeRepo.linkUser(employee._id, employeeCompanyId, user._id, session);
    await invitationRepo.acceptById(invitation._id, user._id, session);
    return linkedEmployee;
};

export const getEmployees = async (req, res) => {
    const employeeRepo = new EmployeeRepository();
    const employees = await employeeRepo.getAllByCompany(req.companyId);
    return res.status(200).json({ employees });
};

export const getEmployeeById = async (req, res) => {
    const employeeRepo = new EmployeeRepository();
    const employee = await employeeRepo.getByIdForCompany(req.params.id, req.companyId);
    if (!employee) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    return res.status(200).json({ employee });
};

export const createEmployee = async (req, res) => {
    try {
        const employeeRepo = new EmployeeRepository();
        const payload = sanitizeEmployeePayload(req.body);
        if (!payload.fullName) {
            return res.status(400).json({ message: 'fullName es obligatorio' });
        }

        if (payload.userId) {
            const memberRepo = new CompanyMemberRepository();
            const membership = await memberRepo.findActiveMembership({ userId: payload.userId, companyId: req.companyId });
            if (!membership) {
                return res.status(403).json({ message: 'El usuario vinculado no pertenece a la empresa activa' });
            }
            const existing = await employeeRepo.getByUserIdForCompany(payload.userId, req.companyId);
            if (existing) {
                return res.status(409).json({ message: 'Ese usuario ya esta vinculado a un empleado' });
            }
        }

        const employee = await employeeRepo.createOne({
            ...payload,
            companyId: req.companyId,
            createdByUserId: req.user.id,
        });
        return res.status(201).json({ employee });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'No pudo crear el empleado' });
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const employeeRepo = new EmployeeRepository();
        const current = await employeeRepo.getByIdForCompany(req.params.id, req.companyId);
        if (!current) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        const payload = sanitizeEmployeeUpdatePayload(req.body);
        if (Object.hasOwn(payload, 'fullName') && !payload.fullName) {
            return res.status(400).json({ message: 'fullName no puede quedar vacio' });
        }

        if (payload.userId) {
            const memberRepo = new CompanyMemberRepository();
            const membership = await memberRepo.findActiveMembership({ userId: payload.userId, companyId: req.companyId });
            if (!membership) {
                return res.status(403).json({ message: 'El usuario vinculado no pertenece a la empresa activa' });
            }
            const existing = await employeeRepo.getByUserIdForCompany(payload.userId, req.companyId);
            if (existing && String(existing._id) !== String(req.params.id)) {
                return res.status(409).json({ message: 'Ese usuario ya esta vinculado a otro empleado' });
            }
        }

        const employee = await employeeRepo.updateByIdForCompany(req.params.id, req.companyId, payload);
        return res.status(200).json({ employee });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'No pudo actualizar el empleado' });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        if (!canAdminCompany(req.companyRole)) {
            return res.status(403).json({ message: 'No tienes permisos para eliminar empleados' });
        }
        const employeeRepo = new EmployeeRepository();
        const deleted = await employeeRepo.deleteByIdForCompany(req.params.id, req.companyId);
        if (!deleted) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }
        return res.status(200).json({ message: 'Empleado eliminado correctamente' });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'No pudo eliminar el empleado' });
    }
};

export const createEmployeeInvitation = async (req, res) => {
    try {
        if (!canAdminCompany(req.companyRole)) {
            return res.status(403).json({ message: 'No tienes permisos para invitar empleados' });
        }

        const employeeRepo = new EmployeeRepository();
        const employee = await employeeRepo.getByIdForCompany(req.params.id, req.companyId);
        if (!employee) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }
        if (employee.userId) {
            return res.status(409).json({ message: 'El empleado ya esta vinculado a una cuenta' });
        }

        const email = normalizeEmail(req.body?.email) || employee.workEmail;
        if (!email) {
            return res.status(400).json({ message: 'El empleado necesita un email para enviar invitacion' });
        }

        const token = createInvitationToken();
        const invitationRepo = new EmployeeInvitationRepository();
        const invitation = await invitationRepo.createOne({
            companyId: req.companyId,
            employeeId: employee._id,
            email,
            tokenHash: hashInvitationToken(token),
            status: EMPLOYEE_INVITATION_STATUS.SENT,
            sentAt: new Date(),
            expiresAt: new Date(Date.now() + EMPLOYEE_INVITATION_TTL_MS),
            createdByUserId: req.user.id,
        });
        const delivery = await sendEmployeeInvitation({
            to: email,
            employeeName: employee.fullName,
            companyName: req.company?.name,
            token,
        });

        return res.status(201).json({
            invitation,
            emailDeliveryProvider: delivery.provider,
            ...(process.env.NODE_ENV !== 'production' ? { token, acceptUrl: buildEmployeeInvitationUrl(token) } : {}),
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || 'No pudo crear la invitacion de empleado' });
    }
};

export const getEmployeeInvitations = async (req, res) => {
    if (!canAdminCompany(req.companyRole)) {
        return res.status(403).json({ message: 'No tienes permisos para ver invitaciones de empleados' });
    }
    const invitationRepo = new EmployeeInvitationRepository();
    const invitations = await invitationRepo.getAllByCompany(req.companyId);
    return res.status(200).json({ invitations });
};

export const revokeEmployeeInvitation = async (req, res) => {
    try {
        if (!canAdminCompany(req.companyRole)) {
            return res.status(403).json({ message: 'No tienes permisos para revocar invitaciones de empleados' });
        }
        const invitationRepo = new EmployeeInvitationRepository();
        const invitation = await invitationRepo.revokeByIdForCompany(req.params.invitationId, req.companyId);
        if (!invitation) {
            return res.status(404).json({ message: 'Invitacion de empleado no encontrada' });
        }
        return res.status(200).json({ invitation });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'No pudo revocar la invitacion de empleado' });
    }
};

export const acceptEmployeeInvitation = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const userRepo = new UserRepository();
        const user = await userRepo.getById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        let linkedEmployee;
        await session.withTransaction(async () => {
            linkedEmployee = await acceptEmployeeInvitationForUser({
                token: req.body.token || req.params.token,
                user,
                session,
            });
        });

        return res.status(200).json({ employee: linkedEmployee, message: 'Cuenta vinculada al empleado correctamente' });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || 'No pudo aceptar la invitacion de empleado' });
    } finally {
        await session.endSession();
    }
};
