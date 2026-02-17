// middlewares/xss.js
import xss from "xss";

export const xssSanitizer = (req, res, next) => {
    // Función para sanitizar recursivamente todos los valores de un objeto
    const sanitizeObject = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === "string") {
                obj[key] = xss(obj[key]); // sanitize string
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                sanitizeObject(obj[key]);
            }
        }
    };

    sanitizeObject(req.body);
    sanitizeObject(req.params);
    sanitizeObject(req.query);
    next();
};
