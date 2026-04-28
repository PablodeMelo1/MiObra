import InventoryMovement from '../model/inventoryMovement-schema.mjs';

export default class inventoryMovementMongoRepository {
    async create(data) {
        const movement = new InventoryMovement(data);
        return movement.save();
    }

    
    async getAll(limit = 500) {
        return InventoryMovement.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('userId', 'name email')
            .populate('itemId', 'name itemType');
    }
}
