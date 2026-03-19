import { createError } from '../error/create-error.mjs';
import ItemRepository from '../repositories/item-repository.mjs';

export const createItem = async (req, res) => {
  try {
    const repo = new ItemRepository();
    const { name, itemType, description, totalQuantity, availableQuantity, zoneId, aditionalInfo, profileImage, profileImagePublicId } = req.body;

    if (!name || !itemType) {
      return res.status(400).json({ message: 'name e itemType son requeridos' });
    }

    const data = {
      name,
      itemType,
      description,
      totalQuantity: totalQuantity != null ? Number(totalQuantity) : undefined,
      availableQuantity: availableQuantity != null ? Number(availableQuantity) : undefined,
      zoneId,
      aditionalInfo,
      profileImage,
      profileImagePublicId,
    };

    const created = await repo.createOne(data);
    res.status(201).json(created);
  } catch (error) {
    throw createError('No pudo crear el item', 500);
  }
};

export const getAllItems = async (req, res) => {
  try {
    const repo = new ItemRepository();
    const { zoneId, itemType } = req.query;
    const filter = {};
    if (zoneId) filter.zoneId = zoneId;
    if (itemType) filter.itemType = itemType;
    const items = await repo.getAll(filter);
    res.status(200).json(items);
  } catch (error) {
    throw createError('No pudo obtener items', 500);
  }
};

export const getItemById = async (req, res) => {
  try {
    const repo = new ItemRepository();
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'id es requerido' });
    const item = await repo.getById(id);
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    res.status(200).json(item);
  } catch (error) {
    throw createError('No pudo obtener el item', 500);
  }
};

export const updateItem = async (req, res) => {
  try {
    const repo = new ItemRepository();
    const { id } = req.params;
    const updateData = req.body;
    if (!id) return res.status(400).json({ message: 'id es requerido' });
    const updated = await repo.updateById(id, updateData);
    if (!updated) return res.status(404).json({ message: 'Item no encontrado' });
    res.status(200).json(updated);
  } catch (error) {
    throw createError('No pudo actualizar el item', 500);
  }
};

export const deleteItem = async (req, res) => {
  try {
    const repo = new ItemRepository();
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'id es requerido' });
    const deleted = await repo.deleteById(id);
    if (!deleted) return res.status(404).json({ message: 'Item no encontrado' });
    res.status(200).json({ message: 'Item eliminado correctamente' });
  } catch (error) {
    throw createError('No pudo eliminar el item', 500);
  }
};

export default {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
