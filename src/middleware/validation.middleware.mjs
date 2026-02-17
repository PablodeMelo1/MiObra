
export const validateRequest = (schema, reqValidate) => {

    //devuelve una funcion clausura que es en realidad un nuevo middleware
    //automaticamente quien use el middleware le inyecta los parametros req res next
    return (req, res, next) => {
        console.log('req', req.params)
        const { error, value } = schema.validate(req[reqValidate], { abortEarly: false });
        if (error) {
            res.status(400).json({
                message: "Datos inválidos en la solicitud",
                detalles: error.details.map(d => d.message)
            });
        } else {
            req[reqValidate] = value;
            next(); //sigue la ejecucion al siguiente middleware o ruta
        }
    }
}


