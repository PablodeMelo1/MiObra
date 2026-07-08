import mongoose from "mongoose";

const zonesSchema = new mongoose.Schema({
    companyId: { type: mongoose.Types.ObjectId, ref: 'Company', required: true, index: true },
    name: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

zonesSchema.index({ companyId: 1, name: 1 });

export default mongoose.model('Zone', zonesSchema);
