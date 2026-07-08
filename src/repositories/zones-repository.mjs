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

    async getZoneById(id, companyId) {
        try {
            return await Zone.findOne({ _id: id, companyId });
        } catch (error) {
            console.error('Error fetching zone by ID:', error);
            throw new Error('Could not fetch zone');
        }
    }

    async getAll(companyId) {
        try {
            return await Zone.find({ companyId });
        } catch (error) {
            console.error('Error fetching zones:', error);
            throw new Error('Could not fetch zones');
        }
    }

    async updateById(id, companyId, data) {
        try {
            delete data.companyId;
            const updated = await Zone.findOneAndUpdate({ _id: id, companyId }, data, { new: true });
            return updated;
        } catch (error) {
            console.error('Error updating zone:', error);
            throw new Error('Could not update zone');
        }
    }

    async deleteById(id, companyId) {
        try {
            const deleted = await Zone.findOneAndDelete({ _id: id, companyId });
            return deleted;
        } catch (error) {
            console.error('Error deleting zone:', error);
            throw new Error('Could not delete zone');
        }
    }
}
