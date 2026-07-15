import CompanyRepository from '../repositories/company-repository.mjs';
import CompanyMemberRepository from '../repositories/companyMember-repository.mjs';
import CompanyInvitationRepository from '../repositories/companyInvitation-repository.mjs';
import UserRepository from '../repositories/user-repository.mjs';
import mongoose from 'mongoose';
import {
    COMPANY_ADMIN_ROLES,
    COMPANY_INVITATION_STATUS,
    COMPANY_MEMBER_STATUS,
    COMPANY_ROLES,
} from '../constants/companyRoles.mjs';
import { createInvitationToken, hashInvitationToken } from '../utils/invitation-token.mjs';
import { serializeMembership } from '../utils/company-context.mjs';
import { switchActiveCompany as switchActiveCompanyController } from './user-controller.mjs';
import { sendCompanyInvitation } from '../services/email-service.mjs';
import { createError } from '../error/create-error.mjs';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const canAdminCompany = (role) => COMPANY_ADMIN_ROLES.includes(role);

const isProduction = () => process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

const serializeInvitation = (invitation) => {
    const plain = typeof invitation?.toObject === 'function' ? invitation.toObject() : invitation;
    if (!plain) return null;
    const { tokenHash, __v, ...safeInvitation } = plain;
    return safeInvitation;
};

const runSerializedMembershipMutation = async ({ companyId, actorUserId }, mutation) => {
    const session = await mongoose.startSession();
    let result;
    try {
        // El driver reintenta el callback completo ante TransientTransactionError y el commit ante resultado incierto.
        await session.withTransaction(async () => {
            const companyRepo = new CompanyRepository();
            const lockedCompany = await companyRepo.lockForMembershipUpdate(companyId, session);
            if (!lockedCompany) throw createError('Empresa no encontrada', 404);
            const memberRepo = new CompanyMemberRepository();
            const actorMembership = await memberRepo.findMembership({ userId: actorUserId, companyId }, session);
            if (
                actorMembership?.status !== COMPANY_MEMBER_STATUS.ACTIVE
                || !canAdminCompany(actorMembership.role)
            ) {
                throw createError('No tienes permisos para administrar miembros', 403);
            }
            result = await mutation(session, actorMembership);
        });
        return result;
    } finally {
        await session.endSession();
    }
};

export const getMyCompanies = async (req, res) => {
    const memberships = (req.companyMemberships || []).map(serializeMembership);
    return res.status(200).json({
        companies: memberships,
        activeCompany: req.company || null,
        activeCompanyId: req.companyId || null,
        companyRole: req.companyRole || null,
    });
};

export const createCompany = async (req, res) => {
    try {
        const { name, legalName, taxId, timezone, currency } = req.body;

        const companyRepo = new CompanyRepository();
        const memberRepo = new CompanyMemberRepository();
        const company = await companyRepo.createOne({
            name,
            legalName,
            taxId,
            timezone,
            currency,
            createdByUserId: req.user.id,
        });
        const member = await memberRepo.createOne({
            companyId: company._id,
            userId: req.user.id,
            role: COMPANY_ROLES.OWNER,
            joinedAt: new Date(),
        });

        return res.status(201).json({ company, member });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'No pudo crear la empresa' });
    }
};

export const updateCompany = async (req, res) => {
    try {
        if (!canAdminCompany(req.companyRole)) {
            return res.status(403).json({ message: 'No tienes permisos para administrar esta empresa' });
        }

        const companyRepo = new CompanyRepository();
        const updated = await companyRepo.updateById(req.companyId, req.body);

        if (!updated) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }

        return res.status(200).json({ company: updated });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'No pudo actualizar la empresa' });
    }
};

export const getCompanyMembers = async (req, res) => {
    const memberRepo = new CompanyMemberRepository();
    const members = await memberRepo.findActiveByCompanyId(req.companyId);
    return res.status(200).json({ members });
};

export const updateCompanyMemberRole = async (req, res) => {
    try {
        if (!canAdminCompany(req.companyRole)) {
            return res.status(403).json({ message: 'No tienes permisos para administrar miembros' });
        }

        const updated = await runSerializedMembershipMutation({
            companyId: req.companyId,
            actorUserId: req.user.id,
        }, async (session, actorMembership) => {
            const memberRepo = new CompanyMemberRepository();
            const target = await memberRepo.getActiveByIdForCompany(req.params.id, req.companyId, session);
            if (!target) throw createError('Miembro no encontrado', 404);
            if (actorMembership.role === COMPANY_ROLES.ADMIN && target.role === COMPANY_ROLES.OWNER) {
                throw createError('Un administrador no puede modificar a un propietario', 403);
            }
            if (req.body.role === COMPANY_ROLES.OWNER && actorMembership.role !== COMPANY_ROLES.OWNER) {
                throw createError('Solo un propietario puede asignar ese rol', 403);
            }
            if (target.role === COMPANY_ROLES.OWNER && req.body.role !== COMPANY_ROLES.OWNER) {
                const ownerCount = await memberRepo.countActiveOwners(req.companyId, session);
                if (ownerCount <= 1) throw createError('La empresa debe conservar al menos un propietario', 409);
            }

            const member = await memberRepo.updateByIdForCompany(
                req.params.id,
                req.companyId,
                { role: req.body.role },
                session,
            );
            if (!member) throw createError('Miembro no encontrado', 404);
            return member;
        });

        return res.status(200).json({ member: updated });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || 'No pudo actualizar el miembro' });
    }
};

