import { createError } from "../error/create-error.mjs";
import commentMongoRepository from "../repositories/comment-repository.mjs";

export const createComment = async (req, res) => {
    try {
        const commentRepository = new commentMongoRepository();
        const { entityType, entityId } = req.params;
        const { comment } = req.body;
        const { id: userId } = req.user || {};

        if (!entityType || !entityId) {
            return res.status(400).json({ message: "entityType y entityId son requeridos" });
        }
        if (!comment) {
            return res.status(400).json({ message: "El comentario es requerido" });
        }
        if (!userId) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        const created = await commentRepository.createOne({ entityType, entityId, userId, comment });
        res.status(201).json({ comment: created });
    } catch (error) {
        throw createError("No pudo crear el comentario", 500);
    }
}

export const getCommentsByEntity = async (req, res) => {
    try {
        const commentRepository = new commentMongoRepository();
        const { entityType, entityId } = req.params;

        if (!entityType || !entityId) {
            return res.status(400).json({ message: "entityType y entityId son requeridos" });
        }

        const comments = await commentRepository.getByEntity({ entityType, entityId });
        res.status(200).json({ comments });
    } catch (error) {
        throw createError("No pudo obtener los comentarios", 500);
    }
}

export const deleteComment = async (req, res) => {
    try {
        const commentRepository = new commentMongoRepository();
        const { id } = req.params;
        const { id: userId, role, tipoUsuario } = req.user || {};
        if (!userId) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        const comment = await commentRepository.getById({ _id: id });
        if (!comment) {
            return res.status(404).json({ message: "Comentario no encontrado" });
        }
        if (comment.userId.toString() !== userId.toString() && (role || tipoUsuario) !== 'admin') {
            return res.status(403).json({ message: "No tiene permiso para eliminar este comentario" });
        }
        const deleted = await commentRepository.deleteById({ _id: id });
        if (!deleted) {
            return res.status(500).json({ message: "No se pudo eliminar el comentario" });
        }
        res.status(200).json({ message: "Comentario eliminado correctamente" });
    } catch (error) {
        throw createError("No pudo eliminar el comentario", 500);
    }
}

export const updateComment = async (req, res) => {
    try {
        const commentRepository = new commentMongoRepository();
        const { id } = req.params;
        const { comment: newComment } = req.body;
        const { id: userId, role, tipoUsuario } = req.user || {};
        if (!userId) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        const comment = await commentRepository.getById({ _id: id });
        if (!comment) {
            return res.status(404).json({ message: "Comentario no encontrado" });
        }
        if (comment.userId.toString() !== userId.toString() && (role || tipoUsuario) !== 'admin') {
            return res.status(403).json({ message: "No tiene permiso para actualizar este comentario" });
        }
        const updated = await commentRepository.updateById({ _id: id }, { comment: newComment });
        if (!updated) {
            return res.status(500).json({ message: "No se pudo actualizar el comentario" });
        }
        res.status(200).json({ comment: updated });
    } catch (error) {
        throw createError("No pudo actualizar el comentario", 500);
    }
}

export const getCommentById = async (req, res) => {
    try {
        const commentRepository = new commentMongoRepository();
        const { id } = req.params;
        const comment = await commentRepository.getById({ _id: id });
        if (!comment) {
            return res.status(404).json({ message: "Comentario no encontrado" });
        }
        res.status(200).json({ comment });
    } catch (error) {
        throw createError("No pudo obtener el comentario", 500);
    }
}
