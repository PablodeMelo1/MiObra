import mongoose from "mongoose";
import { TASK_STATUS } from "../../constants/taskStatus.mjs";
import { TASK_PRIORITY } from "../../constants/taskPriopity.mjs";

const { Schema, Types } = mongoose;
const { ObjectId } = Types;
const STATUS = Object.values(TASK_STATUS);
const PRIORITY = Object.values(TASK_PRIORITY);

const materialRequestSchema = new Schema({
    title: String,
    description: String,
    quantity: Number,
    Especificaciones: String,
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: ObjectId, ref: 'User' },
    status: { type: String, enum: STATUS, default: TASK_STATUS.PENDING },
    priority: { type: String, enum: PRIORITY, default: TASK_PRIORITY.MEDIUM },
});

export default mongoose.model('MaterialRequest', materialRequestSchema);
