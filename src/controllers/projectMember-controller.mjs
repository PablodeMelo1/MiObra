import projectMemberRepository from '../repositories/projectMember-repository.mjs';
import { createError } from '../error/create-error.mjs';

export const createProjectMember = async (req, res) => {
    try {
        const projectMemberRepo = new projectMemberRepository();
        const { projectId, userId, role } = req.body;
        if (!projectId || !userId) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }
        const newMember = { projectId, userId, role };
        const createdMember = await projectMemberRepo.createOne(newMember);
        if (!createdMember) {
            return res.status(500).json({ message: "Error al agregar el miembro al proyecto" });
        }
        res.status(201).json(createdMember);
    } catch (error) {
        throw createError("No pudo agregar el miembro al proyecto", 500);
    }
}

export const getProjectMembers = async (req, res) => {
    try {
        const projectMemberRepo = new projectMemberRepository();
        const { projectId } = req.params;
        if (!projectId) {
            return res.status(400).json({ message: "ProjectId es requerido" });
        }
        const members = await projectMemberRepo.getByProjectId({ projectId });
        res.status(200).json({ members });
    }
    catch (error) {
        throw createError("No pudo obtener los miembros del proyecto", 500);
    }
}

export const deleteProjectMember = async (req, res) => {
    try {
        const projectMemberRepo = new projectMemberRepository();
        const { id } = req.params;
        const deletedMember = await projectMemberRepo.deleteById({ _id: id });
        if (!deletedMember) {
            return res.status(404).json({ message: "Miembro del proyecto no encontrado o no se pudo eliminar" });
        }
        res.status(200).json({ message: "Miembro del proyecto eliminado correctamente" });
    } catch (error) {
        throw createError("No pudo eliminar el miembro del proyecto", 500);
    }
}

export const updateProjectMemberRole = async (req, res) => {
    try {
        const projectMemberRepo = new projectMemberRepository();
        const { id } = req.params;
        const { role } = req.body;
        if (!role) {
            return res.status(400).json({ message: "El rol es requerido" });
        }
        const updatedMember = await projectMemberRepo.updateById({ _id: id }, { role });
        if (!updatedMember) {
            return res.status(404).json({ message: "Miembro del proyecto no encontrado o no se pudo actualizar" });
        }
        res.status(200).json(updatedMember);
    } catch (error) {
        throw createError("No pudo actualizar el miembro del proyecto", 500);
    }
}

export const getProjectMemberById = async (req, res) => {
    try {
        const projectMemberRepo = new projectMemberRepository();
        const { id } = req.params;
        const member = await projectMemberRepo.getById({ _id: id });
        if (!member) {
            return res.status(404).json({ message: "Miembro del proyecto no encontrado" });
        }
        res.status(200).json({ member });
    }
    catch (error) {
        throw createError("No pudo obtener el miembro del proyecto", 500);
    }
}

export const getAllProjectMembers = async (req, res) => {

    try {
        const projectMemberRepo = new projectMemberRepository();
        const members = await projectMemberRepo.getAll();
        res.status(200).json({ members });
    } catch (error) {
        throw createError("No pudo obtener los miembros del proyecto", 500);
    }
}
