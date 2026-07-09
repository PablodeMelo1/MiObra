import express from "express";
import {
    acceptCompanyInvitation,
    confirmEmailVerification,
    createUser,
    loginUser,
    logout,
    resendEmailVerification,
    verifySession,
} from "../../controllers/user-controller.mjs";
import { acceptEmployeeInvitation } from "../../controllers/employee-controller.mjs";
import { validateRequest } from "../../middleware/validation.middleware.mjs";
import {
    validateEmailVerificationConfirm,
    validateEmailVerificationResend,
    validateLogin,
    validateSingup,
} from "../../validations/user-validator.mjs";
import reqValidate from "../../constants/request-validate-constants.mjs";
import { authMiddleware, requireVerifiedEmail } from "../../middleware/auth-middleware.mjs";
import { loadCompanyContext } from "../../middleware/company-context-middleware.mjs";

const routes = express.Router();

routes.post("/signup", validateRequest(validateSingup, reqValidate.BODY), createUser);
routes.post("/login", validateRequest(validateLogin, reqValidate.BODY), loginUser);
routes.post("/email-verification/confirm", validateRequest(validateEmailVerificationConfirm, reqValidate.BODY), confirmEmailVerification);
routes.post("/email-verification/resend", validateRequest(validateEmailVerificationResend, reqValidate.BODY), resendEmailVerification);
routes.post("/logout", authMiddleware, logout);
routes.get("/me", authMiddleware, requireVerifiedEmail, loadCompanyContext({ required: false }), verifySession);
routes.post("/company-invitations/:token/accept", authMiddleware, requireVerifiedEmail, acceptCompanyInvitation);
routes.post("/employee-invitations/:token/accept", authMiddleware, requireVerifiedEmail, acceptEmployeeInvitation);

export default routes;
