const serializeCompany = (company) => {
    if (!company) return null;
    const plain = typeof company.toObject === 'function' ? company.toObject() : company;
    const id = plain._id || plain.id || company;
    return {
        _id: id,
        name: plain.name,
        legalName: plain.legalName,
        taxId: plain.taxId,
        status: plain.status,
        plan: plain.plan,
        timezone: plain.timezone,
        currency: plain.currency,
        logoUrl: plain.logoUrl,
    };
};

export const serializeMembership = (membership) => {
    const company = serializeCompany(membership.companyId);
    return {
        companyId: company?._id || membership.companyId,
        company,
        role: membership.role,
        status: membership.status,
    };
};

export const serializeCompanyContext = ({ user, memberships = [], activeMembership = null }) => {
    const serializedMemberships = memberships.map(serializeMembership);
    const active = activeMembership ? serializeMembership(activeMembership) : serializedMemberships[0] || null;

    return {
        user,
        companies: serializedMemberships,
        activeCompany: active?.company || null,
        activeCompanyId: active?.companyId || null,
        companyRole: active?.role || null,
    };
};
