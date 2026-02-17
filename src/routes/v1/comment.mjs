import express from "express";
import {
    createComment,
    getCommentsByEntity,
    deleteComment,
    updateComment,
    getCommentById
} from "../../controllers/comment-controller.mjs";

const routes = express.Router();

routes.post("/:entityType/:entityId", createComment);
routes.get("/:entityType/:entityId", getCommentsByEntity);
routes.get("/:id", getCommentById);
routes.put("/:id", updateComment);
routes.delete("/:id", deleteComment);

export default routes;
