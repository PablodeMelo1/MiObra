import CompanyMember from '../model/companyMember-schema.mjs';
import { COMPANY_MEMBER_STATUS, COMPANY_ROLES } from '../constants/companyRoles.mjs';

const ACTIVE_FILTER = { status: COMPANY_MEMBER_STATUS.ACTIVE };

export default class CompanyMemberRepository {
    async createOne(data, session = null) {
        if (session) {
            const [member] = await CompanyMember.create([data], { session });
            return member;
        }
        const member = new CompanyMember(data);
        return member.save();
    }

    async findActiveByUserId(userId) {
        return CompanyMember.find({ userId, ...ACTIVE_FILTER })
            .populate('companyId', 'name legalName taxId status plan timezone currency logoUrl')
            .sort({ createdAt: 1 });
    }

    async findMembership({ userId, companyId }, session = null) {
        const query = CompanyMember.findOne({ userId, companyId });
        if (session) query.session(session);
        return query;
    }

    async findActiveMembership({ userId, companyId }, session = null) {
        const query = CompanyMember.findOne({ userId, companyId, ...ACTIVE_FILTER })
            .populate('companyId', 'name legalName taxId status plan timezone currency logoUrl');
        if (session) query.session(session);
        return query;
    }

    async findActiveByCompanyId(companyId) {
        return CompanyMember.find({ companyId, ...ACTIVE_FILTER })
            .populate('userId', 'name email tipoUsuario')
            .sort({ createdAt: 1 });
    }

    async getActiveByIdForCompany(id, companyId, session = null) {
        const query = CompanyMember.findOne({ _id: id, companyId, ...ACTIVE_FILTER })
            .populate('userId', 'name email tipoUsuario');
        if (session) query.session(session);
        return query;
    }

    async countActiveOwners(companyId, session = null) {
        const query = CompanyMember.countDocuments({
            companyId,
            ...ACTIVE_FILTER,
            role: COMPANY_ROLES.OWNER,
        });
        if (session) query.session(session);
        return query;
    }

    async findActiveUserIdsByCompanyId(companyId) {
        const members = await CompanyMember.find({ companyId, ...ACTIVE_FILTER }).select('userId');
        return members.map((member) => member.userId);
    }

    async updateByIdForCompany(id, companyId, data, session = null) {
        return CompanyMember.findOneAndUpdate(
            { _id: id, companyId, ...ACTIVE_FILTER },
            data,
            { new: true, runValidators: true, session },
        ).populate('userId', 'name email tipoUsuario');
    }

    async deleteByIdForCompany(id, companyId, session = null) {
        return CompanyMember.findOneAndUpdate(
            { _id: id, companyId, ...ACTIVE_FILTER },
            { status: COMPANY_MEMBER_STATUS.DISABLED },
            { new: true, session },
        );
    }

    async reactivateByUserAndCompany({ userId, companyId, role, invitedByUserId }, session = null) {
        return CompanyMember.findOneAndUpdate(
            { userId, companyId, status: COMPANY_MEMBER_STATUS.DISABLED },
            {
                role,
                status: COMPANY_MEMBER_STATUS.ACTIVE,
                invitedByUserId,
                joinedAt: new Date(),
            },
            { new: true, runValidators: true, session },
        );
    }
}
