import mongoose from "mongoose";
import { TASK_STATUS } from "../../constants/taskStatus.mjs";
import { TASK_PRIORITY } from "../../constants/taskPriopity.mjs";

const { Schema, Types } = mongoose;
const STATUS = Object.values(TASK_STATUS);
const PRIORITY = Object.values(TASK_PRIORITY);

const pendingSchema = new Schema({
    title: String,
    description: String,
    assignedTo: { type: Types.ObjectId, ref: 'User' },
    status: { type: String, enum: STATUS, default: TASK_STATUS.PENDING },
    priority: { type: String, enum: PRIORITY, default: TASK_PRIORITY.MEDIUM },
    createdAt: { type: Date, default: Date.now },
    colaborators: { type: [Types.ObjectId], ref: 'User' },
    Groups: { type: Types.ObjectId, ref: 'Group' },
}, { timestamps: true });

export default mongoose.model('Pending', pendingSchema);

