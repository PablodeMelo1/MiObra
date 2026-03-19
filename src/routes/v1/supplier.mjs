import express from "express";
import {
    createSupplier,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
    getAllSuppliers,
    searchSuppliersByName
} from "../../controllers/supplier-controller.mjs";
import { auth } from "../../middleware/auth-middleware.mjs";

const routes = express.Router();

routes.post("/", auth, createSupplier);
routes.get("/", auth, getAllSuppliers);
routes.get("/search", auth, searchSuppliersByName);
routes.get("/:id", auth, getSupplierById);
routes.put("/:id", auth, updateSupplier);
routes.delete("/:id", auth, deleteSupplier);

export default routes;
