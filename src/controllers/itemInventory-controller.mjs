import mongoose from 'mongoose';
import { createError } from '../error/create-error.mjs';
import ItemRepository from '../repositories/item-repository.mjs';
import ItemActivityRepository from '../repositories/itemActivity-repository.mjs';

export const checkout = async (req, res) => {
    try {
        const itemRepo = new ItemRepository();
        const activityRepo = new ItemActivityRepository();

        const { id } = req.params;
        const { userId, quantity } = req.body;

        if (!userId || quantity == null) {
            return res.status(400).json({ message: 'userId y quantity son requeridos' });
        }

        const qty = Number(quantity);
        if (isNaN(qty) || qty <= 0) {
            return res.status(400).json({ message: 'quantity debe ser un número mayor a 0' });
        }

        const item = await itemRepo.getById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item no encontrado' });
        }

        if ((item.availableQuantity || 0) < qty) {
            return res.status(400).json({ message: 'Cantidad disponible insuficiente' });
        }


        const updatedItem = await itemRepo.decrementAvailableQuantity(id, qty);

        const activityData = {
            _id: new mongoose.Types.ObjectId(),
            itemId: id,
            userId,
            type: 'CHECK_OUT',
            quantity: qty,
            remainingQuantity: qty,
            status: 'OPEN',
            zoneId: item.zoneId || null,
        };

        const createdActivity = await activityRepo.create(activityData);

        res.status(201).json({ item: updatedItem, activity: createdActivity });
    } catch (error) {
        throw createError('Error al realizar checkout', 500);
    }
}

export const checkin = async (req, res) => {
    try {
        const itemRepo = new ItemRepository();
        const activityRepo = new ItemActivityRepository();

        const { id } = req.params;
        const { userId, quantity } = req.body;

        if (!userId || quantity == null) {
            return res.status(400).json({ message: 'userId y quantity son requeridos' });
        }

        const qty = Number(quantity);
        if (isNaN(qty) || qty <= 0) {
            return res.status(400).json({ message: 'quantity debe ser un número mayor a 0' });
        }

        // verify item exists and obtain zoneId
        const item = await itemRepo.getById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item no encontrado' });
        }

        const zoneId = item.zoneId || null;

        const openActivity = await activityRepo.findOpenActivityByItemAndUser(id, userId, zoneId);
        if (!openActivity) {
            return res.status(404).json({ message: 'No existe actividad abierta para este item y usuario' });
        }

        if (qty > openActivity.remainingQuantity) {
            return res.status(400).json({ message: 'Quantity mayor al remainingQuantity de la actividad' });
        }

        const updatedItem = await itemRepo.incrementAvailableQuantity(id, qty);

        const newRemaining = openActivity.remainingQuantity - qty;
        let updatedActivity = await activityRepo.updateRemainingQuantity(openActivity._id, newRemaining);

        if (newRemaining === 0) {
            updatedActivity = await activityRepo.closeActivity(openActivity._id);
        }

        res.status(200).json({ item: updatedItem, activity: updatedActivity });
    } catch (error) {
        throw createError('Error al realizar checkin', 500);
    }
}

export default {
    checkout,
    checkin
}
