import projectMemberRepository from '../repositories/projectMember-repository.mjs';
import projectRepository from '../repositories/project-repository.mjs';
import CompanyMemberRepository from '../repositories/companyMember-repository.mjs';
import { createError } from '../error/create-error.mjs';

const isUserInCompany = async (userId, companyId) => {
    const companyMemberRepo = new CompanyMemberRepository();
    const memberIds = await companyMemberRepo.findActiveUserIdsByCompanyId(companyId);
    return memberIds.some((memberId) => String(memberId) === String(userId));
};

export const createProjectMember = async (req, res) => {
    try {
        const projectMemberRepo = new projectMemberRepository();
        const { projectId, userId, role } = req.body;
        if (!projectId || !userId) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }
        const projectRepo = new projectRepository();
        const project = await projectRepo.getById({ _id: projectId, companyId: req.companyId });
        if (!project) {
            return res.status(404).json({ message: "Proyecto no encontrado" });
        }
        if (!(await isUserInCompany(userId, req.companyId))) {
            return res.status(403).json({ message: "El usuario no pertenece a la empresa activa" });
        }
        const newMember = { companyId: req.companyId, projectId, userId, role };
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
        const projectRepo = new projectRepository();
        const project = await projectRepo.getById({ _id: projectId, companyId: req.companyId });
        if (!project) {
            return res.status(404).json({ message: "Proyecto no encontrado" });
        }
        const members = await projectMemberRepo.getByProjectId({ projectId, companyId: req.companyId });
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
        const deletedMember = await projectMemberRepo.deleteById({ _id: id, companyId: req.companyId });
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
        const updatedMember = await projectMemberRepo.updateById({ _id: id, companyId: req.companyId }, { role });
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
        const member = await projectMemberRepo.getById({ _id: id, companyId: req.companyId });
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
        const members = await projectMemberRepo.getAll(req.companyId);
        res.status(200).json({ members });
    } catch (error) {
        throw createError("No pudo obtener los miembros del proyecto", 500);
    }
}
