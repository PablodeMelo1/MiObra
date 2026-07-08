import mongoose from 'mongoose';
import {
    COMPANY_INVITATION_STATUS,
    COMPANY_ROLES,
} from '../constants/companyRoles.mjs';

const { ObjectId } = mongoose.Schema.Types;

const companyInvitationSchema = new mongoose.Schema({
    companyId: { type: ObjectId, ref: 'Company', required: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    role: {
        type: String,
        enum: Object.values(COMPANY_ROLES),
        default: COMPANY_ROLES.OPERATOR,
    },
    status: {
        type: String,
        enum: Object.values(COMPANY_INVITATION_STATUS),
        default: COMPANY_INVITATION_STATUS.SENT,
        index: true,
    },
    sentAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date, default: null },
    acceptedUserId: { type: ObjectId, ref: 'User', default: null },
    createdByUserId: { type: ObjectId, ref: 'User', required: true, immutable: true },
}, { timestamps: true });

companyInvitationSchema.index({ companyId: 1, email: 1, status: 1 });

export default mongoose.model('CompanyInvitation', companyInvitationSchema);
