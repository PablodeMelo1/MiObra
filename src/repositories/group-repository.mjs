import Group from "../model/group-schema.mjs";

export default class groupMongoRepository {

    async createOne(data) {
        try {
            const group = new Group(data);
            const newGroup = group.save();
            return newGroup;
        } catch (error) {
            throw new Error("Error creating a group", error.message);
        }
    }

    async deleteById(data) {
        try {
            const {_id, companyId} = data;
            const group = await Group.findOne({ _id, companyId });
            if(!group) throw new Error("Id incorrecto: ", _id);
            return await Group.findOneAndDelete({ _id, companyId });
        } catch (error) {
            throw new Error("Error deleting a group", error.message);
        }
    }

    async updateById(data) {
        try {
            const {_id, companyId, ...updateData} = data;
            delete updateData.companyId;
            return Group.findOneAndUpdate({_id, companyId}, updateData, {new: true});
        } catch (error) {
            throw new Error("Error updating a group", error.message);
        }
    }

    async getById(data) {
        try {
            return Group.findOne(data);
        } catch (error) {
            throw new Error("Error getting group by id", error.message);
        }
    }

    async getAll(companyId) {
        try {
            return Group.find({ companyId });
        } catch (error) {
            throw new Error("Error getting all groups", error.message);
        }
    }

    async getByUserId(userId, companyId) {
        try {
            return Group.find({ users: userId, companyId });
        } catch (error) {
            throw new Error("Error getting groups by user", error.message);
        }
    }
}
