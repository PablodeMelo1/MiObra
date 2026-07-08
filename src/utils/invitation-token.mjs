import crypto from 'crypto';

export const createInvitationToken = () => crypto.randomBytes(32).toString('hex');

export const hashInvitationToken = (token) => (
    crypto.createHash('sha256').update(token).digest('hex')
);
