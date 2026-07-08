/**
 * Middleware factory que verifica que el usuario autenticado tenga uno
 * de los roles de empresa permitidos. Debe usarse DESPUES de auth.
 *
 * @param  {...string} roles - Roles permitidos para acceder a la ruta.
 */
export const requireRole = (...roles) => {
    return (req, res, next) => {
        const companyRole = req.companyRole;

        if (!companyRole) {
            return res.status(401).json({ message: "No autenticado" });
        }

        if (!roles.includes(companyRole)) {
            return res.status(403).json({
                message: "No tienes permisos para acceder a este recurso",
            });
        }

        next();
    };
};
