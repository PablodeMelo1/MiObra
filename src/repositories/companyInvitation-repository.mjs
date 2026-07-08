import CompanyInvitation from '../model/companyInvitation-schema.mjs';
import { COMPANY_INVITATION_STATUS } from '../constants/companyRoles.mjs';

export default class CompanyInvitationRepository {
    async createOne(data) {
        const invitation = new CompanyInvitation(data);
        return invitation.save();
    }

    async getByTokenHash(tokenHash) {
        return CompanyInvitation.findOne({ tokenHash }).populate('companyId', 'name status');
    }

    async getAllByCompany(companyId) {
        return CompanyInvitation.find({ companyId })
            .populate('createdByUserId', 'name email')
            .populate('acceptedUserId', 'name email')
            .sort({ createdAt: -1 });
    }

    async acceptById(id, acceptedUserId, session = null) {
        return CompanyInvitation.findByIdAndUpdate(
            id,
            {
                status: COMPANY_INVITATION_STATUS.ACCEPTED,
                acceptedAt: new Date(),
                acceptedUserId,
            },
            { new: true, session },
        );
    }

    async revokeByIdForCompany(id, companyId) {
        return CompanyInvitation.findOneAndUpdate(
            { _id: id, companyId },
            { status: COMPANY_INVITATION_STATUS.REVOKED },
            { new: true },
        );
    }
}
