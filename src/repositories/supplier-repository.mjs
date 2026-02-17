import Supplier from '../model/supplier.mjs'

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
            const supplier = Supplier.findById({ _id });
            if (!supplier) throw new Error(`Supplier con id ${_id} no encontrado`);
            await Supplier.findByIdAndDelete({ _id });
        } catch (error) {
            throw new Error('Error deleting by ID: ', error.message);
        }
    }

    async updateSupplier(data) {
        try {
            const { _id, ...supplier } = data;
            const sup = Supplier.findById(_id);
            if (!sup) throw new Error(`Supplier con id ${_id} no encontrado`);
            return await Supplier.findByIdAndUpdate({ _id }, { supplier }, { new: true });
        } catch (error) {
            throw new Error('Error updating by ID: ', error.message);
        }
    }
}