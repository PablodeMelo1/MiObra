import express from "express";
import {
    createMaterialRequest,
    getMaterialRequestById,
    deleteMaterialRequest,
    updateMaterialRequest,
    getAllMaterialRequests,
    updateMaterialRequestStatus,
    updateMaterialRequestPriority,
    updateMaterialRequestAssigned
} from "../../controllers/materialRequest-controller.mjs";

const routes = express.Router();

routes.post("/", createMaterialRequest);
routes.get("/", getAllMaterialRequests);
routes.get("/:id", getMaterialRequestById);
routes.put("/:id", updateMaterialRequest);
routes.patch("/:id/status", updateMaterialRequestStatus);
routes.patch("/:id/priority", updateMaterialRequestPriority);
routes.patch("/:id/assigned", updateMaterialRequestAssigned);
routes.delete("/:id", deleteMaterialRequest);

export default routes;
