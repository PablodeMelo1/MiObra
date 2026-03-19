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

    async findOpenActivityByItemAndUser(itemId, userId, zoneId = null) {
        const query = { itemId, userId, status: 'OPEN' };
        if (zoneId) query.zoneId = zoneId;
        return await ItemActivity.findOne(query);
    }

    async updateRemainingQuantity(activityId, newRemaining) {
        try {
            return await ItemActivity.findByIdAndUpdate(
                activityId,
                { remainingQuantity: newRemaining },
                { new: true }
            );
        } catch (err) {
            throw new Error('Error updating remaining quantity: ' + err.message);
        }
    }

    async closeActivity(activityId) {
        try {
            return await ItemActivity.findByIdAndUpdate(
                activityId,
                { status: 'CLOSED' },
                { new: true }
            );
        } catch (err) {
            throw new Error('Error closing activity: ' + err.message);
        }
    }

}
