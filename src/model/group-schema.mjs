import mongoose from "mongoose";

const { Types } = mongoose;

const groupSchema = new mongoose.Schema({
    companyId: { type: Types.ObjectId, ref: 'Company', required: true, index: true },
    name: String,
    users: [{ type: Types.ObjectId, ref: 'User' }],
});

groupSchema.index({ companyId: 1, name: 1 });

export default mongoose.model('Group', groupSchema);
