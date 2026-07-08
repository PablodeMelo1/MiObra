import CompanyRepository from '../repositories/company-repository.mjs';
import CompanyMemberRepository from '../repositories/companyMember-repository.mjs';
import CompanyInvitationRepository from '../repositories/companyInvitation-repository.mjs';
import { COMPANY_ADMIN_ROLES, COMPANY_INVITATION_STATUS, COMPANY_ROLES } from '../constants/companyRoles.mjs';
import { createInvitationToken, hashInvitationToken } from '../utils/invitation-token.mjs';
import { serializeMembership } from '../utils/company-context.mjs';
import { switchActiveCompany as switchActiveCompanyController } from './user-controller.mjs';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const canAdminCompany = (role) => COMPANY_ADMIN_ROLES.includes(role);

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
        const { name, legalName, taxId, timezone, currency } = req.body || {};
        if (!name) {
            return res.status(400).json({ message: 'El nombre de la empresa es obligatorio' });
        }

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
        const { name, legalName, taxId, timezone, currency, logoUrl } = req.body || {};
        const updated = await companyRepo.updateById(req.companyId, {
            name,
            legalName,
            taxId,
            timezone,
            currency,
            logoUrl,
        });

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

        const { role } = req.body || {};
        if (!role || !Object.values(COMPANY_ROLES).includes(role)) {
            return res.status(400).json({ message: 'Rol de empresa invalido' });
        }

        const memberRepo = new CompanyMemberRepository();
        const updated = await memberRepo.updateByIdForCompany(req.params.id, req.companyId, { role });
        if (!updated) {
            return res.status(404).json({ message: 'Miembro no encontrado' });
        }

        return res.status(200).json({ member: updated });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'No pudo actualizar el miembro' });
    }
};

export const removeCompanyMember = async (req, res) => {
    try {
        if (!canAdminCompany(req.companyRole)) {
            return res.status(403).json({ message: 'No tienes permisos para administrar miembros' });
        }
        if (String(req.params.id) === String(req.companyMember?._id)) {
            return res.status(400).json({ message: 'No puedes desactivar tu propia membresia' });
        }

        const memberRepo = new CompanyMemberRepository();
        const removed = await memberRepo.deleteByIdForCompany(req.params.id, req.companyId);
        if (!removed) {
            return res.status(404).json({ message: 'Miembro no encontrado' });
        }

        return res.status(200).json({ message: 'Miembro desactivado correctamente' });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'No pudo desactivar el miembro' });
    }
};

export const createCompanyInvitation = async (req, res) => {
    try {
        if (!canAdminCompany(req.companyRole)) {
            return res.status(403).json({ message: 'No tienes permisos para invitar usuarios' });
        }

        const { email, role = COMPANY_ROLES.OPERATOR } = req.body || {};
        if (!email) {
            return res.status(400).json({ message: 'email es requerido' });
        }
        if (!Object.values(COMPANY_ROLES).includes(role)) {
            return res.status(400).json({ message: 'Rol de empresa invalido' });
        }

        const token = createInvitationToken();
        const invitationRepo = new CompanyInvitationRepository();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const invitation = await invitationRepo.createOne({
            companyId: req.companyId,
            email: normalizeEmail(email),
            role,
            tokenHash: hashInvitationToken(token),
            status: COMPANY_INVITATION_STATUS.SENT,
            sentAt: new Date(),
            expiresAt,
            createdByUserId: req.user.id,
        });

        return res.status(201).json({
            invitation,
            token,
            acceptUrl: `/register?invitationToken=${token}`,
        });
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
    return res.status(200).json({ invitations });
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

        return res.status(200).json({ invitation });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'No pudo revocar la invitacion' });
    }
};

export const switchActiveCompany = switchActiveCompanyController;
