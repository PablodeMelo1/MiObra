import { createError } from '../error/create-error.mjs';
import ZoneRepository from '../repositories/zones-repository.mjs';

export const createZone = async (req, res) => {
    try {
        const repo = new ZoneRepository();
        const body = req.body || {};
        const { name, description } = body;
        if (!name) return res.status(400).json({ message: 'El nombre es obligatorio' });
        const newZone = { name, description };
        const created = await repo.createZone(newZone);
        if (!created) return res.status(500).json({ message: 'Error al crear la zona' });
        res.status(201).json(created);
    } catch (error) {
        console.error('Zone create error:', error);
        return res.status(500).json({ message: 'No pudo crear la zona', error: error.message });
    }
}

export const getZoneById = async (req, res) => {
    try {
        const repo = new ZoneRepository();
        const { id } = req.params;
        const zone = await repo.getZoneById(id);
        if (!zone) return res.status(404).json({ message: 'Zona no encontrada' });
        res.status(200).json(zone);
    } catch (error) {
        throw createError('No pudo obtener la zona', 500);
    }
}

export const getAllZones = async (req, res) => {
    try {
        const repo = new ZoneRepository();
        const zones = await repo.getAll();
        res.status(200).json(zones);
    } catch (error) {
        throw createError('No pudo obtener las zonas', 500);
    }
}

export const updateZone = async (req, res) => {
    try {
        const repo = new ZoneRepository();
        const { id } = req.params;
        const updateData = req.body || {};
        const updated = await repo.updateById(id, updateData);
        if (!updated) return res.status(404).json({ message: 'Zona no encontrada o no se pudo actualizar' });
        res.status(200).json(updated);
    } catch (error) {
        console.error('Zone update error:', error);
        return res.status(500).json({ message: 'No pudo actualizar la zona', error: error.message });
    }
}

export const deleteZone = async (req, res) => {
    try {
        const repo = new ZoneRepository();
        const { id } = req.params;
        const deleted = await repo.deleteById(id);
        if (!deleted) return res.status(404).json({ message: 'Zona no encontrada o no se pudo eliminar' });
        res.status(200).json({ message: 'Zona eliminada correctamente' });
    } catch (error) {
        throw createError('No pudo eliminar la zona', 500);
    }
}
