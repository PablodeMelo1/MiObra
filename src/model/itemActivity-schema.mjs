import mongoose from 'mongoose';

const itemActivitySchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, required: true },
  companyId: { type: mongoose.Types.ObjectId, ref: 'Company', required: true, index: true },
  itemId: { type: mongoose.Types.ObjectId, ref: 'Item', required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['CHECK_OUT', 'CHECK_IN', 'TRANSFER'], required: true },
  zoneId: { type: mongoose.Types.ObjectId, ref: 'Zone' },
  quantity: { type: Number, required: true },
  remainingQuantity: { type: Number, required: true },
  status: { type: String, enum: ['OPEN', 'CLOSED'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

itemActivitySchema.index({ companyId: 1, itemId: 1, updatedAt: -1 });

export default mongoose.model('ItemActivity', itemActivitySchema);
