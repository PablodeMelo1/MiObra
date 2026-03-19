import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;
import { userRoles } from '../constants/userRole.mjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    tipoUsuario: {
        type: String,
        enum: Object.values(userRoles),
        default: userRoles.USER,
    },
}, { timestamps: true });

export default mongoose.model('User', userSchema);