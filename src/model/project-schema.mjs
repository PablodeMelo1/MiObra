import mongoose from "mongoose";
const listDefault = ["Tareas pendientes"];

const projectSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    name: { type: String, required: true },
    description: String,
    location: String,
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    lists: { type: [String], default: listDefault },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

projectSchema.index({ companyId: 1, createdAt: -1 });

export default mongoose.model('Project', projectSchema);
