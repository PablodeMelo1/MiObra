import express from "express";
import {
    createGroup,
    getGroupById,
    getAllGroups,
    getGroupsByUser,
    updateGroup,
    deleteGroup
} from "../../controllers/group-controller.mjs";
import { auth } from "../../middleware/auth-middleware.mjs";

const routes = express.Router();

routes.post("/", auth, createGroup);
routes.get("/", auth, getAllGroups);
routes.get("/user/:userId", auth, getGroupsByUser);
routes.get("/:id", auth, getGroupById);
routes.put("/:id", auth, updateGroup);
routes.delete("/:id", auth, deleteGroup);

export default routes;
