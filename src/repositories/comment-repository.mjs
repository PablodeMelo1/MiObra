import Comment from '../model/comment.mjs';

export default class commentMongoRepository {
    async createOne(data) {
        try {
            const newComment = new Comment(data);
            return await newComment.save();
        } catch (error) {
            throw new Error('error creating a comment');
        }
    }

    async getById(data) {
        return Comment.findOne(data);
    }

    async getByEntity({ entityType, entityId }) {
        return Comment.find({ entityType, entityId }).sort({ createdAt: 1 });
    }

    async deleteById(data) {
        const { _id } = data;
        const comment = await Comment.findById(_id);
        if (!comment) throw new Error('Comentario no encontrado');
        await Comment.deleteOne({ _id });
    }
}
