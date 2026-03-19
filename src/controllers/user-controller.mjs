import UserRepository from '../repositories/user-repository.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../error/create-error.mjs';
import { userRoles } from '../constants/userRole.mjs';

const signTokenAndSetCookie = (res, user) => {
    const token = jwt.sign(
        { id: user._id, email: user.email, tipoUsuario: user.tipoUsuario },
        process.env.PASS_JWT
    );
    res.cookie("token", token, {
        httpOnly: process.env.NODE_ENV !== "development",
        secure: process.env.NODE_ENV !== "development",  // solo HTTPS en producción
        sameSite: "lax",
    });
    return token;
};

export const createUser = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        // verificar si el email ya existe
        const existing = await userRepo.getByEmail(email);
        if (existing) {
            return res.status(409).json({ message: 'El email ya está registrado' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = { name, email, passwordHash };
        const createdUser = await userRepo.createOne(newUser);
        if (!createdUser) {
            return res.status(500).json({ message: "Error al crear el usuario" });
        }
        signTokenAndSetCookie(res, createdUser);
        res.status(201).json(createdUser);
    } catch (error) {
        console.error('createUser error:', error);
        return res.status(500).json({ message: "No pudo crear el usuario", error: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRepo = new UserRepository();
        const user = await userRepo.getByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Error en login, verifique credenciales" });
        }
        const passwordHash = user.passwordHash;
        const validatePassword = await bcrypt.compare(password, passwordHash);

        if (validatePassword) {
            const token = signTokenAndSetCookie(res, user);
            res.status(200).json({ token, userId: user._id });
        } else {
            res.status(401).json({ message: "Error en login, verifique credenciales" });
        }
    } catch (error) {
        throw createError("Error en login", 500);
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Usuario deslogueado exitosamente" });
    }
    catch (error) {
        throw createError("No pudo cerrar sesión", 500);
    }
}

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
        res.status(200).json({ user: fullUser });
    } catch (error) {
        throw createError("No pudo verificar la sesión", 500);
    }
}

export const getUserById = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const { id } = req.params;
        const user = await userRepo.getById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ user });
    } catch (error) {
        throw createError("No pudo obtener el usuario", 500);
    }
}
export const getAll = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const users = await userRepo.getAll();
        res.status(200).json(users);
    } catch (error) {
        throw createError("No pudo obtener los usuarios", 500);
    }
}

export const updateUser = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const { id } = req.params;
        const updateData = req.body;
        const updatedUser = await userRepo.updateById(id, updateData);
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado o no se pudo actualizar" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        throw createError("No pudo actualizar el usuario", 500);
    }
}

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
}

export const changeUserRole = async (req, res) => {
    try {
        const userRepo = new UserRepository();
        const { id } = req.params;
        const { tipoUsuario } = req.body;

        if (!tipoUsuario || !Object.values(userRoles).includes(tipoUsuario)) {
            return res.status(400).json({
                message: `Rol inválido. Los roles válidos son: ${Object.values(userRoles).join(", ")}`,
            });
        }

        // un admin no puede quitarse su propio rol de admin
        if (req.user.id === id && tipoUsuario !== userRoles.ADMIN) {
            return res.status(403).json({ message: "No puedes cambiar tu propio rol" });
        }

        const updatedUser = await userRepo.updateById(id, { tipoUsuario });
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Rol actualizado correctamente", user: updatedUser });
    } catch (error) {
        throw createError("No pudo cambiar el rol del usuario", 500);
    }
}