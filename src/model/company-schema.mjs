import mongoose from 'mongoose';
import { COMPANY_STATUS } from '../constants/companyRoles.mjs';

const { ObjectId } = mongoose.Schema.Types;

const companySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    legalName: { type: String, trim: true, default: '' },
    taxId: { type: String, trim: true, default: '' },
    status: {
        type: String,
        enum: Object.values(COMPANY_STATUS),
        default: COMPANY_STATUS.TRIAL,
        index: true,
    },
    plan: { type: String, default: 'starter' },
    billingStatus: { type: String, default: 'trial' },
    timezone: { type: String, default: 'America/Montevideo' },
    currency: { type: String, default: 'UYU' },
    logoUrl: { type: String, default: '' },
    createdByUserId: { type: ObjectId, ref: 'User', required: true, immutable: true },
}, { timestamps: true });

companySchema.index({ createdByUserId: 1, createdAt: -1 });

export default mongoose.model('Company', companySchema);
