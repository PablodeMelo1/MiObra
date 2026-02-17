import userRepository from '../repositories/user-repository.mjs';
import bycript from 'bcryptjs';

export const createUser = async (req, res) => {
    try {
        const userRepo = new userRepository();
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }
        const passwordHash = await bycript.hash(password, 10);
        const newUser = { name, email, passwordHash };
        const createdUser = await userRepo.createOne(newUser);
        if (!createdUser) {
            return res.status(500).json({ message: "Error al crear el usuario" });
        }
        res.status(201).json(createdUser);
    } catch (error) {
        throw createError("No pudo crear el usuario", 500);
    }
}

export const loginUser = async (req, res) => {

    const { email, password } = req.body;
    const user = await userRepository.getUserByEmail({ email });
    const { password: passwordHash } = user;
    const validatePassword = await bcrypt.compare(password, passwordHash);

    if (validatePassword) {

        const token = jwt.sign({ id: user._id, email: email, tipoUsuario: user.tipoUsuario }, process.env.PASS_JWT);
        res.status(200).json({ token: token, userId: user._id });
    } else {
        res.status(401).json({ message: "Error en login, verifique credenciales" });
    }
}

export const getUserById = async (req, res) => {
    try {
        const userRepo = new userRepository();
        const { id } = req.params;
        const user = await userRepo.getById({ _id: id });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ user });
    } catch (error) {
        throw createError("No pudo obtener el usuario", 500);
    }
}

export const updateUser = async (req, res) => {
    try {
        const userRepo = new userRepository();
        const { id } = req.params;
        const updateData = req.body;
        const updatedUser = await userRepo.updateById({ _id: id }, updateData);
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
        const userRepo = new userRepository();
        const { id } = req.params;
        const deletedUser = await userRepo.deleteById({ _id: id });
        if (!deletedUser) {
            return res.status(404).json({ message: "Usuario no encontrado o no se pudo eliminar" });
        }
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        throw createError("No pudo eliminar el usuario", 500);
    }
}