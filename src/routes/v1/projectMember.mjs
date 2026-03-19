import express from "express";
import {
    createProjectMember,
    getProjectMembers,
    deleteProjectMember,
    updateProjectMemberRole,
    getProjectMemberById,
    getAllProjectMembers
} from "../../controllers/projectMember-controller.mjs";
import { auth } from "../../middleware/auth-middleware.mjs";

const routes = express.Router();

routes.post("/", auth, createProjectMember);
routes.get("/", auth, getAllProjectMembers);
routes.get("/project/:projectId", auth, getProjectMembers);
routes.get("/:id", auth, getProjectMemberById);
routes.put("/:id/role", auth, updateProjectMemberRole);
routes.delete("/:id", auth, deleteProjectMember);

export default routes;
