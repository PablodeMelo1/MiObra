import express from "express";
import {
	createTask,
	updateTask,
	updatePriority,
	updateAssignedTo,
	deleteTask,
	getTasksByList,
	updateStatus,
	getAllTasks,
	getTaskByIdOnly,
	getTasksByProjectId
} from "../../controllers/task-controller.mjs";

const routes = express.Router();

// Crear una task
routes.post("/project/:projectId", createTask);

// Modificar una task
routes.put("/project/:projectId/:id", updateTask);

// Cambiar prioridad de una task
routes.patch("/:id/priority", updatePriority);

// Cambiar assignedTo de una task
routes.patch("/:id/assigned", updateAssignedTo);

// Cambiar status de una task
routes.patch("/:id/status", updateStatus);

// Eliminar una task
routes.delete("/project/:projectId/:id", deleteTask);

// Obtener task por lista de un proyecto
routes.get("/project/:projectId/list/:listName", getTasksByList);

// Obtener tareas
routes.get("/", getAllTasks);
routes.get("/project/:projectId", getTasksByProjectId);
routes.get("/:id", getTaskByIdOnly);

export default routes;
