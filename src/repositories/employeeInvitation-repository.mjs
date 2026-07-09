import EmployeeInvitation from '../model/employeeInvitation-schema.mjs';
import { EMPLOYEE_INVITATION_STATUS } from '../constants/employeeStatus.mjs';

const populateInvitation = (query) => query
    .populate('employeeId', 'fullName workEmail status userId companyId')
    .populate('createdByUserId', 'name email')
    .populate('acceptedUserId', 'name email');

export default class EmployeeInvitationRepository {
    async createOne(data) {
        const invitation = new EmployeeInvitation(data);
        return invitation.save();
    }

    async getByTokenHash(tokenHash) {
        return populateInvitation(EmployeeInvitation.findOne({ tokenHash }));
    }

    async getAllByCompany(companyId) {
        return populateInvitation(EmployeeInvitation.find({ companyId }).sort({ createdAt: -1 }));
    }

    async getAllByEmployee(employeeId, companyId) {
        return populateInvitation(EmployeeInvitation.find({ employeeId, companyId }).sort({ createdAt: -1 }));
    }

    async acceptById(id, acceptedUserId, session = null) {
        return EmployeeInvitation.findByIdAndUpdate(
            id,
            {
                status: EMPLOYEE_INVITATION_STATUS.ACCEPTED,
                acceptedAt: new Date(),
                acceptedUserId,
            },
            { new: true, session },
        );
    }

    async revokeByIdForCompany(id, companyId) {
        return EmployeeInvitation.findOneAndUpdate(
            { _id: id, companyId },
            { status: EMPLOYEE_INVITATION_STATUS.REVOKED },
            { new: true },
        );
    }
}
