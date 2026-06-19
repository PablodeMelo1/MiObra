import UserRepository from '../repositories/user-repository.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../error/create-error.mjs';
import { userRoles } from '../constants/userRole.mjs';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const getCookieOptions = () => {
    const configuredSameSite = String(process.env.COOKIE_SAME_SITE || '').toLowerCase();
    const sameSite = ['strict', 'lax', 'none'].includes(configuredSameSite) ? configuredSameSite : 'lax';
    const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

    return {
        httpOnly: true,
        secure: isProduction || sameSite === 'none',
        sameSite,
        path: '/',
        maxAge: ONE_WEEK_MS,
    };
};

const serializeUser = (user) => {
    const plainUser = typeof user.toObject === 'function' ? user.toObject() : user;
    const { passwordHash, __v, ...safeUser } = plainUser;
    return safeUser;
};

const signTokenAndSetCookie = (res, user) => {
    if (!process.env.PASS_JWT) {
        throw createError("Falta configurar PASS_JWT", 500);
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, tipoUsuario: user.tipoUsuario },
        process.env.PASS_JWT,
        { expiresIn: '7d' }
    );
    res.cookie("token", token, getCookieOptions());
    return token;
};

export const createUser = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        const existing = await userRepo.getByEmail(email);
        if (existing) {
            return res.status(409).json({ message: 'El email ya esta registrado' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = { name, email, passwordHash };
        const createdUser = await userRepo.createOne(newUser);
        if (!createdUser) {
            return res.status(500).json({ message: "Error al crear el usuario" });
        }
        signTokenAndSetCookie(res, createdUser);
        res.status(201).json({ user: serializeUser(createdUser) });
    } catch (error) {
        console.error('createUser error:', error);
        return res.status(error.statusCode || 500).json({ message: error.message || "No pudo crear el usuario" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRepo = new UserRepository();
        const user = await userRepo.getByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Email o contrasena incorrectos" });
        }
        const passwordHash = user.passwordHash;
        const validatePassword = await bcrypt.compare(password, passwordHash);

        if (validatePassword) {
            signTokenAndSetCookie(res, user);
            res.status(200).json({ user: serializeUser(user) });
        } else {
            res.status(401).json({ message: "Email o contrasena incorrectos" });
        }
    } catch (error) {
        console.error('loginUser error:', error);
        throw createError(error.message || "Error en login", error.statusCode || 500);
    }
};

export const logout = async (req, res) => {
    try {
        const clearOptions = getCookieOptions();
        delete clearOptions.maxAge;
        res.clearCookie("token", clearOptions);
        res.status(200).json({ message: "Usuario deslogueado exitosamente" });
    }
    catch (error) {
        throw createError("No pudo cerrar sesion", 500);
    }
};

export const verifySession = async (req, res) => {
    try {
        const sessionUser = req.user;
        if (!sessionUser) {
            return res.status(401).json({ message: "No autenticado" });
        }
        const userRepo = new UserRepository();
        const fullUser = await userRepo.getById(sessionUser.id);
        if (!fullUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ user: serializeUser(fullUser) });
    } catch (error) {
        throw createError("No pudo verificar la sesion", 500);
    }
};

export const getUserById = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const { id } = req.params;
        const user = await userRepo.getById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ user: serializeUser(user) });
    } catch (error) {
        throw createError("No pudo obtener el usuario", 500);
    }
};

export const getAll = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const users = await userRepo.getAll();
        res.status(200).json(users.map(serializeUser));
    } catch (error) {
        throw createError("No pudo obtener los usuarios", 500);
    }
};

export const updateUser = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const { id } = req.params;
        const updateData = req.body;
        const updatedUser = await userRepo.updateById(id, updateData);
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado o no se pudo actualizar" });
        }
        res.status(200).json(serializeUser(updatedUser));
    } catch (error) {
        throw createError("No pudo actualizar el usuario", 500);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const { id } = req.params;
        const deletedUser = await userRepo.deleteById(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "Usuario no encontrado o no se pudo eliminar" });
        }
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        throw createError("No pudo eliminar el usuario", 500);
    }
};

export const changeUserRole = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const { id } = req.params;
        const { tipoUsuario } = req.body;

        if (!tipoUsuario || !Object.values(userRoles).includes(tipoUsuario)) {
            return res.status(400).json({
                message: `Rol invalido. Los roles validos son: ${Object.values(userRoles).join(", ")}`,
            });
        }

        if (req.user.id === id && tipoUsuario !== userRoles.ADMIN) {
            return res.status(403).json({ message: "No puedes cambiar tu propio rol" });
        }

        const updatedUser = await userRepo.updateById(id, { tipoUsuario });
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Rol actualizado correctamente", user: serializeUser(updatedUser) });
    } catch (error) {
        throw createError("No pudo cambiar el rol del usuario", 500);
    }
};
