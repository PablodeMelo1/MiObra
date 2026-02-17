import Group from "../model/group.mjs";

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
            const {_id} = data;
            const group = Group.findById(_id);
            if(!group) throw new Error("Id incorrecto: ", _id);
            await Group.deleteOne(group);
        } catch (error) {
            throw new Error("Error deleting a group", error.message);
        }
    }

    async updateById(data) {
        try {
            const {_id, ...updateData} = data;
            return Group.findOneAndUpdate({_id}, updateData, {new: true});
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

    async getAll() {
        try {
            return Group.find();
        } catch (error) {
            throw new Error("Error getting all groups", error.message);
        }
    }

    async getByUserId(userId) {
        try {
            return Group.find({ users: userId });
        } catch (error) {
            throw new Error("Error getting groups by user", error.message);
        }
    }
}