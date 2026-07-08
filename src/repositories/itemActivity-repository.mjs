import ItemActivity from '../model/itemActivity-schema.mjs';

export default class itemActivityMongoRepository {

    async create(activityData) {
        try {
            const newActivity = new ItemActivity(activityData);
            return await newActivity.save();
        } catch (err) {
            throw new Error('Error creating item activity: ' + err.message);
        }
    }

    async findByItemAndUser(itemId, userId, zoneId = null, companyId) {
        const query = { itemId, userId, companyId };
        if (zoneId) query.zoneId = zoneId;
        return await ItemActivity.findOne(query);
    }

    async applyCheckout(activityId, amount) {
        try {
            return await ItemActivity.findByIdAndUpdate(
                activityId,
                {
                    $inc: {
                        quantity: Math.abs(amount),
                        remainingQuantity: Math.abs(amount),
                    },
                    status: 'OPEN',
                    type: 'CHECK_OUT',
                    updatedAt: Date.now(),
                },
                { new: true }
            );
        } catch (err) {
            throw new Error('Error applying checkout movement: ' + err.message);
        }
    }

    async applyCheckin(activityId, amount, nextStatus = 'OPEN') {
        try {
            return await ItemActivity.findByIdAndUpdate(
                activityId,
                {
                    $inc: {
                        quantity: -Math.abs(amount),
                        remainingQuantity: -Math.abs(amount),
                    },
                    status: nextStatus,
                    type: 'CHECK_IN',
                    updatedAt: Date.now(),
                },
                { new: true }
            );
        } catch (err) {
            throw new Error('Error applying checkin movement: ' + err.message);
        }
    }

    async deleteById(activityId) {
        try {
            return await ItemActivity.findByIdAndDelete(activityId);
        } catch (err) {
            throw new Error('Error deleting item activity: ' + err.message);
        }
    }

    async getByItemId(itemId, limit = 200, companyId) {
        return ItemActivity.find({ itemId, companyId })
            .sort({ updatedAt: -1 })
            .limit(limit)
            .populate('userId', 'name email')
            .populate('itemId', 'name itemType');
    }

}
