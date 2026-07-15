import nodemailer from 'nodemailer';

const resolveClientUrl = () => (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');

const parseBoolean = (value) => String(value || '').toLowerCase() === 'true';

const escapeHtml = (value) => String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const getSmtpConfig = () => {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) return null;

    return {
        host,
        port: Number(process.env.SMTP_PORT || 587),
        secure: parseBoolean(process.env.SMTP_SECURE),
        auth: { user, pass },
    };
};

const isProduction = () => process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

const sendSmtpMail = async (message) => {
    const smtpConfig = getSmtpConfig();

    if (!smtpConfig) {
        if (isProduction()) {
            throw new Error('Falta configurar SMTP_HOST, SMTP_USER y SMTP_PASS');
        }
        return null;
    }

    const transporter = nodemailer.createTransport(smtpConfig);
    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.EMAIL_FROM || smtpConfig.auth.user,
        ...message,
    });
    return { provider: 'smtp' };
};

export const buildEmailVerificationUrl = (token) => `${resolveClientUrl()}/verify-email?token=${encodeURIComponent(token)}`;

export const sendEmailVerification = async ({ to, name, token }) => {
    const verificationUrl = buildEmailVerificationUrl(token);
    const delivery = await sendSmtpMail({
        to,
        subject: 'Verifica tu cuenta en MiObra',
        html: `
            <p>Hola ${escapeHtml(name)},</p>
            <p>Confirma tu email para activar tu cuenta en MiObra.</p>
            <p><a href="${verificationUrl}">Verificar cuenta</a></p>
            <p>Este link expira en 24 horas.</p>
        `,
        text: `Verifica tu cuenta en MiObra: ${verificationUrl}`,
    });

    if (!delivery) {
        console.info(`[email-verification] ${to}: ${verificationUrl}`);
        return { provider: 'console', verificationUrl };
    }

    return { ...delivery, verificationUrl };
};

export const buildCompanyInvitationUrl = (token) => `${resolveClientUrl()}/company-invitations/accept?token=${encodeURIComponent(token)}`;

export const sendCompanyInvitation = async ({ to, companyName, inviterName, role, token }) => {
    const invitationUrl = buildCompanyInvitationUrl(token);
    const delivery = await sendSmtpMail({
        to,
        subject: `Invitacion para unirte a ${companyName || 'una empresa'} en MiObra`,
        html: `
            <p>Hola,</p>
            <p>${escapeHtml(inviterName || 'Un administrador')} te invito a unirte a ${escapeHtml(companyName || 'su empresa')} en MiObra.</p>
            <p>Tu rol sera: ${escapeHtml(role)}.</p>
            <p><a href="${invitationUrl}">Aceptar invitacion</a></p>
            <p>Este link expira en 7 dias.</p>
        `,
        text: `Acepta la invitacion para unirte a ${companyName || 'la empresa'} en MiObra: ${invitationUrl}`,
    });

    if (!delivery) {
        console.info(`[company-invitation] ${to}: ${invitationUrl}`);
        return { provider: 'console', invitationUrl };
    }

    return { ...delivery, invitationUrl };
};

export const buildEmployeeInvitationUrl = (token) => `${resolveClientUrl()}/employee-invitations/accept?token=${encodeURIComponent(token)}`;

export const sendEmployeeInvitation = async ({ to, employeeName, companyName, token }) => {
    const invitationUrl = buildEmployeeInvitationUrl(token);
    const from = process.env.EMAIL_FROM || 'MiObra <no-reply@miobra.app>';

    if (process.env.RESEND_API_KEY) {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from,
                to,
                subject: 'Vincula tu cuenta de MiObra con tu ficha de empleado',
                html: `
                    <p>Hola ${employeeName || ''},</p>
                    <p>${companyName || 'Tu empresa'} te invito a vincular tu cuenta de MiObra con tu ficha operativa.</p>
                    <p><a href="${invitationUrl}">Aceptar vinculacion</a></p>
                    <p>Este link expira por seguridad.</p>
                `,
                text: `Acepta la vinculacion de empleado en MiObra: ${invitationUrl}`,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`No se pudo enviar la invitacion de empleado: ${errorText}`);
        }

        return { provider: 'resend', invitationUrl };
    }

    console.info(`[employee-invitation] ${to}: ${invitationUrl}`);
    return { provider: 'console', invitationUrl };
};
