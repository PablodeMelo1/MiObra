import mongoose from 'mongoose';

const inventoryMovementSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, required: true },
  itemId: { type: mongoose.Types.ObjectId, ref: 'Item', required: true },
  itemName: { type: String, required: true },
  itemType: { type: String },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['CHECK_OUT', 'CHECK_IN'], required: true },
  zoneId: { type: mongoose.Types.ObjectId, ref: 'Zone' },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('InventoryMovement', inventoryMovementSchema);
