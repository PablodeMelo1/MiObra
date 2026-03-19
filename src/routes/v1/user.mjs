import express from "express";
import {
    createUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser,
    getAll,
    changeUserRole
} from "../../controllers/user-controller.mjs";
import { auth } from "../../middleware/auth-middleware.mjs";
import { requireRole } from "../../middleware/role-middleware.mjs";
import { userRoles } from "../../constants/userRole.mjs";


const routes = express.Router();

routes.get("/", auth, getAll);
routes.get("/:id", auth, getUserById);
routes.put("/:id", auth, updateUser);
routes.delete("/:id", auth, deleteUser);

// Solo el admin puede cambiar el rol de un usuario
routes.patch("/:id/role", auth, requireRole(userRoles.ADMIN), changeUserRole);

export default routes;
