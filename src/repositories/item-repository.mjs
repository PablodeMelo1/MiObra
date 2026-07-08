import Item from '../model/item-schema.mjs';

export default class itemMongoRepository {

    async getById(id, companyId) {
        return Item.findOne({ _id: id, companyId });
    }

    async getAll(filter = {}) {
        return Item.find(filter);
    }

    async createOne(data) {
        try {
            const newItem = new Item(data);
            return await newItem.save();
        } catch (err) {
            throw new Error('Error creating item: ' + err.message);
        }
    }

    async updateById(id, data) {
        try {
            data.updatedAt = Date.now();
            return await Item.findOneAndUpdate({ _id: id, companyId: data.companyId }, data, { new: true });
        } catch (err) {
            throw new Error('Error updating item: ' + err.message);
        }
    }

    async deleteById(data) {
        try {
            return await Item.findOneAndDelete({ _id: data._id, companyId: data.companyId });
        } catch (err) {
            throw new Error('Error deleting item: ' + err.message);
        }
    }

    async updateAvailableQuantity(id, newQuantity, companyId) {
        try {
            return await Item.findOneAndUpdate(
                { _id: id, companyId },
                { availableQuantity: newQuantity, updatedAt: Date.now() },
                { new: true }
            );
        } catch (err) {
            throw new Error('Error updating available quantity: ' + err.message);
        }
    }

    async incrementAvailableQuantity(id, amount, companyId) {
        try {
            return await Item.findOneAndUpdate(
                { _id: id, companyId },
                { $inc: { availableQuantity: amount }, updatedAt: Date.now() },
                { new: true }
            );
        } catch (err) {
            throw new Error('Error incrementing available quantity: ' + err.message);
        }
    }

    async decrementAvailableQuantity(id, amount, companyId) {
        try {
            return await Item.findOneAndUpdate(
                { _id: id, companyId },
                { $inc: { availableQuantity: -Math.abs(amount) }, updatedAt: Date.now() },
                { new: true }
            );
        } catch (err) {
            throw new Error('Error decrementing available quantity: ' + err.message);
        }
    }

    async incrementStock(id, amount, companyId) {
        try {
            const value = Math.abs(Number(amount) || 0);
            return await Item.findOneAndUpdate(
                { _id: id, companyId },
                {
                    $inc: { totalQuantity: value, availableQuantity: value },
                    updatedAt: Date.now(),
                },
                { new: true }
            );
        } catch (err) {
            throw new Error('Error incrementing stock: ' + err.message);
        }
    }

}
