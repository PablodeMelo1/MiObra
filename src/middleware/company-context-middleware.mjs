import CompanyMemberRepository from '../repositories/companyMember-repository.mjs';
import { serializeMembership } from '../utils/company-context.mjs';

const getRequestedCompanyId = (req) => (
    req.headers['x-company-id']
    || req.query.companyId
    || req.user?.activeCompanyId
    || null
);

export const loadCompanyContext = ({ required = true } = {}) => async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        const memberRepo = new CompanyMemberRepository();
        const memberships = await memberRepo.findActiveByUserId(userId);
        const requestedCompanyId = getRequestedCompanyId(req);

        if (!memberships.length) {
            if (!required) {
                req.companyMemberships = [];
                return next();
            }
            return res.status(403).json({ message: 'El usuario no pertenece a ninguna empresa activa' });
        }

        let activeMembership = memberships[0];
        if (requestedCompanyId) {
            activeMembership = memberships.find((membership) => (
                String(membership.companyId?._id || membership.companyId) === String(requestedCompanyId)
            ));
            if (!activeMembership) {
                return res.status(403).json({ message: 'No tienes acceso a la empresa solicitada' });
            }
        }

        req.companyMemberships = memberships;
        req.companyMember = activeMembership;
        req.companyId = String(activeMembership.companyId?._id || activeMembership.companyId);
        req.companyRole = activeMembership.role;
        req.company = serializeMembership(activeMembership).company;
        next();
    } catch (error) {
        next(error);
    }
};
