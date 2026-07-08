import mongoose from 'mongoose';
import { ENTITY_TYPES } from '../constants/entityType.mjs';
const { Types } = mongoose;
const ENTITY_TYPES_VALUES = Object.values(ENTITY_TYPES);

const commentSchema = new mongoose.Schema({
  companyId: { type: Types.ObjectId, ref: 'Company', required: true, index: true },
  entityType: { type: String, enum: ENTITY_TYPES_VALUES, required: true },
  entityId: { type: Types.ObjectId, required: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true, trim: true }
}, { timestamps: true });

commentSchema.index({ companyId: 1, entityType: 1, entityId: 1, createdAt: 1 });

export default mongoose.model('Comment', commentSchema);
