import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    address: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Supplier', supplierSchema);
