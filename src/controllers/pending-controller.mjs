import { createError } from "../error/create-error.mjs";
import pendingMongoRepository from "../repositories/pending-repository.mjs";

export const createPending = async (req, res) => {
    try {
        const pendingRepository = new pendingMongoRepository();
        const { title, description, assignedTo, status, priority, colaborators, Groups } = req.body;
        if (!title) {
            return res.status(400).json({ message: "El título es obligatorio" });
        }
        const newPending = { title, description, assignedTo, status, priority, colaborators, Groups };
        const createdPending = await pendingRepository.createOne(newPending);
        if (!createdPending) {
            return res.status(500).json({ message: "Error al crear el pendiente" });
        }
        res.status(201).json(createdPending);
    } catch (error) {
        throw createError("No pudo crear el pendiente", 500);
    }
}

export const getPendingById = async (req, res) => {
    try {
        const pendingRepository = new pendingMongoRepository();
        const { id } = req.params;
        const pending = await pendingRepository.getById({ _id: id });
        if (!pending) {
            return res.status(404).json({ message: "Pendiente no encontrado" });
        }
        res.status(200).json({ pending });
    } catch (error) {
        throw createError("No pudo obtener el pendiente", 500);
    }
}

export const getAllPending = async (req, res) => {
    try {
        const pendingRepository = new pendingMongoRepository();
        const pendings = await pendingRepository.getAll();
        res.status(200).json({ pendings });
    } catch (error) {
        throw createError("No pudo obtener los pendientes", 500);
    }
}

export const getPendingsByUser = async (req, res) => {
    try {
        const pendingRepository = new pendingMongoRepository();
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "UserId es requerido" });
        }
        const pendings = await pendingRepository.getAllByUser(userId);
        res.status(200).json({ pendings });
    } catch (error) {
        throw createError("No pudo obtener los pendientes del usuario", 500);
    }
}

export const updatePending = async (req, res) => {
    try {
        const pendingRepository = new pendingMongoRepository();
        const { id } = req.params;
        const updateData = req.body;
        const updatedPending = await pendingRepository.updatePending({ _id: id, ...updateData });
        if (!updatedPending) {
            return res.status(404).json({ message: "Pendiente no encontrado o no se pudo actualizar" });
        }
        res.status(200).json(updatedPending);
    } catch (error) {
        throw createError("No pudo actualizar el pendiente", 500);
    }
}

export const deletePending = async (req, res) => {
    try {
        const pendingRepository = new pendingMongoRepository();
        const { id } = req.params;
        const deletedPending = await pendingRepository.deleteById({ _id: id });
        if (!deletedPending) {
            return res.status(404).json({ message: "Pendiente no encontrado o no se pudo eliminar" });
        }
        res.status(200).json({ message: "Pendiente eliminado correctamente" });
    } catch (error) {
        throw createError("No pudo eliminar el pendiente", 500);
    }
}
