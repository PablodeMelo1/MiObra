import express from 'express';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} from '../../controllers/item-controller.mjs';
import { checkout, checkin } from '../../controllers/itemInventory-controller.mjs';
import { auth } from "../../middleware/auth-middleware.mjs";

const routes = express.Router();

// Items CRUD
routes.post('/', auth, createItem);
routes.get('/', auth, getAllItems);
routes.get('/:id', auth, getItemById);
routes.put('/:id', auth, updateItem);
routes.delete('/:id', auth, deleteItem);

// Inventory actions
routes.post('/:id/checkout', auth, checkout);
routes.post('/:id/checkin', auth, checkin);

export default routes;
