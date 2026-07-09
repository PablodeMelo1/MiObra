import jwt from "jsonwebtoken";
import "dotenv/config";
import { validateAuth } from "../validations/user-validator.mjs";
import { loadCompanyContext } from "./company-context-middleware.mjs";
import UserRepository from "../repositories/user-repository.mjs";

const { PASS_JWT } = process.env;


export const authMiddleware = (req, res, next) => {
    try {
        // try cookie first, then Authorization header
        const tokenFromCookie = req.cookies && req.cookies.token;
        const authHeader = req.headers.authorization;
        let token = tokenFromCookie;
        if (!token && authHeader) {
            // separa el authorization por el espacion y se queda con el segundo campo (el token en si)
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "No se pudo autenticar" });
        }

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
            //se sigue adelante con next
            next();
        }
    } catch (error) {
        res.status(401).json({ message: "No se pudo autenticar" });
    }
}

export const requireVerifiedEmail = async (req, res, next) => {
    try {
        const userRepo = new UserRepository();
        const user = await userRepo.getById(req.user?.id);

        if (!user) {
            return res.status(401).json({ message: "No se pudo autenticar" });
        }

        if (user.emailVerificationStatus && user.emailVerificationStatus !== 'verified') {
            return res.status(403).json({
                message: 'Debes verificar tu email para continuar',
                code: 'EMAIL_NOT_VERIFIED',
                email: user.email,
                emailVerificationStatus: user.emailVerificationStatus,
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "No pudo validar el estado de verificacion" });
    }
};

export const auth = [authMiddleware, requireVerifiedEmail, loadCompanyContext()];
