const resolveClientUrl = () => (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');

export const buildEmailVerificationUrl = (token) => `${resolveClientUrl()}/verify-email?token=${encodeURIComponent(token)}`;

export const sendEmailVerification = async ({ to, name, token }) => {
    const verificationUrl = buildEmailVerificationUrl(token);
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
                subject: 'Verifica tu cuenta en MiObra',
                html: `
                    <p>Hola ${name || ''},</p>
                    <p>Confirma tu email para activar tu cuenta en MiObra.</p>
                    <p><a href="${verificationUrl}">Verificar cuenta</a></p>
                    <p>Este link expira por seguridad.</p>
                `,
                text: `Verifica tu cuenta en MiObra: ${verificationUrl}`,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`No se pudo enviar el email de verificacion: ${errorText}`);
        }

        return { provider: 'resend', verificationUrl };
    }

    console.info(`[email-verification] ${to}: ${verificationUrl}`);
    return { provider: 'console', verificationUrl };
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
