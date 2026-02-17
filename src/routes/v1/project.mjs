import express from "express";
import {
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    getAllProjectsByUser,
    getAllProjects
} from "../../controllers/project-controller.mjs";

const routes = express.Router();

routes.post("/", createProject);
routes.get("/", getAllProjects);
routes.get("/user/:userId", getAllProjectsByUser);
routes.get("/:id", getProjectById);
routes.put("/:id", updateProject);
routes.delete("/:id", deleteProject);

export default routes;
