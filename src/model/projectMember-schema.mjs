import mongoose from 'mongoose';
import { PROJECT_ROLE } from '../constants/projectRoles.mjs';

const { ObjectId } = mongoose.Schema.Types;

const ROLE = Object.values(PROJECT_ROLE);

const projectMemberSchema = new mongoose.Schema({
  companyId: { type: ObjectId, ref: 'Company', required: true, index: true },
  userId: { type: ObjectId, ref: 'User', required: true },
  projectId: { type: ObjectId, ref: 'Project', required: true },
  role: { type: String, enum: ROLE, default: PROJECT_ROLE.READ }
}, { timestamps: true });

// Ensure a user cannot be added twice to the same project
projectMemberSchema.index({ companyId: 1, projectId: 1, userId: 1 }, { unique: true });

export default mongoose.model('ProjectMember', projectMemberSchema);
