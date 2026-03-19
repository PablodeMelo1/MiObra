import mongoose from "mongoose";

const zonesSchema = new mongoose.Schema({
    name: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Zone', zonesSchema);