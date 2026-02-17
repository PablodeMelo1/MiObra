import { createError } from "../error/create-error.mjs";
import supplierMongoRepository from "../repositories/supplier-repository.mjs";

export const createSupplier = async (req, res) => {
    try {
        const supplierRepository = new supplierMongoRepository();
        const { name, contactEmail, contactPhone, address } = req.body;
        if (!name || !contactEmail) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }
        const newSupplier = { name, contactEmail, contactPhone, address };
        const createdSupplier = await supplierRepository.createOne(newSupplier);
        if (!createdSupplier) {
            return res.status(500).json({ message: "Error al crear el proveedor" });
        }
        res.status(201).json(createdSupplier);
    } catch (error) {
        throw createError("No pudo crear el proveedor", 500);
    }
}

export const getSupplierById = async (req, res) => {
    try {
        const supplierRepository = new supplierMongoRepository();
        const { id } = req.params;
        const supplier = await supplierRepository.getById({ _id: id });
        if (!supplier) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }
        res.status(200).json({ supplier });
    }
    catch (error) {
        throw createError("No pudo obtener el proveedor", 500);
    }
}

export const updateSupplier = async (req, res) => {
    try {
        const supplierRepository = new supplierMongoRepository();
        const { id } = req.params;
        const updateData = req.body;
        const updatedSupplier = await supplierRepository.updateById({ _id: id }, updateData);
        if (!updatedSupplier) {
            return res.status(404).json({ message: "Proveedor no encontrado o no se pudo actualizar" });
        }
        res.status(200).json(updatedSupplier);
    } catch (error) {
        throw createError("No pudo actualizar el proveedor", 500);
    }
}

export const deleteSupplier = async (req, res) => {
    try {
        const supplierRepository = new supplierMongoRepository();
        const { id } = req.params;
        const deletedSupplier = await supplierRepository.deleteById({ _id: id });
        if (!deletedSupplier) {
            return res.status(404).json({ message: "Proveedor no encontrado o no se pudo eliminar" });
        }
        res.status(200).json({ message: "Proveedor eliminado correctamente" });
    } catch (error) {
        throw createError("No pudo eliminar el proveedor", 500);
    }
}

export const getAllSuppliers = async (req, res) => {
    try {
        const supplierRepository = new supplierMongoRepository();
        const suppliers = await supplierRepository.getAll();
        res.status(200).json({ suppliers });
    } catch (error) {
        throw createError("No pudo obtener los proveedores", 500);
    }
}
export const searchSuppliersByName = async (req, res) => {
    try {
        const supplierRepository = new supplierMongoRepository();
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ message: "El parámetro 'name' es requerido" });
        }
        const suppliers = await supplierRepository.searchByName(name);
        res.status(200).json({ suppliers });
    } catch (error) {
        throw createError("No pudo buscar los proveedores por nombre", 500);
    }
}

