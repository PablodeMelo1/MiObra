import express from "express";
import {
    createProjectMember,
    getProjectMembers,
    deleteProjectMember,
    updateProjectMemberRole,
    getProjectMemberById,
    getAllProjectMembers
} from "../../controllers/projectMember-controller.mjs";

const routes = express.Router();

routes.post("/", createProjectMember);
routes.get("/", getAllProjectMembers);
routes.get("/project/:projectId", getProjectMembers);
routes.get("/:id", getProjectMemberById);
routes.put("/:id/role", updateProjectMemberRole);
routes.delete("/:id", deleteProjectMember);

export default routes;
