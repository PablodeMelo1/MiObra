import Supplier from '../model/supplier-schema.mjs'

export default class supplierRepository {
    async createOne(data) {
        try {
            const newSupplier = new Supplier(data);
            const supplier = await newSupplier.save();
            return supplier;
        } catch (error) {
            throw new Error('Error creating a supplier: ', error.message);
        }
    }

    async getAll() {
        return Supplier.find();
    }
    async getById(data) {
        return Supplier.findOne(data);
    }

    async deleteById(data) {
        try {
            const { _id } = data;
            const supplier = await Supplier.findById(_id);
            if (!supplier) throw new Error(`Supplier con id ${_id} no encontrado`);
            return await Supplier.findByIdAndDelete(_id);
        } catch (error) {
            throw new Error('Error deleting by ID: ' + error.message);
        }
    }

    async updateSupplier(data) {
        try {
            const { _id, ...supplierData } = data;
            const sup = await Supplier.findById(_id);
            if (!sup) throw new Error(`Supplier con id ${_id} no encontrado`);
            return await Supplier.findByIdAndUpdate(_id, supplierData, { new: true, runValidators: true });
        } catch (error) {
            throw new Error('Error updating by ID: ' + error.message);
        }
    }

    async updateById(data, updateData = {}) {
        const id = typeof data === 'string' ? data : data?._id;
        return await Supplier.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async searchByName(name) {
        const regex = new RegExp(name, 'i');
        return Supplier.find({ name: { $regex: regex } });
    }
}