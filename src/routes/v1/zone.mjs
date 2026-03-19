import express from 'express';
import {
    createZone,
    getZoneById,
    getAllZones,
    updateZone,
    deleteZone
} from '../../controllers/zone-controller.mjs';
import { auth } from '../../middleware/auth-middleware.mjs';

const routes = express.Router();

routes.post('/', auth, createZone);
routes.get('/', auth, getAllZones);
routes.get('/:id', auth, getZoneById);
routes.put('/:id', auth, updateZone);
routes.delete('/:id', auth, deleteZone);

export default routes;
