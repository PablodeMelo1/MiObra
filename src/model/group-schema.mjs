import mongoose from "mongoose";

const { Types } = mongoose;

const groupSchema = new mongoose.Schema({
    name: String,
    users: [{ type: Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('Group', groupSchema);