import mongoose from "mongoose";

const { Types } = mongoose;

const pendingSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    isDone: { type: Boolean, default: false },
    dueDate: { type: Date, default: null },
    assignedTo: { type: Types.ObjectId, ref: 'User', required: true },
    collaborators: [{ type: Types.ObjectId, ref: 'User', required: true }],
    createdBy: { type: Types.ObjectId, ref: 'User', required: true, immutable: true },
}, { timestamps: true });

export default mongoose.model('Pending', pendingSchema);

