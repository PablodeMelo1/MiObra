import { createError } from "../error/create-error.mjs";
import taskMongoRepository from "../repositories/task-repository.mjs";
import projectMongoRepository from "../repositories/project-repository.mjs";
import CompanyMemberRepository from "../repositories/companyMember-repository.mjs";

const isUserInCompany = async (userId, companyId) => {
    if (!userId) return true;
    const memberRepo = new CompanyMemberRepository();
    const memberIds = await memberRepo.findActiveUserIdsByCompanyId(companyId);
    return memberIds.some((memberId) => String(memberId) === String(userId));
};

export const createTask = async (req, res) => {
    try {
        const taskRepository = new taskMongoRepository();
        const projectRepository = new projectMongoRepository();
        const { projectId } = req.params;
        const companyId = req.companyId;
        const { list, ...taskData } = req.body;

        if (!taskData.title || !taskData.description) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }
        if (!projectId) {
            return res.status(400).json({ message: "ProjectId es requerido" });
        }
        if (!list) {
            return res.status(400).json({ message: "La lista es requerida" });
        }

        // Validar que la lista existe en el proyecto
        const project = await projectRepository.getById({ _id: projectId, companyId });
        if (!project) {
            return res.status(404).json({ message: "Proyecto no encontrado" });
        }
        if (!project.lists.includes(list)) {
            return res.status(400).json({ message: `La lista '${list}' no existe en este proyecto` });
        }
        if (!(await isUserInCompany(taskData.assignedTo, companyId))) {
            return res.status(403).json({ message: "El usuario asignado no pertenece a la empresa activa" });
        }

        const newTask = { ...taskData, projectId, list, companyId };

        const createdTask = await taskRepository.createOne(newTask);
        if (!createdTask) {
            return res.status(500).json({ message: "Error al crear la tarea" });
        }

        res.status(201).json(createdTask);
    } catch (error) {
        throw createError("No pudo crear la tarea del proyecto", 500);
    }
}

export const getAllTasks = async (req, res) => {
    try {
        const taskRepository = new taskMongoRepository();
        const tasks = await taskRepository.getAll(req.companyId);
        res.status(200).json({ tareas: tasks });
    } catch (error) {
        throw createError("No pudo obtener las tareas", 500);
    }
}

export const getTasksByProjectId = async (req, res) => {
    try {
        const taskRepository = new taskMongoRepository();
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(400).json({ message: "ProjectId es requerido" });
        }

        const tasks = await taskRepository.getAllByProjectId(projectId, req.companyId);
        res.status(200).json({ tareas: tasks });
    } catch (error) {
        throw createError("No pudo obtener las tareas del proyecto", 500);
    }
}

export const getTaskByIdOnly = async (req, res) => {
    try {
        const taskRepository = new taskMongoRepository();
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Id es requerido" });
        }

        const tarea = await taskRepository.getById({ _id: id, companyId: req.companyId });
        if (!tarea) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        res.status(200).json({ tarea });
    } catch (error) {
        throw createError("No pudo obtener la tarea", 500);
    }
}

//devuelve una tarea para un cierto id del req dentro de un proyecto
export const getTaskById = async (req, res) => {
    try {
        const taskRepository = new taskMongoRepository();
        const { projectId, id } = req.params;

        if (!projectId) {
            return res.status(400).json({ message: "ProjectId es requerido" });
        }

        const tarea = await taskRepository.getByIdAndProject({ _id: id, project: projectId, companyId: req.companyId });

        if (!tarea) {
            return res.status(404).json({ message: "Tarea no encontrada en este proyecto" });
        }

        res.status(200).json({ tarea });
    } catch (error) {
        throw createError("No pudo obtener la tarea", 500);
    }
}

//obtener tareas del usuario dentro de un proyecto
export const getTasksByUser = async (req, res) => {
    try {
        const taskRepository = new taskMongoRepository();
        const { id: userId } = req.user;
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(400).json({ message: "ProjectId es requerido" });
        }

        const userTasks = await taskRepository.getByUserAndProject({ userId, project: projectId, companyId: req.companyId });
        res.status(200).json({ tareas: userTasks });
    } catch (error) {
        throw createError("No pudo obtener las tareas", 500);
    }
}

export const getTaskByContextText = async (req, res) => {
    try {
        const taskRepository = new taskMongoRepository();
        const { text } = req.query;
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(400).json({ message: "ProjectId es requerido" });
        }

        const userTasks = await taskRepository.getTasksByContextTextAndProject({ text, project: projectId });
        res.status(200).json({ tareas: userTasks });
    } catch (error) {
        throw createError("No pudo obtener las tareas", 500);
    }
}

