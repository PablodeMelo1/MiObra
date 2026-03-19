import mongoose from "mongoose";

const { Types } = mongoose;
const { ObjectId } = Types;
const STATUS = ['PEDIDO', 'COMPRADO', 'RECIBIDO'];

const materialRequestSchema = new mongoose.Schema({
    materialName: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
    status: { type: String, enum: STATUS, default: 'PEDIDO' },
    orderDate: { type: Date, default: Date.now },
    supplierId: { type: ObjectId, ref: 'Supplier', default: null },
    arrivalDate: { type: Date, default: null },
    dimensions: {
        length: { type: Number, default: null },
        width: { type: Number, default: null },
        thickness: { type: Number, default: null },
    },
    projectId: { type: ObjectId, ref: 'Project', default: null },
    createdBy: { type: ObjectId, ref: 'User', required: true, immutable: true },
}, { timestamps: true });

export default mongoose.model('MaterialRequest', materialRequestSchema);
