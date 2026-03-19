import Zone from '../model/zones-schemas.mjs';
export default class ZoneMongoRepository {
    async createZone(zoneData) {
        try {
            const newZone = new Zone(zoneData);
            return await newZone.save();
        } catch (error) {
            console.error('Error creating zone:', error);
            throw new Error('Could not create zone');
        }
    }

    async getZoneById(id) {
        try {
            return await Zone.findById(id);
        } catch (error) {
            console.error('Error fetching zone by ID:', error);
            throw new Error('Could not fetch zone');
        }
    }

    async getAll() {
        try {
            return await Zone.find({});
        } catch (error) {
            console.error('Error fetching zones:', error);
            throw new Error('Could not fetch zones');
        }
    }

    async updateById(id, data) {
        try {
            const updated = await Zone.findByIdAndUpdate(id, data, { new: true });
            return updated;
        } catch (error) {
            console.error('Error updating zone:', error);
            throw new Error('Could not update zone');
        }
    }

    async deleteById(id) {
        try {
            const deleted = await Zone.findByIdAndDelete(id);
            return deleted;
        } catch (error) {
            console.error('Error deleting zone:', error);
            throw new Error('Could not delete zone');
        }
    }
}