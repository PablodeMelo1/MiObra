import CompanyMember from '../model/companyMember-schema.mjs';
import { COMPANY_MEMBER_STATUS } from '../constants/companyRoles.mjs';

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
            .populate('companyId', 'name legalName status plan timezone currency logoUrl')
            .sort({ createdAt: 1 });
    }

    async findActiveMembership({ userId, companyId }) {
        return CompanyMember.findOne({ userId, companyId, ...ACTIVE_FILTER })
            .populate('companyId', 'name legalName status plan timezone currency logoUrl');
    }

    async findActiveByCompanyId(companyId) {
        return CompanyMember.find({ companyId, ...ACTIVE_FILTER })
            .populate('userId', 'name email tipoUsuario')
            .sort({ createdAt: 1 });
    }

    async findActiveUserIdsByCompanyId(companyId) {
        const members = await CompanyMember.find({ companyId, ...ACTIVE_FILTER }).select('userId');
        return members.map((member) => member.userId);
    }

    async updateByIdForCompany(id, companyId, data) {
        return CompanyMember.findOneAndUpdate(
            { _id: id, companyId },
            data,
            { new: true, runValidators: true },
        ).populate('userId', 'name email tipoUsuario');
    }

    async deleteByIdForCompany(id, companyId) {
        return CompanyMember.findOneAndUpdate(
            { _id: id, companyId },
            { status: COMPANY_MEMBER_STATUS.DISABLED },
            { new: true },
        );
    }
}
