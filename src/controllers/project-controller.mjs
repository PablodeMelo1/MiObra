import mongoose from 'mongoose';
import projectRepository from '../repositories/project-repository.mjs';
import ProjectMemberRepository from '../repositories/projectMember-repository.mjs';
import { createError } from '../error/create-error.mjs';
import { PROJECT_ROLE } from '../constants/projectRoles.mjs';

export const createProject = async (req, res) => {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Usuario no autenticado' });

    const { name, description, location, startDate, endDate, lists } = req.body || {};
    if (!name) return res.status(400).json({ message: 'Faltan datos obligatorios' });

    const newProject = { name, description, location, startDate, endDate, lists };

    const projectRepo = new projectRepository();
    const memberRepo = new ProjectMemberRepository();

    try {
        const createdProject = await projectRepo.createOne(newProject);

        const memberData = {
            userId,
            projectId: createdProject._id,
            role: PROJECT_ROLE.OWNER,
        };

        await memberRepo.createOne(memberData);

        return res.status(201).json(createdProject);
    } catch (error) {
        console.error('Create project (transaction) error:', error);
        if (error && error.code === 11000) {
            return res.status(409).json({ message: 'El usuario ya pertenece a este proyecto' });
        }
        return res.status(500).json({ message: error && error.message ? error.message : 'No pudo crear el proyecto' });
    }
}

export const getProjectById = async (req, res) => {
    try {
        const projectRepo = new projectRepository();
        const memberRepo = new ProjectMemberRepository();
        const { id } = req.params;
        const userId = req.user && req.user.id;

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        const memberships = await memberRepo.findByUserId(userId);
        const isMember = memberships.some((member) => String(member.projectId) === String(id));
        if (!isMember) {
            return res.status(403).json({ message: 'No tienes permisos para ver este proyecto' });
        }

        const project = await projectRepo.getById({ _id: id });
        if (!project) {
            return res.status(404).json({ message: "Proyecto no encontrado" });
        }
        res.status(200).json({ project });
    }
    catch (error) {
        throw createError("No pudo obtener el proyecto", 500);
    }
}

export const updateProject = async (req, res) => {
    try {
        const projectRepo = new projectRepository();
        const memberRepo = new ProjectMemberRepository();
        const { id } = req.params;
        const userId = req.user && req.user.id;

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        const memberships = await memberRepo.findByUserId(userId);
        const isMember = memberships.some((member) => String(member.projectId) === String(id));
        if (!isMember) {
            return res.status(403).json({ message: 'No tienes permisos para modificar este proyecto' });
        }

        const updateData = req.body;
        const updatedProject = await projectRepo.updateById({ _id: id }, updateData);
        if (!updatedProject) {
            return res.status(404).json({ message: "Proyecto no encontrado o no se pudo actualizar" });
        }
        res.status(200).json(updatedProject);
    }
    catch (error) {
        throw createError("No pudo actualizar el proyecto", 500);
    }
}

export const deleteProject = async (req, res) => {
    try {
        const projectRepo = new projectRepository();
        const memberRepo = new ProjectMemberRepository();
        const { id } = req.params;
        const userId = req.user && req.user.id;

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        const memberships = await memberRepo.findByUserId(userId);
        const isMember = memberships.some((member) => String(member.projectId) === String(id));
        if (!isMember) {
            return res.status(403).json({ message: 'No tienes permisos para eliminar este proyecto' });
        }

        const deletedProject = await projectRepo.deleteById({ _id: id });
        if (!deletedProject) {
            return res.status(404).json({ message: "Proyecto no encontrado o no se pudo eliminar" });
        }
        res.status(200).json({ message: "Proyecto eliminado correctamente" });
    }
    catch (error) {
        throw createError("No pudo eliminar el proyecto", 500);
    }
}

export const getAllProjectsByUser = async (req, res) => {
    try {
        const projectRepo = new projectRepository();
        const { userId } = req.params;
        const authUserId = req.user && req.user.id;

        if (!authUserId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        if (String(userId) !== String(authUserId)) {
            return res.status(403).json({ message: 'No tienes permisos para consultar estos proyectos' });
        }

        const projects = await projectRepo.getByUserId(authUserId);
        res.status(200).json({ projects });
    }
    catch (error) {
        throw createError("No pudo obtener los proyectos del usuario", 500);
    }
}
export const getAllProjects = async (req, res) => {
    try {
        const projectRepo = new projectRepository();
        const userId = req.user && req.user.id;

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        const projects = await projectRepo.getByUserId(userId);
        res.status(200).json({ projects });
    } catch (error) {
        throw createError("No pudo obtener los proyectos", 500);
    }
}

export const getAllProjectsCatalog = async (req, res) => {
    try {
        const projectRepo = new projectRepository();
        const userId = req.user && req.user.id;

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        const projects = await projectRepo.getAll();
        return res.status(200).json({ projects });
    } catch (error) {
        throw createError('No pudo obtener el catalogo de proyectos', 500);
    }
}

