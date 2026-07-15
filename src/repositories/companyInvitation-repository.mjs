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
            .populate('declinedUserId', 'name email')
            .sort({ createdAt: -1 });
    }

    async getOpenByCompanyAndEmail(companyId, email) {
        return CompanyInvitation.findOne({
            companyId,
            email,
            status: { $in: [COMPANY_INVITATION_STATUS.PENDING, COMPANY_INVITATION_STATUS.SENT] },
            expiresAt: { $gt: new Date() },
        });
    }

    async markSent(id) {
        return CompanyInvitation.findOneAndUpdate(
            { _id: id, status: COMPANY_INVITATION_STATUS.PENDING },
            { status: COMPANY_INVITATION_STATUS.SENT, sentAt: new Date() },
            { new: true, runValidators: true },
        );
    }

    async acceptById(id, acceptedUserId, session = null) {
        return CompanyInvitation.findOneAndUpdate(
            {
                _id: id,
                status: COMPANY_INVITATION_STATUS.SENT,
                expiresAt: { $gt: new Date() },
            },
            {
                status: COMPANY_INVITATION_STATUS.ACCEPTED,
                acceptedAt: new Date(),
                acceptedUserId,
            },
            { new: true, session },
        );
    }

    async declineById(id, declinedUserId) {
        return CompanyInvitation.findOneAndUpdate(
            {
                _id: id,
                status: COMPANY_INVITATION_STATUS.SENT,
                expiresAt: { $gt: new Date() },
            },
            {
                status: COMPANY_INVITATION_STATUS.DECLINED,
                declinedAt: new Date(),
                declinedUserId,
            },
            { new: true, runValidators: true },
        );
    }

    async revokeByIdForCompany(id, companyId) {
        return CompanyInvitation.findOneAndUpdate(
            {
                _id: id,
                companyId,
                status: { $in: [COMPANY_INVITATION_STATUS.PENDING, COMPANY_INVITATION_STATUS.SENT] },
            },
            { status: COMPANY_INVITATION_STATUS.REVOKED },
            { new: true },
        );
    }
}
