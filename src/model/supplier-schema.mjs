import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    companyId: { type: mongoose.Types.ObjectId, ref: 'Company', required: true, index: true },
    name: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    address: { type: String },
    createdAt: { type: Date, default: Date.now }
});

supplierSchema.index({ companyId: 1, name: 1 });

export default mongoose.model('Supplier', supplierSchema);