export const removeCompanyMember = async (req, res) => {
    try {
        if (!canAdminCompany(req.companyRole)) {
            return res.status(403).json({ message: 'No tienes permisos para administrar miembros' });
        }
        await runSerializedMembershipMutation({
            companyId: req.companyId,
            actorUserId: req.user.id,
        }, async (session, actorMembership) => {
            const memberRepo = new CompanyMemberRepository();
            const target = await memberRepo.getActiveByIdForCompany(req.params.id, req.companyId, session);
            if (!target) throw createError('Miembro no encontrado', 404);
            if (String(target._id) === String(actorMembership._id)) {
                throw createError('No puedes desactivar tu propia membresia', 400);
            }
            if (actorMembership.role === COMPANY_ROLES.ADMIN && target.role === COMPANY_ROLES.OWNER) {
                throw createError('Un administrador no puede desactivar a un propietario', 403);
            }
            if (target.role === COMPANY_ROLES.OWNER) {
                const ownerCount = await memberRepo.countActiveOwners(req.companyId, session);
                if (ownerCount <= 1) throw createError('La empresa debe conservar al menos un propietario', 409);
            }

            const removed = await memberRepo.deleteByIdForCompany(req.params.id, req.companyId, session);
            if (!removed) throw createError('Miembro no encontrado', 404);
            return removed;
        });

        return res.status(200).json({ message: 'Miembro desactivado correctamente' });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || 'No pudo desactivar el miembro' });
    }
};

export const createCompanyInvitation = async (req, res) => {
    try {
        if (!canAdminCompany(req.companyRole)) {
            return res.status(403).json({ message: 'No tienes permisos para invitar usuarios' });
        }

        const { email, role } = req.body;

        const invitationRepo = new CompanyInvitationRepository();
        const userRepo = new UserRepository();
        const memberRepo = new CompanyMemberRepository();
        const normalizedEmail = normalizeEmail(email);
        const existingUser = await userRepo.getByEmail(normalizedEmail);
        if (!existingUser) {
            return res.status(404).json({ message: 'El usuario debe tener una cuenta antes de ser invitado' });
        }
        const membership = await memberRepo.findMembership({ userId: existingUser._id, companyId: req.companyId });
        if (membership?.status === COMPANY_MEMBER_STATUS.ACTIVE) {
            return res.status(409).json({ message: 'El usuario ya es miembro activo de esta empresa' });
        }
        const existingInvitation = await invitationRepo.getOpenByCompanyAndEmail(req.companyId, normalizedEmail);
        if (existingInvitation) {
            return res.status(409).json({ message: 'Ya existe una invitacion vigente para este email' });
        }

        const token = createInvitationToken();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        let invitation = await invitationRepo.createOne({
            companyId: req.companyId,
            email: normalizedEmail,
            role,
            tokenHash: hashInvitationToken(token),
            status: COMPANY_INVITATION_STATUS.PENDING,
            sentAt: null,
            expiresAt,
            createdByUserId: req.user.id,
        });

        let delivery;
        try {
            delivery = await sendCompanyInvitation({
                to: normalizedEmail,
                companyName: req.company?.name,
                inviterName: req.user?.email,
                role,
                token,
            });
            invitation = await invitationRepo.markSent(invitation._id);
        } catch (deliveryError) {
            console.error('Company invitation delivery failed:', deliveryError.message);
            return res.status(503).json({
                message: 'La invitacion quedo pendiente porque no pudo enviarse el email',
                code: 'EMAIL_DELIVERY_FAILED',
                invitation: serializeInvitation(invitation),
            });
        }

        const response = {
            invitation: serializeInvitation(invitation),
            emailDeliveryProvider: delivery.provider,
        };
        if (!isProduction()) {
            response.token = token;
            response.acceptUrl = delivery.invitationUrl;
        }

        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message || 'No pudo crear la invitacion' });
    }
};

export const getCompanyInvitations = async (req, res) => {
    if (!canAdminCompany(req.companyRole)) {
        return res.status(403).json({ message: 'No tienes permisos para ver invitaciones' });
    }

    const invitationRepo = new CompanyInvitationRepository();
    const invitations = await invitationRepo.getAllByCompany(req.companyId);
    return res.status(200).json({ invitations: invitations.map(serializeInvitation) });
};

export const revokeCompanyInvitation = async (req, res) => {
    try {
        if (!canAdminCompany(req.companyRole)) {
            return res.status(403).json({ message: 'No tienes permisos para revocar invitaciones' });
        }

        const invitationRepo = new CompanyInvitationRepository();
        const invitation = await invitationRepo.revokeByIdForCompany(req.params.id, req.companyId);
        if (!invitation) {
            return res.status(404).json({ message: 'Invitacion no encontrada' });
        }

        return res.status(200).json({ invitation: serializeInvitation(invitation) });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'No pudo revocar la invitacion' });
    }
};

export const switchActiveCompany = switchActiveCompanyController;
