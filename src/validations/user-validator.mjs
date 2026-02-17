import joi from "joi";

export const validateCreateUser = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
});

export const validateAuth = Joi.object({
    id: Joi.string().required(),
    email: Joi.string().regex(/.+@.+\..+/).required(),
    tipoUsuario: Joi.string().valid("user", "admin"),
    role: Joi.string().valid("user", "admin"),
    iat: Joi.number().integer()
});

export const validateSingup = Joi.object({
    name: Joi.string().min(3).max(40).required(),
    email: Joi.string().regex(/.+@.+\..+/).required(),
    password: Joi.string().min(3).max(20).required(),
    profileImage: Joi.string().uri().optional(),
    profileImagePublicId: Joi.string().optional()
});


export const validateLogin = Joi.object({
    email: Joi.string().regex(/.+@.+\..+/).required(),
    password: Joi.string().min(3).max(20).required()
});