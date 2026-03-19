import { userRoles } from "../constants/userRole.mjs";

/**
 * Middleware factory que verifica que el usuario autenticado tenga uno
 * de los roles permitidos. Debe usarse DESPUÉS de authMiddleware.
 *
 * Uso: requireRole(userRoles.ADMIN)
 *      requireRole(userRoles.ADMIN, userRoles.USER)
 *
 * @param  {...string} roles - Roles permitidos para acceder a la ruta.
 */
export const requireRole = (...roles) => {
    return (req, res, next) => {
        const tipoUsuario = req.user?.tipoUsuario;

        if (!tipoUsuario) {
            return res.status(401).json({ message: "No autenticado" });
        }

        if (!roles.includes(tipoUsuario)) {
            return res.status(403).json({
                message: "No tienes permisos para acceder a este recurso",
            });
        }

        next();
    };
};
