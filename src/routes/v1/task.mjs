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
import { auth } from "../../middleware/auth-middleware.mjs";

const routes = express.Router();

// Crear una task
routes.post("/project/:projectId", auth, createTask);
// Modificar una task
routes.put("/project/:projectId/:id", auth, updateTask);
// Cambiar prioridad de una task
routes.patch("/:id/priority", auth, updatePriority);
// Cambiar assignedTo de una task
routes.patch("/:id/assigned", auth, updateAssignedTo);
// Cambiar status de una task
routes.patch("/:id/status", auth, updateStatus);
// Eliminar una task
routes.delete("/project/:projectId/:id", auth, deleteTask);
// Obtener task por lista de un proyecto
routes.get("/project/:projectId/list/:listName", auth, getTasksByList);

// Obtener tareas
routes.get("/", auth, getAllTasks);
routes.get("/project/:projectId", auth, getTasksByProjectId);
routes.get("/:id", auth, getTaskByIdOnly);

export default routes;
