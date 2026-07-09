import mongoose from 'mongoose';
import { EMPLOYEE_STATUS } from '../constants/employeeStatus.mjs';

const { ObjectId } = mongoose.Schema.Types;

const employeeSchema = new mongoose.Schema({
    companyId: { type: ObjectId, ref: 'Company', required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    documentType: { type: String, default: '', trim: true },
    documentNumber: { type: String, default: '', trim: true },
    position: { type: String, default: '', trim: true },
    department: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    workEmail: { type: String, default: null, trim: true, lowercase: true },
    status: {
        type: String,
        enum: Object.values(EMPLOYEE_STATUS),
        default: EMPLOYEE_STATUS.ACTIVE,
        index: true,
    },
    hireDate: { type: Date, default: null },
    leaveDate: { type: Date, default: null },
    notes: { type: String, default: '' },
    userId: { type: ObjectId, ref: 'User', default: null },
    createdByUserId: { type: ObjectId, ref: 'User', required: true, immutable: true },
}, { timestamps: true });

employeeSchema.index({ companyId: 1, fullName: 1 });
employeeSchema.index(
    { companyId: 1, workEmail: 1 },
    { unique: true, partialFilterExpression: { workEmail: { $type: 'string' } } },
);
employeeSchema.index(
    { userId: 1 },
    { unique: true, partialFilterExpression: { userId: { $type: 'objectId' } } },
);

export default mongoose.model('Employee', employeeSchema);
