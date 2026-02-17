import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const groupSchema = new Schema({
    name: String,
    users: [{ type: Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('Group', groupSchema);