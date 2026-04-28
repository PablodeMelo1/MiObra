import { createError } from '../error/create-error.mjs';
import ItemRepository from '../repositories/item-repository.mjs';
import { ITEM_TYPES } from '../constants/itemType.mjs';

const normalizeByType = (itemType, totalQuantity, availableQuantity, fallbackTotal = 1, fallbackAvailable = 1) => {
  const safeTotal = totalQuantity != null ? Number(totalQuantity) : Number(fallbackTotal);
  const safeAvailable = availableQuantity != null ? Number(availableQuantity) : Number(fallbackAvailable);

  if (itemType === ITEM_TYPES.UNIQUE) {
    const uniqueAvailable = safeAvailable > 0 ? 1 : 0;
    return { totalQuantity: 1, availableQuantity: uniqueAvailable };
  }

  const boundedTotal = Number.isFinite(safeTotal) && safeTotal > 0 ? safeTotal : 1;
  const boundedAvailable = Number.isFinite(safeAvailable) && safeAvailable >= 0 ? Math.min(safeAvailable, boundedTotal) : boundedTotal;
  return {
    totalQuantity: boundedTotal,
    availableQuantity: boundedAvailable,
  };
};

export const createItem = async (req, res) => {
  try {
    const repo = new ItemRepository();
    const { name, itemType, description, totalQuantity, availableQuantity, zoneId, aditionalInfo, profileImage, profileImagePublicId } = req.body;

    if (!name || !itemType) {
      return res.status(400).json({ message: 'name e itemType son requeridos' });
    }

    const normalized = normalizeByType(itemType, totalQuantity, availableQuantity);

    const data = {
      name,
      itemType,
      description,
      totalQuantity: normalized.totalQuantity,
      availableQuantity: normalized.availableQuantity,
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
    const updateData = { ...req.body };
    if (!id) return res.status(400).json({ message: 'id es requerido' });

    const current = await repo.getById(id);
    if (!current) return res.status(404).json({ message: 'Item no encontrado' });

    const nextType = updateData.itemType || current.itemType;
    const normalized = normalizeByType(
      nextType,
      updateData.totalQuantity,
      updateData.availableQuantity,
      current.totalQuantity,
      current.availableQuantity
    );

    updateData.itemType = nextType;
    updateData.totalQuantity = normalized.totalQuantity;
    updateData.availableQuantity = normalized.availableQuantity;

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
