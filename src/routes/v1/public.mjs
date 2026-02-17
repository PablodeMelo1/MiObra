import express from "express";
import { createUser, loginUser, } from "../../controllers/user-controller.mjs";
import { validateRequest } from "../../middleware/validation.middleware.mjs";
import { validateLogin, validateSingup } from "../../validations/user-validator.mjs";
import reqValidate from "../../constants/request-validate-constants.mjs";

const routes = express.Router();

routes.post("/signup", validateRequest(validateSingup, reqValidate.BODY), createUser);
routes.post("/login", validateRequest(validateLogin, reqValidate.BODY), loginUser);

export default routes;