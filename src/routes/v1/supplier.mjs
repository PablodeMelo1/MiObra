import express from "express";
import {
    createSupplier,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
    getAllSuppliers,
    searchSuppliersByName
} from "../../controllers/supplier-controller.mjs";

const routes = express.Router();

routes.post("/", createSupplier);
routes.get("/", getAllSuppliers);
routes.get("/search", searchSuppliersByName);
routes.get("/:id", getSupplierById);
routes.put("/:id", updateSupplier);
routes.delete("/:id", deleteSupplier);

export default routes;
