import express from "express";
import {
    getUserById,
    updateUser,
    getAll
} from "../../controllers/user-controller.mjs";
import { auth } from "../../middleware/auth-middleware.mjs";


const routes = express.Router();

routes.get("/", auth, getAll);
routes.get("/:id", auth, getUserById);
routes.put("/:id", auth, updateUser);

export default routes;
