import UserRepository from '../repositories/user-repository.mjs';
import CompanyRepository from '../repositories/company-repository.mjs';
import CompanyMemberRepository from '../repositories/companyMember-repository.mjs';
import CompanyInvitationRepository from '../repositories/companyInvitation-repository.mjs';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../error/create-error.mjs';
import { COMPANY_INVITATION_STATUS, COMPANY_MEMBER_STATUS, COMPANY_ROLES } from '../constants/companyRoles.mjs';
import { createInvitationToken, hashInvitationToken } from '../utils/invitation-token.mjs';
import { serializeCompanyContext } from '../utils/company-context.mjs';
import { buildEmailVerificationUrl, sendEmailVerification } from '../services/email-service.mjs';
import { acceptEmployeeInvitationForUser } from './employee-controller.mjs';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const EMAIL_VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000;
const EMAIL_VERIFICATION_RATE_WINDOW_MS = 15 * 60 * 1000;
const EMAIL_VERIFICATION_RATE_LIMIT = 3;
const EMAIL_VERIFICATION_RESEND_GENERIC_RESPONSE = {
    message: 'Si existe una cuenta pendiente, enviaremos un nuevo email de verificacion.',
};
const emailVerificationAttempts = new Map();

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
    const { passwordHash, emailVerificationTokenHash, __v, ...safeUser } = plainUser;
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

const isProduction = () => process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

const isEmailVerified = (user) => !user?.emailVerificationStatus || user.emailVerificationStatus === 'verified';

const createEmailVerificationFields = () => {
    const token = createInvitationToken();
    return {
        token,
        fields: {
            emailVerificationStatus: 'pending',
            emailVerifiedAt: null,
            emailVerificationTokenHash: hashInvitationToken(token),
            emailVerificationTokenExpiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
            emailVerificationLastSentAt: null,
        },
    };
};

const serializeEmailVerificationResponse = ({ user, token = null, delivery = null, deliveryFailed = false }) => {
    const payload = {
        message: deliveryFailed
            ? 'Cuenta creada, pero no pudimos enviar la verificacion. Solicita un nuevo envio.'
            : 'Cuenta creada. Revisa tu email para verificarla antes de iniciar sesion.',
        email: user.email,
        emailVerificationStatus: user.emailVerificationStatus,
        emailVerificationExpiresAt: user.emailVerificationTokenExpiresAt,
        emailDeliveryStatus: deliveryFailed ? 'failed' : 'sent',
    };

    if (delivery?.provider) {
        payload.emailDeliveryProvider = delivery.provider;
    }

    if (token && !isProduction()) {
        payload.devVerificationUrl = buildEmailVerificationUrl(token);
    }

    return payload;
};

const getRateLimitKey = (req, email) => `${req.ip || 'unknown'}:${normalizeEmail(email)}`;

const assertEmailVerificationRateLimit = (req, email) => {
    const key = getRateLimitKey(req, email);
    const now = Date.now();
    const attempts = (emailVerificationAttempts.get(key) || []).filter((timestamp) => (
        now - timestamp < EMAIL_VERIFICATION_RATE_WINDOW_MS
    ));

    if (attempts.length >= EMAIL_VERIFICATION_RATE_LIMIT) {
        throw createError('Demasiados intentos. Espera unos minutos antes de reenviar la verificacion.', 429);
    }

    attempts.push(now);
    emailVerificationAttempts.set(key, attempts);
};

const sendVerificationForUser = async ({ user, token }) => (
    sendEmailVerification({ to: user.email, name: user.name, token })
);

const recordSuccessfulVerificationDelivery = async (userRepo, userId) => userRepo.updateById(userId, {
    $set: { emailVerificationLastSentAt: new Date() },
    $inc: { emailVerificationSentCount: 1 },
});

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
    if (invitation.status !== COMPANY_INVITATION_STATUS.SENT) {
        throw createError('La invitacion no esta disponible', 409);
    }
    if (invitation.expiresAt && invitation.expiresAt.getTime() < Date.now()) {
        throw createError('La invitacion expiro', 409);
    }
    if (normalizeEmail(invitation.email) !== normalizeEmail(email)) {
        const mismatchError = createError('Esta invitacion fue enviada a otra cuenta', 403);
        mismatchError.code = 'INVITATION_EMAIL_MISMATCH';
        throw mismatchError;
    }

    return invitation;
};

