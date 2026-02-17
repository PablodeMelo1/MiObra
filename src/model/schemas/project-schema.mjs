import mongoose from "mongoose";
const { Schema } = mongoose;
const listDefault = ["Tareas pendientes"];

const projectSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    location: String,
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    lists: { type: [String], default: listDefault },
    createdAt: { type: Date, default: Date.now },

});

export default mongoose.model('Project', projectSchema);