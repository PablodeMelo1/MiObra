import Item from '../model/item-schema.mjs';

export default class itemMongoRepository {

    async getById(id) {
        return Item.findById(id);
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
            return await Item.findByIdAndUpdate(id, data, { new: true });
        } catch (err) {
            throw new Error('Error updating item: ' + err.message);
        }
    }

    async deleteById(id) {
        try {
            return await Item.findByIdAndDelete(id);
        } catch (err) {
            throw new Error('Error deleting item: ' + err.message);
        }
    }

    async updateAvailableQuantity(id, newQuantity) {
        try {
            return await Item.findByIdAndUpdate(
                id,
                { availableQuantity: newQuantity, updatedAt: Date.now() },
                { new: true }
            );
        } catch (err) {
            throw new Error('Error updating available quantity: ' + err.message);
        }
    }

    async incrementAvailableQuantity(id, amount) {
        try {
            return await Item.findByIdAndUpdate(
                id,
                { $inc: { availableQuantity: amount }, updatedAt: Date.now() },
                { new: true }
            );
        } catch (err) {
            throw new Error('Error incrementing available quantity: ' + err.message);
        }
    }

    async decrementAvailableQuantity(id, amount) {
        try {
            return await Item.findByIdAndUpdate(
                id,
                { $inc: { availableQuantity: -Math.abs(amount) }, updatedAt: Date.now() },
                { new: true }
            );
        } catch (err) {
            throw new Error('Error decrementing available quantity: ' + err.message);
        }
    }

    async incrementStock(id, amount) {
        try {
            const value = Math.abs(Number(amount) || 0);
            return await Item.findByIdAndUpdate(
                id,
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
