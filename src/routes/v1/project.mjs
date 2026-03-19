import express from "express";
import {
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    getAllProjectsByUser,
    getAllProjects,
    getAllProjectsCatalog
} from "../../controllers/project-controller.mjs";
import { auth } from "../../middleware/auth-middleware.mjs";

const routes = express.Router();

routes.post("/", auth, createProject);
routes.get("/", auth, getAllProjects);
routes.get("/catalog", auth, getAllProjectsCatalog);
routes.get("/user/:userId", auth, getAllProjectsByUser);
routes.get("/:id", auth, getProjectById);
routes.put("/:id", auth, updateProject);
routes.delete("/:id", auth, deleteProject);

export default routes;
