import express from "express";
import {
    createPending,
    getPendingById,
    getAllPending,
    getPendingsByUser,
    updatePending,
    deletePending
} from "../../controllers/pending-controller.mjs";

const routes = express.Router();

routes.post("/", createPending);
routes.get("/", getAllPending);
routes.get("/user/:userId", getPendingsByUser);
routes.get("/:id", getPendingById);
routes.put("/:id", updatePending);
routes.delete("/:id", deletePending);

export default routes;
