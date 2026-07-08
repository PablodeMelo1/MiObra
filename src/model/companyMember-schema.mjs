import mongoose from 'mongoose';
import { COMPANY_MEMBER_STATUS, COMPANY_ROLES } from '../constants/companyRoles.mjs';

const { ObjectId } = mongoose.Schema.Types;

const companyMemberSchema = new mongoose.Schema({
    companyId: { type: ObjectId, ref: 'Company', required: true, index: true },
    userId: { type: ObjectId, ref: 'User', required: true, index: true },
    role: {
        type: String,
        enum: Object.values(COMPANY_ROLES),
        default: COMPANY_ROLES.OPERATOR,
    },
    status: {
        type: String,
        enum: Object.values(COMPANY_MEMBER_STATUS),
        default: COMPANY_MEMBER_STATUS.ACTIVE,
        index: true,
    },
    invitedByUserId: { type: ObjectId, ref: 'User', default: null },
    joinedAt: { type: Date, default: Date.now },
}, { timestamps: true });

companyMemberSchema.index({ companyId: 1, userId: 1 }, { unique: true });
companyMemberSchema.index({ userId: 1, status: 1 });

export default mongoose.model('CompanyMember', companyMemberSchema);
