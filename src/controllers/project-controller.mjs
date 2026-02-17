import projectRepository from '../repositories/project-repository.mjs';

export const createProject = async (req, res) => {
    try {
        const projectRepo = new projectRepository();
        const { name, description, location, startDate, endDate, lists } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }
        const newProject = { name, description, location, startDate, endDate, lists };
        const createdProject = await projectRepo.createOne(newProject);
        if (!createdProject) {
            return res.status(500).json({ message: "Error al crear el proyecto" });
        }
        res.status(201).json(createdProject);
    }
    catch (error) {
        throw createError("No pudo crear el proyecto", 500);
    }
}

export const getProjectById = async (req, res) => {
    try {
        const projectRepo = new projectRepository();
        const { id } = req.params;
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
        const { id } = req.params;
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
        const { id } = req.params;
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
        const projects = await projectRepo.getByUserId({ userId });
        res.status(200).json({ projects });
    }
    catch (error) {
        throw createError("No pudo obtener los proyectos del usuario", 500);
    }
}
export const getAllProjects = async (req, res) => {
    try {
        const projectRepo = new projectRepository();
        const projects = await projectRepo.getAll();
        res.status(200).json({ projects });
    } catch (error) {
        throw createError("No pudo obtener los proyectos", 500);
    }
}

