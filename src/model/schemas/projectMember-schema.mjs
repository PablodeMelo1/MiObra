import mongoose from 'mongoose';
import { PROJECT_ROLE } from '../../constants/projectRoles.mjs';

const { Schema, model, Types } = mongoose;

const ROLE = Object.values(PROJECT_ROLE);

const projectMemberSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  projectId: { type: Types.ObjectId, ref: 'Project', required: true },
  role: { type: String, enum: ROLE, default: PROJECT_ROLE.READ }
}, { timestamps: true });

export default model('ProjectMember', projectMemberSchema);