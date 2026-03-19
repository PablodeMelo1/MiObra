import mongoose from 'mongoose';
import { PROJECT_ROLE } from '../constants/projectRoles.mjs';

const Types = mongoose;

const ROLE = Object.values(PROJECT_ROLE);

const projectMemberSchema = new mongoose.Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  projectId: { type: Types.ObjectId, ref: 'Project', required: true },
  role: { type: String, enum: ROLE, default: PROJECT_ROLE.READ }
}, { timestamps: true });

// Ensure a user cannot be added twice to the same project
projectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export default mongoose.model('ProjectMember', projectMemberSchema);