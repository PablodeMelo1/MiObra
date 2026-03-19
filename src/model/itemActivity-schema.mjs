import mongoose from 'mongoose';

const itemActivitySchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, required: true },
  itemId: { type: mongoose.Types.ObjectId, ref: 'Item', required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['CHECK_OUT', 'CHECK_IN', 'TRANSFER'], required: true },
  zoneId: { type: mongoose.Types.ObjectId, ref: 'Zone' },
  quantity: { type: Number, required: true },
  remainingQuantity: { type: Number, required: true },
  status: { type: String, enum: ['OPEN', 'CLOSED'], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('ItemActivity', itemActivitySchema);
