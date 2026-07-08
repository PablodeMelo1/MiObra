import mongoose from 'mongoose';
import { createError } from '../error/create-error.mjs';
import ItemRepository from '../repositories/item-repository.mjs';
import ItemActivityRepository from '../repositories/itemActivity-repository.mjs';
import InventoryMovementRepository from '../repositories/inventoryMovement-repository.mjs';
import CompanyMemberRepository from '../repositories/companyMember-repository.mjs';

const isUserInCompany = async (userId, companyId) => {
    const memberRepo = new CompanyMemberRepository();
    const memberIds = await memberRepo.findActiveUserIdsByCompanyId(companyId);
    return memberIds.some((memberId) => String(memberId) === String(userId));
};

const buildActivity = ({ itemId, userId, type, quantity, remainingQuantity, status, zoneId, companyId }) => ({
    _id: new mongoose.Types.ObjectId(),
    companyId,
    itemId,
    userId,
    type,
    quantity,
    remainingQuantity,
    status,
    zoneId: zoneId || null,
});

const buildMovement = ({ itemId, itemName, itemType, userId, type, quantity, zoneId, companyId }) => ({
    _id: new mongoose.Types.ObjectId(),
    companyId,
    itemId,
    itemName,
    itemType,
    userId,
    type,
    quantity,
    zoneId: zoneId || null,
});

export const checkout = async (req, res) => {
    try {
        const itemRepo = new ItemRepository();
        const activityRepo = new ItemActivityRepository();
        const movementRepo = new InventoryMovementRepository();

        const { id } = req.params;
        const companyId = req.companyId;
        const userId = req.body?.userId || req.user?.id;
        const { quantity } = req.body;

        if (!userId || quantity == null) {
            return res.status(400).json({ message: 'userId y quantity son requeridos' });
        }
        if (!(await isUserInCompany(userId, companyId))) {
            return res.status(403).json({ message: 'El usuario no pertenece a la empresa activa' });
        }

        const qty = Number(quantity);
        if (isNaN(qty) || qty <= 0) {
            return res.status(400).json({ message: 'quantity debe ser un número mayor a 0' });
        }

        const item = await itemRepo.getById(id, companyId);
        if (!item) {
            return res.status(404).json({ message: 'Item no encontrado' });
        }

        if (item.itemType === 'unique' && qty !== 1) {
            return res.status(400).json({ message: 'Los items unique solo permiten checkout de 1 unidad' });
        }

        if ((item.availableQuantity || 0) < qty) {
            return res.status(400).json({ message: 'Cantidad disponible insuficiente' });
        }


        const updatedItem = await itemRepo.decrementAvailableQuantity(id, qty, companyId);

        const existingActivity = await activityRepo.findByItemAndUser(id, userId, item.zoneId || null, companyId);
        let consolidatedActivity;

        if (existingActivity) {
            consolidatedActivity = await activityRepo.applyCheckout(existingActivity._id, qty);
        } else {
            consolidatedActivity = await activityRepo.create(buildActivity({
                itemId: id,
                userId,
                type: 'CHECK_OUT',
                quantity: qty,
                remainingQuantity: qty,
                status: 'OPEN',
                zoneId: item.zoneId,
                companyId,
            }));
        }

        const movement = await movementRepo.create(buildMovement({
            itemId: id,
            itemName: item.name,
            itemType: item.itemType,
            userId,
            type: 'CHECK_OUT',
            quantity: qty,
            zoneId: item.zoneId,
            companyId,
        }));

        res.status(201).json({ item: updatedItem, activity: consolidatedActivity, movement });
    } catch (error) {
        throw createError('Error al realizar checkout', 500);
    }
}

export const checkin = async (req, res) => {
    try {
        const itemRepo = new ItemRepository();
        const activityRepo = new ItemActivityRepository();
        const movementRepo = new InventoryMovementRepository();

        const { id } = req.params;
        const companyId = req.companyId;
        const userId = req.body?.userId || req.user?.id;
        const { quantity } = req.body;

        if (!userId || quantity == null) {
            return res.status(400).json({ message: 'userId y quantity son requeridos' });
        }
        if (!(await isUserInCompany(userId, companyId))) {
            return res.status(403).json({ message: 'El usuario no pertenece a la empresa activa' });
        }

        const qty = Number(quantity);
        if (isNaN(qty) || qty <= 0) {
            return res.status(400).json({ message: 'quantity debe ser un número mayor a 0' });
        }

        // verify item exists and obtain zoneId
        const item = await itemRepo.getById(id, companyId);
        if (!item) {
            return res.status(404).json({ message: 'Item no encontrado' });
        }

        const zoneId = item.zoneId || null;

        const userActivity = await activityRepo.findByItemAndUser(id, userId, zoneId, companyId);

        if (!userActivity || (userActivity.remainingQuantity || 0) <= 0) {
            return res.status(404).json({ message: 'No existe cantidad pendiente para devolver de este item y usuario' });
        }

        if (qty > userActivity.remainingQuantity) {
            return res.status(400).json({ message: 'Quantity mayor al remainingQuantity de la actividad' });
        }

        const updatedItem = await itemRepo.incrementAvailableQuantity(id, qty, companyId);

        const newRemaining = userActivity.remainingQuantity - qty;
        let consolidatedActivity;

        if (newRemaining === 0) {
            await activityRepo.deleteById(userActivity._id);
            consolidatedActivity = null;
        } else {
            consolidatedActivity = await activityRepo.applyCheckin(userActivity._id, qty, 'OPEN');
        }

        const movement = await movementRepo.create(buildMovement({
            itemId: id,
            itemName: item.name,
            itemType: item.itemType,
            userId,
            type: 'CHECK_IN',
            quantity: qty,
            zoneId,
            companyId,
        }));

        res.status(200).json({ item: updatedItem, activity: consolidatedActivity, movement });
    } catch (error) {
        throw createError('Error al realizar checkin', 500);
    }
}

export const getItemActivities = async (req, res) => {
    try {
        const activityRepo = new ItemActivityRepository();
        const { id } = req.params;
        const limit = Number(req.query?.limit || 200);

        if (!id) {
            return res.status(400).json({ message: 'id es requerido' });
        }

        const activities = await activityRepo.getByItemId(id, Number.isFinite(limit) ? limit : 200, req.companyId);
        res.status(200).json(activities);
    } catch (error) {
        throw createError('Error al obtener historial del item', 500);
    }
};

export const getInventoryActivities = async (req, res) => {
    try {
        const movementRepo = new InventoryMovementRepository();
        const limit = Number(req.query?.limit || 500);
        const activities = await movementRepo.getAll(Number.isFinite(limit) ? limit : 500, req.companyId);
        res.status(200).json(activities);
    } catch (error) {
        throw createError('Error al obtener historial global del inventario', 500);
    }
};

export default {
    checkout,
    checkin,
    getItemActivities,
    getInventoryActivities
}
