import { createError } from "../error/create-error.mjs";
import supplierMongoRepository from "../repositories/materialRequest-repository.mjs";

export const createMaterialRequest = async (req, res) => {
    try {
        const materialRequestRepository = new supplierMongoRepository();
        const { title, description, quantity, Especificaciones, createdBy, status, priority } = req.body;
        if (!title || !quantity) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }
        const newMaterialRequest = { title, description, quantity, Especificaciones, createdBy, status, priority };
        const createdMaterialRequest = await materialRequestRepository.createOne(newMaterialRequest);
        if (!createdMaterialRequest) {
            return res.status(500).json({ message: "Error al crear la solicitud de material" });
        }
        res.status(201).json(createdMaterialRequest);
    } catch (error) {
        throw createError("No pudo crear la solicitud de material", 500);
    }
}
export const getMaterialRequestById = async (req, res) => {
    try {
        const materialRequestRepository = new supplierMongoRepository();
        const { id } = req.params;
        const materialRequest = await materialRequestRepository.getById({ _id: id });
        if (!materialRequest) {
            return res.status(404).json({ message: "Solicitud de material no encontrada" });
        }
        res.status(200).json({ materialRequest });
    }
    catch (error) {
        throw createError("No pudo obtener la solicitud de material", 500);
    }
}

export const deleteMaterialRequest = async (req, res) => {
    try {
        const materialRequestRepository = new supplierMongoRepository();
        const { id } = req.params;
        const deletedMaterialRequest = await materialRequestRepository.deleteByID({ _id: id });
        if (!deletedMaterialRequest) {
            return res.status(404).json({ message: "Solicitud de material no encontrada o no se pudo eliminar" });
        }
        res.status(200).json({ message: "Solicitud de material eliminada correctamente" });
    } catch (error) {
        throw createError("No pudo eliminar la solicitud de material", 500);
    }
}
export const updateMaterialRequest = async (req, res) => {
    try {
        const materialRequestRepository = new supplierMongoRepository();
        const { id } = req.params;
        const updateData = req.body;
        const updatedMaterialRequest = await materialRequestRepository.updateMaterialRequest({ _id: id, ...updateData });
        if (!updatedMaterialRequest) {
            return res.status(404).json({ message: "Solicitud de material no encontrada o no se pudo actualizar" });
        }
        res.status(200).json(updatedMaterialRequest);
    } catch (error) {
        throw createError("No pudo actualizar la solicitud de material", 500);
    }
}

export const getAllMaterialRequests = async (req, res) => {
    try {
        const materialRequestRepository = new supplierMongoRepository();
        const materialRequests = await materialRequestRepository.getAll();
        res.status(200).json(materialRequests);
    } catch (error) {
        throw createError("No pudo obtener las solicitudes de material", 500);
    }
}

export const updateMaterialRequestStatus = async (req, res) => {
    try {
        const materialRequestRepository = new supplierMongoRepository();
        const { id } = req.params;
        const { status } = req.body;
        const updatedMaterialRequest = await materialRequestRepository.updateStatus({ _id: id, status });
        if (!updatedMaterialRequest) {
            return res.status(404).json({ message: "Solicitud de material no encontrada o no se pudo actualizar el estado" });
        }
        res.status(200).json(updatedMaterialRequest);
    }
    catch (error) {
        throw createError("No pudo actualizar el estado de la solicitud de material", 500);
    }
}
export const updateMaterialRequestPriority = async (req, res) => {
    try {
        const materialRequestRepository = new supplierMongoRepository();
        const { id } = req.params;
        const { prio } = req.body;
        const updatedMaterialRequest = await materialRequestRepository.updatePriority({ _id: id, prio });
        if (!updatedMaterialRequest) {
            return res.status(404).json({ message: "Solicitud de material no encontrada o no se pudo actualizar la prioridad" });
        }
        res.status(200).json(updatedMaterialRequest);
    }
    catch (error) {
        throw createError("No pudo actualizar la prioridad de la solicitud de material", 500);
    }
}
export const updateMaterialRequestAssigned = async (req, res) => {
    try {
        const materialRequestRepository = new supplierMongoRepository();
        const { id } = req.params;
        const { assig } = req.body;
        const updatedMaterialRequest = await materialRequestRepository.updateAssigned({ _id: id, assig });
        if (!updatedMaterialRequest) {
            return res.status(404).json({ message: "Solicitud de material no encontrada o no se pudo actualizar el asignado" });
        }
        res.status(200).json(updatedMaterialRequest);
    } catch (error) {
        throw createError("No pudo actualizar el asignado de la solicitud de material", 500);
    }
}
