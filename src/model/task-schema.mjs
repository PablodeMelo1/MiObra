import mongoose from 'mongoose';
import { TASK_STATUS } from '../constants/taskStatus.mjs';
import { TASK_PRIORITY } from '../constants/taskPriopity.mjs';

const { ObjectId } = mongoose.Schema.Types;
const STATUS = Object.values(TASK_STATUS);
const PRIORITY = Object.values(TASK_PRIORITY);

const taskSchema = new mongoose.Schema({
  companyId: { type: ObjectId, ref: 'Company', required: true, index: true },
  projectId: { type: ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  assignedTo: { type: ObjectId, ref: 'User' },
  assignedEmployeeIds: [{ type: ObjectId, ref: 'Employee' }],
  createdByUserId: { type: ObjectId, ref: 'User' },
  updatedByUserId: { type: ObjectId, ref: 'User', default: null },
  status: { type: String, enum: STATUS, default: TASK_STATUS.PENDING },
  priority: { type: String, enum: PRIORITY, default: TASK_PRIORITY.MEDIUM },
  list: { type: String, required: true, default: 'Tareas Pendientes' },
  createdAt: { type: Date, default: Date.now },
  dueDate: { type: Date }
}, { timestamps: true });

taskSchema.index({ companyId: 1, projectId: 1, list: 1 });
taskSchema.index({ companyId: 1, assignedEmployeeIds: 1 });

export default mongoose.model('Task', taskSchema);
