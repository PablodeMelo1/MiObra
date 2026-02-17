import jwt from "jsonwebtoken";
import "dotenv/config";
import { validateAuth } from "../validations/validation-user.mjs";

const { PASS_JWT } = process.env;


export const authMiddleware = (req, res, next) => {
    console.log("Entro en auth");

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: "No se pudo autenticar" });
        }
        //separa el authorization por el espacion y se queda con el segundo campo (el token en si)
        const token = authHeader.split(" ")[1]

        //se decodifica con el token y el pass de jwt
        const decoded = jwt.verify(token, PASS_JWT);

        const { error, value } = validateAuth.validate(decoded, { abortEarly: false });
        if (error) {
            res.status(401).json({ errors: error.details.map(d => d.message) })
        } else {
            //se asigna el usuario al req user

            req.user = {
                ...value,
                tipoUsuario: value.tipoUsuario
            };
            console.log('Value', req.user)
            //se sigue adelante con next
            next();
        }
    } catch (error) {
        res.status(401).json({ message: "No se pudo autenticar" });
    }
}