const acceptInvitationForUser = async ({ invitation, user, session = null }) => {
    const invitationRepo = new CompanyInvitationRepository();
    const memberRepo = new CompanyMemberRepository();
    const companyId = invitation.companyId?._id || invitation.companyId;

    const acceptWithSession = async (activeSession) => {
        const existingMember = await memberRepo.findMembership({ userId: user._id, companyId }, activeSession);
        if (existingMember?.status === COMPANY_MEMBER_STATUS.DISABLED) {
            const reactivated = await memberRepo.reactivateByUserAndCompany({
                userId: user._id,
                companyId,
                role: invitation.role,
                invitedByUserId: invitation.createdByUserId,
            }, activeSession);
            if (!reactivated) throw createError('No pudo reactivarse la membresia', 409);
        } else if (!existingMember) {
            await memberRepo.createOne({
                companyId,
                userId: user._id,
                role: invitation.role,
                invitedByUserId: invitation.createdByUserId,
                joinedAt: new Date(),
            }, activeSession);
        }

        const accepted = await invitationRepo.acceptById(invitation._id, user._id, activeSession);
        if (!accepted) throw createError('La invitacion ya no esta disponible', 409);
        return companyId;
    };

    if (session) return acceptWithSession(session);

    const ownSession = await mongoose.startSession();
    let activeCompanyId;
    try {
        await ownSession.withTransaction(async () => {
            activeCompanyId = await acceptWithSession(ownSession);
        });
        return activeCompanyId;
    } finally {
        await ownSession.endSession();
    }
};

export const createUser = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const companyRepo = new CompanyRepository();
        const memberRepo = new CompanyMemberRepository();
        const { name, email, password, companyName, employeeInvitationToken } = req.body;
        if (!name || !email || !password || (!companyName && !employeeInvitationToken)) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        const normalizedEmail = normalizeEmail(email);
        const existing = await userRepo.getByEmail(normalizedEmail);
        if (existing) {
            return res.status(409).json({ message: 'El email ya esta registrado' });
        }
        let activeCompanyId;
        let createdUser;
        const verification = createEmailVerificationFields();
        const session = await mongoose.startSession();
        try {
            await session.withTransaction(async () => {
                const passwordHash = await bcrypt.hash(password, 10);
                const newUser = {
                    name,
                    email: normalizedEmail,
                    passwordHash,
                    ...verification.fields,
                    emailVerificationSentCount: 0,
                };
                createdUser = await userRepo.createOne(newUser, session);

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
                if (employeeInvitationToken) {
                    await acceptEmployeeInvitationForUser({
                        token: employeeInvitationToken,
                        user: createdUser,
                        session,
                    });
                }
            });
        } finally {
            await session.endSession();
        }

        let delivery = null;
        let deliveryFailed = false;
        try {
            delivery = await sendVerificationForUser({ user: createdUser, token: verification.token });
            try {
                createdUser = await recordSuccessfulVerificationDelivery(userRepo, createdUser._id);
            } catch (metadataError) {
                console.error('Email verification delivery metadata update failed:', metadataError.message);
            }
        } catch (deliveryError) {
            deliveryFailed = true;
            console.error('Email verification delivery failed:', deliveryError.message);
        }

        res.status(201).json(serializeEmailVerificationResponse({
            user: createdUser,
            token: verification.token,
            delivery,
            deliveryFailed,
        }));
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
            if (!isEmailVerified(user)) {
                return res.status(403).json({
                    message: 'Debes verificar tu email antes de iniciar sesion',
                    code: 'EMAIL_NOT_VERIFIED',
                    email: user.email,
                    emailVerificationStatus: user.emailVerificationStatus,
                });
            }
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

export const confirmEmailVerification = async (req, res) => {
    try {
        const { token } = req.body;
        const userRepo = new UserRepository();
        const tokenHash = hashInvitationToken(token);
        const user = await userRepo.getByEmailVerificationTokenHash(tokenHash);

        if (!user) {
            return res.status(404).json({ message: 'Token de verificacion no encontrado' });
        }
        if (isEmailVerified(user)) {
            return res.status(200).json({ message: 'El email ya estaba verificado', user: serializeUser(user) });
        }
        if (!user.emailVerificationTokenExpiresAt || user.emailVerificationTokenExpiresAt.getTime() < Date.now()) {
            return res.status(409).json({ message: 'El token de verificacion expiro. Solicita un nuevo envio.' });
        }

        const updatedUser = await userRepo.updateById(user._id, {
            emailVerificationStatus: 'verified',
            emailVerifiedAt: new Date(),
            emailVerificationTokenHash: null,
            emailVerificationTokenExpiresAt: null,
        });

        return res.status(200).json({ message: 'Email verificado correctamente. Ya puedes iniciar sesion.', user: serializeUser(updatedUser) });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || 'No pudo verificarse el email' });
    }
};

