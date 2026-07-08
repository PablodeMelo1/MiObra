export const COMPANY_ROLES = Object.freeze({
    OWNER: 'owner',
    ADMIN: 'admin',
    MANAGER: 'manager',
    SUPERVISOR: 'supervisor',
    OPERATOR: 'operator',
    VIEWER: 'viewer',
});

export const COMPANY_MEMBER_STATUS = Object.freeze({
    ACTIVE: 'active',
    INVITED: 'invited',
    DISABLED: 'disabled',
});

export const COMPANY_STATUS = Object.freeze({
    ACTIVE: 'active',
    TRIAL: 'trial',
    SUSPENDED: 'suspended',
    INACTIVE: 'inactive',
});

export const COMPANY_INVITATION_STATUS = Object.freeze({
    PENDING: 'pending',
    SENT: 'sent',
    ACCEPTED: 'accepted',
    EXPIRED: 'expired',
    REVOKED: 'revoked',
});

export const COMPANY_ADMIN_ROLES = [
    COMPANY_ROLES.OWNER,
    COMPANY_ROLES.ADMIN,
];
