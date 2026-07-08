import Comment from '../model/comment-schema.mjs';

export default class commentMongoRepository {
    async createOne(data) {
        try {
            const newComment = new Comment(data);
            await newComment.save();
            return newComment.populate('userId', 'name email');
        } catch (error) {
            throw new Error('error creating a comment');
        }
    }

    async getById(data) {
        return Comment.findOne(data);
    }

    async getByEntity({ entityType, entityId, companyId }) {
        return Comment.find({ entityType, entityId, companyId }).populate('userId', 'name email').sort({ createdAt: 1 });
    }

    async updateById(data, update) {
        return Comment.findOneAndUpdate({ _id: data._id, companyId: data.companyId }, update, { new: true }).populate('userId', 'name email');
    }

    async deleteById(data) {
        const { _id } = data;
        const comment = await Comment.findOne({ _id, companyId: data.companyId });
        if (!comment) throw new Error('Comentario no encontrado');
        return Comment.deleteOne({ _id, companyId: data.companyId });
    }
}
