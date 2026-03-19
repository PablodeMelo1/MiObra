import mongoose from 'mongoose';
import { ITEM_TYPES } from '../constants/itemType.mjs';

const ITEM_TYPES_VALUES = Object.values(ITEM_TYPES);
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    profileImage: { type: String }, // URL de Cloudinary
    profileImagePublicId: { type: String }, // Public ID para eliminar de Cloudinary
    description: { type: String },
    totalQuantity: { type: Number, default: 1 },
    availableQuantity: { type: Number, default: 1 },
    itemType: { type: String, enum: ITEM_TYPES_VALUES, required: true },
    zoneId: { type: mongoose.Types.ObjectId, ref: 'Zone' },
    aditionalInfo: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Item', itemSchema);