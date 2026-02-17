export const createError = (message, code) => {
    console.log('message', message)
    const error = new Error(message);
    error.statusCode = code;
    return error;
}