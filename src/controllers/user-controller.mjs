import UserRepository from '../repositories/user-repository.mjs';
import CompanyRepository from '../repositories/company-repository.mjs';
import CompanyMemberRepository from '../repositories/companyMember-repository.mjs';
import CompanyInvitationRepository from '../repositories/companyInvitation-repository.mjs';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../error/create-error.mjs';
import { COMPANY_INVITATION_STATUS, COMPANY_ROLES } from '../constants/companyRoles.mjs';
import { hashInvitationToken } from '../utils/invitation-token.mjs';
import { serializeCompanyContext } from '../utils/company-context.mjs';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const getCookieOptions = () => {
    const configuredSameSite = String(process.env.COOKIE_SAME_SITE || '').toLowerCase();
    const sameSite = ['strict', 'lax', 'none'].includes(configuredSameSite) ? configuredSameSite : 'lax';
    const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

    return {
        httpOnly: true,
        secure: isProduction || sameSite === 'none',
        sameSite,
        path: '/',
        maxAge: ONE_WEEK_MS,
    };
};

const serializeUser = (user) => {
    const plainUser = typeof user.toObject === 'function' ? user.toObject() : user;
    const { passwordHash, __v, ...safeUser } = plainUser;
    return safeUser;
};

const signTokenAndSetCookie = (res, user, activeCompanyId = null) => {
    if (!process.env.PASS_JWT) {
        throw createError("Falta configurar PASS_JWT", 500);
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, tipoUsuario: user.tipoUsuario, activeCompanyId },
        process.env.PASS_JWT,
        { expiresIn: '7d' }
    );
    res.cookie("token", token, getCookieOptions());
    return token;
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const buildAuthContext = async (user, requestedCompanyId = null) => {
    const memberRepo = new CompanyMemberRepository();
    const memberships = await memberRepo.findActiveByUserId(user._id);
    let activeMembership = memberships[0] || null;

    if (requestedCompanyId) {
        activeMembership = memberships.find((membership) => (
            String(membership.companyId?._id || membership.companyId) === String(requestedCompanyId)
        )) || null;
    }

    return serializeCompanyContext({
        user: serializeUser(user),
        memberships,
        activeMembership,
    });
};

const getValidInvitation = async ({ token, email }) => {
    if (!token) return null;
    const invitationRepo = new CompanyInvitationRepository();
    const tokenHash = hashInvitationToken(token);
    const invitation = await invitationRepo.getByTokenHash(tokenHash);

    if (!invitation) {
        throw createError('Invitacion no encontrada', 404);
    }
    if (invitation.status !== COMPANY_INVITATION_STATUS.SENT && invitation.status !== COMPANY_INVITATION_STATUS.PENDING) {
        throw createError('La invitacion no esta disponible', 409);
    }
    if (invitation.expiresAt && invitation.expiresAt.getTime() < Date.now()) {
        throw createError('La invitacion expiro', 409);
    }
    if (normalizeEmail(invitation.email) !== normalizeEmail(email)) {
        throw createError('El email de la cuenta no coincide con la invitacion', 403);
    }

    return invitation;
};

const acceptInvitationForUser = async ({ invitation, user, session = null }) => {
    const invitationRepo = new CompanyInvitationRepository();
    const memberRepo = new CompanyMemberRepository();
    const existingMember = await memberRepo.findActiveMembership({
        userId: user._id,
        companyId: invitation.companyId?._id || invitation.companyId,
    });
    if (!existingMember) {
        await memberRepo.createOne({
            companyId: invitation.companyId?._id || invitation.companyId,
            userId: user._id,
            role: invitation.role,
            invitedByUserId: invitation.createdByUserId,
            joinedAt: new Date(),
        }, session);
    }
    await invitationRepo.acceptById(invitation._id, user._id, session);
    return invitation.companyId?._id || invitation.companyId;
};

export const createUser = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const companyRepo = new CompanyRepository();
        const memberRepo = new CompanyMemberRepository();
        const { name, email, password, companyName, invitationToken } = req.body;
        if (!name || !email || !password || (!companyName && !invitationToken)) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        const normalizedEmail = normalizeEmail(email);
        const existing = await userRepo.getByEmail(normalizedEmail);
        if (existing) {
            return res.status(409).json({ message: 'El email ya esta registrado' });
        }
        const invitation = await getValidInvitation({ token: invitationToken, email: normalizedEmail });
        let activeCompanyId;
        let createdUser;
        const session = await mongoose.startSession();
        try {
            await session.withTransaction(async () => {
                const passwordHash = await bcrypt.hash(password, 10);
                const newUser = { name, email: normalizedEmail, passwordHash };
                createdUser = await userRepo.createOne(newUser, session);

                if (invitation) {
                    activeCompanyId = await acceptInvitationForUser({ invitation, user: createdUser, session });
                } else {
                    const createdCompany = await companyRepo.createOne({
                        name: companyName,
                        createdByUserId: createdUser._id,
                    }, session);
                    activeCompanyId = createdCompany._id;
                    await memberRepo.createOne({
                        companyId: createdCompany._id,
                        userId: createdUser._id,
                        role: COMPANY_ROLES.OWNER,
                        joinedAt: new Date(),
                    }, session);
                }
            });
        } finally {
            await session.endSession();
        }

        signTokenAndSetCookie(res, createdUser, activeCompanyId);
        const context = await buildAuthContext(createdUser, activeCompanyId);
        res.status(201).json(context);
    } catch (error) {
        console.error('createUser error:', error);
        return res.status(error.statusCode || 500).json({ message: error.message || "No pudo crear el usuario" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRepo = new UserRepository();
        const user = await userRepo.getByEmail(normalizeEmail(email));
        if (!user) {
            return res.status(401).json({ message: "Email o contrasena incorrectos" });
        }
        const passwordHash = user.passwordHash;
        const validatePassword = await bcrypt.compare(password, passwordHash);

        if (validatePassword) {
            const context = await buildAuthContext(user, req.headers['x-company-id']);
            signTokenAndSetCookie(res, user, context.activeCompanyId);
            res.status(200).json(context);
        } else {
            res.status(401).json({ message: "Email o contrasena incorrectos" });
        }
    } catch (error) {
        console.error('loginUser error:', error);
        throw createError(error.message || "Error en login", error.statusCode || 500);
    }
};

export const logout = async (req, res) => {
    try {
        const clearOptions = getCookieOptions();
        delete clearOptions.maxAge;
        res.clearCookie("token", clearOptions);
        res.status(200).json({ message: "Usuario deslogueado exitosamente" });
    }
    catch (error) {
        throw createError("No pudo cerrar sesion", 500);
    }
};

export const verifySession = async (req, res) => {
    try {
        const sessionUser = req.user;
        if (!sessionUser) {
            return res.status(401).json({ message: "No autenticado" });
        }
        const userRepo = new UserRepository();
        const fullUser = await userRepo.getById(sessionUser.id);
        if (!fullUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const context = await buildAuthContext(fullUser, req.companyId || req.user?.activeCompanyId);
        res.status(200).json(context);
    } catch (error) {
        throw createError("No pudo verificar la sesion", 500);
    }
};

export const getUserById = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const memberRepo = new CompanyMemberRepository();
        const { id } = req.params;
        const companyId = req.companyId;
        const memberIds = await memberRepo.findActiveUserIdsByCompanyId(companyId);
        if (!memberIds.some((memberId) => String(memberId) === String(id))) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const user = await userRepo.getById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ user: serializeUser(user) });
    } catch (error) {
        throw createError("No pudo obtener el usuario", 500);
    }
};

