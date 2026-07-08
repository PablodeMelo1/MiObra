import Joi from "joi";

export const validateCreateUser = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
});

export const validateAuth = Joi.object({
    id: Joi.string().required(),
    email: Joi.string().regex(/.+@.+\..+/).required(),
    tipoUsuario: Joi.string().valid("user", "admin"),
    role: Joi.string().valid("user", "admin"),
    activeCompanyId: Joi.string().optional(),
    iat: Joi.number().integer(),
    exp: Joi.number().integer()
});

export const validateSingup = Joi.object({
    name: Joi.string().min(3).max(40).required(),
    email: Joi.string().regex(/.+@.+\..+/).required(),
    password: Joi.string().min(3).max(20).required(),
    companyName: Joi.string().min(2).max(80).when('invitationToken', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required(),
    }),
    invitationToken: Joi.string().min(20).max(200).optional(),
    profileImage: Joi.string().uri().optional(),
    profileImagePublicId: Joi.string().optional()
}).messages({
    'any.required': 'El campo {#label} es obligatorio',
    'string.empty': 'El campo {#label} es obligatorio',
    'string.min': 'El campo {#label} debe tener al menos {#limit} caracteres',
    'string.max': 'El campo {#label} no puede superar {#limit} caracteres',
    'string.pattern.base': 'El email ingresado no es valido',
});


export const validateLogin = Joi.object({
    email: Joi.string().regex(/.+@.+\..+/).required(),
    password: Joi.string().min(3).max(20).required()
}).messages({
    'any.required': 'El campo {#label} es obligatorio',
    'string.empty': 'El campo {#label} es obligatorio',
    'string.min': 'El campo {#label} debe tener al menos {#limit} caracteres',
    'string.max': 'El campo {#label} no puede superar {#limit} caracteres',
    'string.pattern.base': 'El email ingresado no es valido',
});