export const resendEmailVerification = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        assertEmailVerificationRateLimit(req, email);

        const userRepo = new UserRepository();
        const user = await userRepo.getByEmail(email);
        if (!user || isEmailVerified(user)) {
            return res.status(200).json(EMAIL_VERIFICATION_RESEND_GENERIC_RESPONSE);
        }
        if (
            user.emailVerificationLastSentAt
            && Date.now() - user.emailVerificationLastSentAt.getTime() < EMAIL_VERIFICATION_RESEND_COOLDOWN_MS
        ) {
            return res.status(429).json({ message: 'Espera un minuto antes de reenviar la verificacion.' });
        }

        const verification = createEmailVerificationFields();
        const updatedUser = await userRepo.updateById(user._id, {
            $set: verification.fields,
        });
        let delivery;
        try {
            delivery = await sendVerificationForUser({ user: updatedUser, token: verification.token });
        } catch (deliveryError) {
            console.error('Email verification resend failed:', deliveryError.message);
            return res.status(503).json({
                message: 'No pudimos enviar el email de verificacion. Intenta nuevamente.',
                code: 'EMAIL_DELIVERY_FAILED',
                email: updatedUser.email,
            });
        }
        try {
            await recordSuccessfulVerificationDelivery(userRepo, updatedUser._id);
        } catch (metadataError) {
            console.error('Email verification resend metadata update failed:', metadataError.message);
        }

        return res.status(200).json({
            message: 'Email de verificacion reenviado.',
            email: updatedUser.email,
            emailVerificationStatus: updatedUser.emailVerificationStatus,
            emailVerificationExpiresAt: updatedUser.emailVerificationTokenExpiresAt,
            emailDeliveryProvider: delivery.provider,
            ...(!isProduction() ? { devVerificationUrl: buildEmailVerificationUrl(verification.token) } : {}),
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || 'No pudo reenviarse la verificacion' });
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
        const currentUser = await userRepo.getById(id);
        if (!currentUser) {
            return res.status(404).json({ message: "Usuario no encontrado o no se pudo actualizar" });
        }

        const updateData = {};
        if (req.body?.name) updateData.name = req.body.name;
        if (req.body?.email) {
            const normalizedEmail = normalizeEmail(req.body.email);
            if (normalizedEmail !== currentUser.email) {
                const existing = await userRepo.getByEmail(normalizedEmail);
                if (existing && String(existing._id) !== String(id)) {
                    return res.status(409).json({ message: 'El email ya esta registrado' });
                }
                updateData.email = normalizedEmail;
            }
        }
        const updatedUser = await userRepo.updateById(id, updateData);
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado o no se pudo actualizar" });
        }
        res.status(200).json({ user: serializeUser(updatedUser) });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "No pudo actualizar el usuario" });
    }
};

const getCompanyInvitationForSession = async (req) => {
    const userRepo = new UserRepository();
    const user = await userRepo.getById(req.user.id);
    if (!user) throw createError('Usuario no encontrado', 404);
    const invitation = await getValidInvitation({ token: req.params.token, email: user.email });
    return { user, invitation };
};

const serializeCompanyInvitationPreview = (invitation) => ({
    company: {
        _id: invitation.companyId?._id || invitation.companyId,
        name: invitation.companyId?.name,
    },
    role: invitation.role,
    expiresAt: invitation.expiresAt,
    status: invitation.status,
    email: invitation.email,
});

export const previewCompanyInvitation = async (req, res) => {
    try {
        const { invitation } = await getCompanyInvitationForSession(req);
        return res.status(200).json({ invitation: serializeCompanyInvitationPreview(invitation) });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || 'No pudo obtener la invitacion',
            ...(error.code ? { code: error.code } : {}),
        });
    }
};

export const acceptCompanyInvitation = async (req, res) => {
    try {
        const { user, invitation } = await getCompanyInvitationForSession(req);
        const activeCompanyId = await acceptInvitationForUser({ invitation, user });
        signTokenAndSetCookie(res, user, activeCompanyId);
        const context = await buildAuthContext(user, activeCompanyId);
        return res.status(200).json(context);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || 'No pudo aceptar la invitacion',
            ...(error.code ? { code: error.code } : {}),
        });
    }
};

export const declineCompanyInvitation = async (req, res) => {
    try {
        const { user, invitation } = await getCompanyInvitationForSession(req);
        const invitationRepo = new CompanyInvitationRepository();
        const declined = await invitationRepo.declineById(invitation._id, user._id);
        if (!declined) throw createError('La invitacion ya no esta disponible', 409);
        return res.status(200).json({ message: 'Invitacion rechazada correctamente' });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || 'No pudo rechazarse la invitacion',
            ...(error.code ? { code: error.code } : {}),
        });
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