export const getAll = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const memberRepo = new CompanyMemberRepository();
        const memberIds = await memberRepo.findActiveUserIdsByCompanyId(req.companyId);
        const users = await userRepo.getAllByIds(memberIds);
        res.status(200).json(users.map(serializeUser));
    } catch (error) {
        throw createError("No pudo obtener los usuarios", 500);
    }
};

export const updateUser = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const { id } = req.params;
        if (String(req.user.id) !== String(id)) {
            return res.status(403).json({ message: "Solo puedes actualizar tu propio perfil" });
        }
        const updateData = {};
        if (req.body?.name) updateData.name = req.body.name;
        if (req.body?.email) updateData.email = normalizeEmail(req.body.email);
        const updatedUser = await userRepo.updateById(id, updateData);
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado o no se pudo actualizar" });
        }
        res.status(200).json(serializeUser(updatedUser));
    } catch (error) {
        throw createError("No pudo actualizar el usuario", 500);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const memberRepo = new CompanyMemberRepository();
        const { id } = req.params;
        if (String(req.user.id) === String(id)) {
            return res.status(400).json({ message: "No puedes quitar tu propia membresia desde este endpoint" });
        }

        const members = await memberRepo.findActiveByCompanyId(req.companyId);
        const member = members.find((companyMember) => String(companyMember.userId?._id || companyMember.userId) === String(id));
        if (!member) {
            return res.status(404).json({ message: "Miembro no encontrado" });
        }

        await memberRepo.deleteByIdForCompany(member._id, req.companyId);
        res.status(200).json({ message: "Membresia desactivada correctamente" });
    } catch (error) {
        throw createError("No pudo desactivar la membresia", 500);
    }
};

export const changeUserRole = async (req, res) => {
    try {
        const memberRepo = new CompanyMemberRepository();
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !Object.values(COMPANY_ROLES).includes(role)) {
            return res.status(400).json({
                message: `Rol invalido. Los roles validos son: ${Object.values(COMPANY_ROLES).join(", ")}`,
            });
        }

        if (String(req.user.id) === String(id)) {
            return res.status(403).json({ message: "No puedes cambiar tu propio rol de empresa" });
        }

        const members = await memberRepo.findActiveByCompanyId(req.companyId);
        const member = members.find((companyMember) => String(companyMember.userId?._id || companyMember.userId) === String(id));
        if (!member) {
            return res.status(404).json({ message: "Miembro no encontrado" });
        }

        const updatedMember = await memberRepo.updateByIdForCompany(member._id, req.companyId, { role });

        res.status(200).json({ message: "Rol de empresa actualizado correctamente", member: updatedMember });
    } catch (error) {
        throw createError("No pudo cambiar el rol del usuario", 500);
    }
};

export const acceptCompanyInvitation = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const user = await userRepo.getById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const invitation = await getValidInvitation({ token: req.params.token, email: user.email });
        const activeCompanyId = await acceptInvitationForUser({ invitation, user });
        signTokenAndSetCookie(res, user, activeCompanyId);
        const context = await buildAuthContext(user, activeCompanyId);
        return res.status(200).json(context);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || 'No pudo aceptar la invitacion' });
    }
};

export const switchActiveCompany = async (req, res) => {
    try {
        const { companyId } = req.body || {};
        if (!companyId) {
            return res.status(400).json({ message: 'companyId es requerido' });
        }

        const userRepo = new UserRepository();
        const memberRepo = new CompanyMemberRepository();
        const user = await userRepo.getById(req.user.id);
        const membership = await memberRepo.findActiveMembership({ userId: req.user.id, companyId });

        if (!user || !membership) {
            return res.status(403).json({ message: 'No tienes acceso a la empresa solicitada' });
        }

        signTokenAndSetCookie(res, user, companyId);
        const context = await buildAuthContext(user, companyId);
        return res.status(200).json(context);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || 'No pudo cambiar la empresa activa' });
    }
};
