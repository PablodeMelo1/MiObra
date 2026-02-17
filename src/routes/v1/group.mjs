import express from "express";
import {
    createGroup,
    getGroupById,
    getAllGroups,
    getGroupsByUser,
    updateGroup,
    deleteGroup
} from "../../controllers/group-controller.mjs";

const routes = express.Router();

routes.post("/", createGroup);
routes.get("/", getAllGroups);
routes.get("/user/:userId", getGroupsByUser);
routes.get("/:id", getGroupById);
routes.put("/:id", updateGroup);
routes.delete("/:id", deleteGroup);

export default routes;
