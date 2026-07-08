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

    async getAll(companyId) {
        return Supplier.find({ companyId });
    }
    async getById(data) {
        return Supplier.findOne(data);
    }

    async deleteById(data) {
        try {
            const { _id, companyId } = data;
            const supplier = await Supplier.findOne({ _id, companyId });
            if (!supplier) throw new Error(`Supplier con id ${_id} no encontrado`);
            return await Supplier.findOneAndDelete({ _id, companyId });
        } catch (error) {
            throw new Error('Error deleting by ID: ' + error.message);
        }
    }

    async updateSupplier(data) {
        try {
            const { _id, ...supplierData } = data;
            const sup = await Supplier.findOne({ _id, companyId: data.companyId });
            if (!sup) throw new Error(`Supplier con id ${_id} no encontrado`);
            return await Supplier.findOneAndUpdate({ _id, companyId: data.companyId }, supplierData, { new: true, runValidators: true });
        } catch (error) {
            throw new Error('Error updating by ID: ' + error.message);
        }
    }

    async updateById(data, updateData = {}) {
        const id = typeof data === 'string' ? data : data?._id;
        const query = { _id: id };
        if (data?.companyId) query.companyId = data.companyId;
        delete updateData.companyId;
        return await Supplier.findOneAndUpdate(query, updateData, { new: true, runValidators: true });
    }

    async searchByName(name, companyId) {
        const regex = new RegExp(name, 'i');
        return Supplier.find({ name: { $regex: regex }, companyId });
    }
}
