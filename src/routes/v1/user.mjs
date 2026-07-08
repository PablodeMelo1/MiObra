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
import { COMPANY_ROLES } from "../../constants/companyRoles.mjs";


const routes = express.Router();

routes.get("/", auth, getAll);
routes.get("/:id", auth, getUserById);
routes.put("/:id", auth, updateUser);
routes.delete("/:id", auth, requireRole(COMPANY_ROLES.OWNER, COMPANY_ROLES.ADMIN), deleteUser);

// Solo owner/admin de la empresa activa pueden cambiar roles de membresia.
routes.patch("/:id/role", auth, requireRole(COMPANY_ROLES.OWNER, COMPANY_ROLES.ADMIN), changeUserRole);

export default routes;