// Actualizar tarea (mover entre listas, cambiar orden, etc.)
export const updateTask = async (req, res) => {
    try {
        const taskRepository = new taskMongoRepository();
        const { projectId, id } = req.params;
        const { list, ...updateData } = req.body;

        if (!projectId) {
            return res.status(400).json({ message: "ProjectId es requerido" });
        }

        // Obtener tarea actual
        const currentTask = await taskRepository.getByIdAndProject({ _id: id, project: projectId, companyId: req.companyId });
        if (!currentTask) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        // Si se intenta cambiar de lista, validar que existe
        if (list && list !== currentTask.list) {
            const projectRepository = new projectMongoRepository();
            const project = await projectRepository.getById({ _id: projectId, companyId: req.companyId });
            if (!project || !project.lists.includes(list)) {
                return res.status(400).json({ message: `La lista '${list}' no existe en este proyecto` });
            }
        }

        delete updateData.companyId;
        delete updateData.projectId;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        const taskUpdates = { ...updateData };
        if (list) taskUpdates.list = list;
        if (!(await isUserInCompany(taskUpdates.assignedTo, req.companyId))) {
            return res.status(403).json({ message: "El usuario asignado no pertenece a la empresa activa" });
        }

        const updatedTask = await taskRepository.updateTask({ _id: id, projectId, ...taskUpdates, companyId: req.companyId });

        if (!updatedTask) {
            return res.status(500).json({ message: "Error al actualizar la tarea" });
        }

        res.status(200).json({ tarea: updatedTask });
    } catch (error) {
        throw createError("No pudo actualizar la tarea", 500);
    }
}

// Obtener todas las tareas de una lista específica (ordenadas)
export const getTasksByList = async (req, res) => {
    try {
        const taskRepository = new taskMongoRepository();
        const { projectId, listName } = req.params;

        if (!projectId || !listName) {
            return res.status(400).json({ message: "ProjectId y ListName son requeridos" });
        }

        const tasks = await taskRepository.getTasksByList({ projectId, list: listName, companyId: req.companyId });
        res.status(200).json({ tareas: tasks });
    } catch (error) {
        throw createError("No pudo obtener las tareas de la lista", 500);
    }
}

export const deleteTask = async (req, res) => {
    try {
        const taskRepository = new taskMongoRepository();
        const { projectId, id } = req.params;
        if (!projectId) {
            return res.status(400).json({ message: "ProjectId es requerido" });
        }
        const deleted = await taskRepository.deleteById({ _id: id, companyId: req.companyId });
        if (!deleted) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }
        res.status(200).json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
        throw createError("No pudo eliminar la tarea", 500);
    }
}

export const updateStatus = async (req, res) => {
    try {
        const taskRepository = new taskMongoRepository();
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: "Status es requerido" });
        }
        const updatedTask = await taskRepository.updateStatus({ _id: id, status, companyId: req.companyId });
        res.status(200).json({ tarea: updatedTask });

    } catch (error) {
        throw createError("No pudo actualizar el estado de la tarea", 500);
    }
}

export const updatePriority = async (req, res) => {
    try {
        const taskRepository = new taskMongoRepository();
        const { id } = req.params;
        const { priority } = req.body;
        if (!priority) {
            return res.status(400).json({ message: "Priority es requerida" });
        }
        const updatedTask = await taskRepository.updatePriority({ _id: id, priority, companyId: req.companyId });
        res.status(200).json({ tarea: updatedTask });
    } catch (error) {
        throw createError("No pudo actualizar la prioridad de la tarea", 500);
    }
}

export const updateAssignedTo = async (req, res) => {
    try {
        const taskRepository = new taskMongoRepository();
        const { id } = req.params;
        const { assignedTo } = req.body;
        if (!assignedTo) {
            return res.status(400).json({ message: "AssignedTo es requerido" });
        }
        if (!(await isUserInCompany(assignedTo, req.companyId))) {
            return res.status(403).json({ message: "El usuario asignado no pertenece a la empresa activa" });
        }
        const updatedTask = await taskRepository.updateAssigned({ _id: id, assignedTo, companyId: req.companyId });
        res.status(200).json({ tarea: updatedTask });
    } catch (error) {
        throw createError("No pudo actualizar el assignedTo de la tarea", 500);
    }
}




