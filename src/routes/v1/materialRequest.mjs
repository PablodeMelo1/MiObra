import express from "express";
import {
    createMaterialRequest,
    getMaterialRequestById,
    deleteMaterialRequest,
    updateMaterialRequest,
    getAllMaterialRequests,
    updateMaterialRequestStatus
} from "../../controllers/materialRequest-controller.mjs";
import { auth } from "../../middleware/auth-middleware.mjs";

const routes = express.Router();

routes.post("/", auth, createMaterialRequest);
routes.get("/", auth, getAllMaterialRequests);
routes.get("/:id", auth, getMaterialRequestById);
routes.put("/:id", auth, updateMaterialRequest);
routes.patch("/:id/status", auth, updateMaterialRequestStatus);
routes.delete("/:id", auth, deleteMaterialRequest);

export default routes;
