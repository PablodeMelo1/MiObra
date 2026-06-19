export const validateRequest = (schema, reqValidate) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[reqValidate], { abortEarly: false });
        if (error) {
            return res.status(400).json({
                message: "Revisa los datos ingresados",
                detalles: error.details.map((detail) => ({
                    field: detail.path.join('.'),
                    message: detail.message.replaceAll('"', ''),
                })),
            });
        }

        req[reqValidate] = value;
        next();
    };
};
