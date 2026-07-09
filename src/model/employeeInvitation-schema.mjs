import mongoose from 'mongoose';
import { EMPLOYEE_INVITATION_STATUS } from '../constants/employeeStatus.mjs';

const { ObjectId } = mongoose.Schema.Types;

const employeeInvitationSchema = new mongoose.Schema({
    companyId: { type: ObjectId, ref: 'Company', required: true, index: true },
    employeeId: { type: ObjectId, ref: 'Employee', required: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    status: {
        type: String,
        enum: Object.values(EMPLOYEE_INVITATION_STATUS),
        default: EMPLOYEE_INVITATION_STATUS.SENT,
        index: true,
    },
    sentAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date, default: null },
    acceptedUserId: { type: ObjectId, ref: 'User', default: null },
    createdByUserId: { type: ObjectId, ref: 'User', required: true, immutable: true },
}, { timestamps: true });

employeeInvitationSchema.index({ companyId: 1, employeeId: 1, status: 1 });
employeeInvitationSchema.index({ companyId: 1, email: 1, status: 1 });

export default mongoose.model('EmployeeInvitation', employeeInvitationSchema);
