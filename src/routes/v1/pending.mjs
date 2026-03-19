import express from "express";
import {
    createPending,
    getPendingById,
    getAllPending,
    getPendingsByUser,
    updatePending,
    deletePending
} from "../../controllers/pending-controller.mjs";
import { auth } from "../../middleware/auth-middleware.mjs";

const routes = express.Router();

routes.post("/", auth, createPending);
routes.get("/", auth, getAllPending);
routes.get("/user/:userId", auth, getPendingsByUser);
routes.get("/:id", auth, getPendingById);
routes.put("/:id", auth, updatePending);
routes.delete("/:id", auth, deletePending);

export default routes;
