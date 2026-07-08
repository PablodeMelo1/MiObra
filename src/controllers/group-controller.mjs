import { createError } from "../error/create-error.mjs";
import groupMongoRepository from "../repositories/group-repository.mjs";
import CompanyMemberRepository from "../repositories/companyMember-repository.mjs";

const areUsersInCompany = async (userIds = [], companyId) => {
    const ids = Array.isArray(userIds) ? userIds : [];
    const memberRepo = new CompanyMemberRepository();
    const memberIds = await memberRepo.findActiveUserIdsByCompanyId(companyId);
    const memberIdSet = new Set(memberIds.map((memberId) => String(memberId)));
    return ids.every((userId) => memberIdSet.has(String(userId)));
};

export const createGroup = async (req, res) => {
    try {
        const groupRepository = new groupMongoRepository();
        const { name, users } = req.body;
        if (!name) {
            return res.status(400).json({ message: "El nombre del grupo es obligatorio" });
        }
        if (!(await areUsersInCompany(users, req.companyId))) {
            return res.status(403).json({ message: "Todos los usuarios del grupo deben pertenecer a la empresa activa" });
        }
        const newGroup = { companyId: req.companyId, name, users };
        const createdGroup = await groupRepository.createOne(newGroup);
        if (!createdGroup) {
            return res.status(500).json({ message: "Error al crear el grupo" });
        }
        res.status(201).json(createdGroup);
    } catch (error) {
        throw createError("No pudo crear el grupo", 500);
    }
}

export const getGroupById = async (req, res) => {
    try {
        const groupRepository = new groupMongoRepository();
        const { id } = req.params;
        const group = await groupRepository.getById({ _id: id, companyId: req.companyId });
        if (!group) {
            return res.status(404).json({ message: "Grupo no encontrado" });
        }
        res.status(200).json({ group });
    } catch (error) {
        throw createError("No pudo obtener el grupo", 500);
    }
}

export const getAllGroups = async (req, res) => {
    try {
        const groupRepository = new groupMongoRepository();
        const groups = await groupRepository.getAll(req.companyId);
        res.status(200).json({ groups });
    } catch (error) {
        throw createError("No pudo obtener los grupos", 500);
    }
}

export const getGroupsByUser = async (req, res) => {
    try {
        const groupRepository = new groupMongoRepository();
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "UserId es requerido" });
        }
        const groups = await groupRepository.getByUserId(userId, req.companyId);
        res.status(200).json({ groups });
    } catch (error) {
        throw createError("No pudo obtener los grupos del usuario", 500);
    }
}

export const updateGroup = async (req, res) => {
    try {
        const groupRepository = new groupMongoRepository();
        const { id } = req.params;
        const updateData = { ...req.body };
        delete updateData.companyId;
        if (updateData.users && !(await areUsersInCompany(updateData.users, req.companyId))) {
            return res.status(403).json({ message: "Todos los usuarios del grupo deben pertenecer a la empresa activa" });
        }
        const updatedGroup = await groupRepository.updateById({ _id: id, ...updateData, companyId: req.companyId });
        if (!updatedGroup) {
            return res.status(404).json({ message: "Grupo no encontrado o no se pudo actualizar" });
        }
        res.status(200).json(updatedGroup);
    } catch (error) {
        throw createError("No pudo actualizar el grupo", 500);
    }
}

export const deleteGroup = async (req, res) => {
    try {
        const groupRepository = new groupMongoRepository();
        const { id } = req.params;
        const deletedGroup = await groupRepository.deleteById({ _id: id, companyId: req.companyId });
        if (!deletedGroup) {
            return res.status(404).json({ message: "Grupo no encontrado o no se pudo eliminar" });
        }
        res.status(200).json({ message: "Grupo eliminado correctamente" });
    } catch (error) {
        throw createError("No pudo eliminar el grupo", 500);
    }
}
