import mongoose from 'mongoose';
import { userRoles } from '../constants/userRole.mjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    tipoUsuario: {
        type: String,
        enum: Object.values(userRoles),
        default: userRoles.USER,
    },
    emailVerificationStatus: {
        type: String,
        enum: ['pending', 'verified'],
        default: 'pending',
        index: true,
    },
    emailVerifiedAt: { type: Date, default: null },
    emailVerificationTokenHash: { type: String, default: null, index: true },
    emailVerificationTokenExpiresAt: { type: Date, default: null },
    emailVerificationLastSentAt: { type: Date, default: null },
    emailVerificationSentCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
