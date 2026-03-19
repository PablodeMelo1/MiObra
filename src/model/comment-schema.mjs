import mongoose from 'mongoose';
import { ENTITY_TYPES } from '../constants/entityType.mjs';
const { Types } = mongoose;
const ENTITY_TYPES_VALUES = Object.values(ENTITY_TYPES);

const commentSchema = new mongoose.Schema({
  entityType: { type: String, enum: ENTITY_TYPES_VALUES, required: true },
  entityId: { type: Types.ObjectId, required: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true, trim: true }
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
