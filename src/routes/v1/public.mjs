import express from "express";
import { acceptCompanyInvitation, createUser, loginUser, logout, verifySession} from "../../controllers/user-controller.mjs";
import { validateRequest } from "../../middleware/validation.middleware.mjs";
import { validateLogin, validateSingup } from "../../validations/user-validator.mjs";
import reqValidate from "../../constants/request-validate-constants.mjs";
import { authMiddleware } from "../../middleware/auth-middleware.mjs";
import { loadCompanyContext } from "../../middleware/company-context-middleware.mjs";

const routes = express.Router();

routes.post("/signup", validateRequest(validateSingup, reqValidate.BODY), createUser);
routes.post("/login", validateRequest(validateLogin, reqValidate.BODY), loginUser);
routes.post("/logout", authMiddleware, logout);
routes.get("/me", authMiddleware, loadCompanyContext({ required: false }), verifySession);
routes.post("/company-invitations/:token/accept", authMiddleware, acceptCompanyInvitation);

export default routes;
