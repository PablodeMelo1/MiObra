import Pending from "../model/pending.mjs";
import Group from "../model/group.mjs";

export default class pendingMongoRepository {
    async createOne(data) {
        try {
            const newPending = new Pending(data);
            const savePending = await newPending.save();
            return savePending;
        } catch (error) {
            throw new Error('error creating a pending');
        }
    }

    async deleteById(data) {
        const { _id } = data;
        const pending = Pending.findById(_id);
        if (!pending) throw new Error("Id incorrecto");
        await Pending.deleteOne(_id);
    }

    async updatePending(data) {
        const { _id, ...updateData } = data;
        return Pending.findOneAndUpdate({ _id }, updateData, { new: true });
    }

    async getById(data) {
        return Pending.findOne(data);
    }

    async getAllByUser(userId) {
        try {
            const userGroups = await Group.find({ users: userId });
            const groupIds = userGroups.map(g => g._id);

            return await Pending.find({
                $or: [
                    { assignedTo: userId },
                    { colaborators: { $in: [userId] } },
                    { Groups: { $in: groupIds } }
                ]
            });
        } catch (error) {
            throw new Error('Error obteniendo pending del usuario: ' + error.message);
        }
    }

    async getAll() {
        return await Pending.find();
    }

    async updateStatus(data) {
        const { _id, status } = data;
        return Pending.findOneAndUpdate({ _id }, { status }, {new: true});
    }

    async updatePriority(data) {
        const { _id, prio } = data;
        return Pending.findOneAndUpdate({_id}, {prio}, {new: true})
    }

}