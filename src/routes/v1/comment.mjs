import express from "express";
import {
    createComment,
    getCommentsByEntity,
    deleteComment,
    updateComment,
    getCommentById
} from "../../controllers/comment-controller.mjs";
import { auth } from "../../middleware/auth-middleware.mjs";

const routes = express.Router();

routes.post("/:entityType/:entityId", auth, createComment);
routes.get("/:entityType/:entityId", auth, getCommentsByEntity);
routes.get("/:id", auth, getCommentById);
routes.put("/:id", auth, updateComment);
routes.delete("/:id", auth, deleteComment);

export default routes;
