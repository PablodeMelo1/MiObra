import express from "express";
import {
    createUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser
} from "../../controllers/user-controller.mjs";

const routes = express.Router();

routes.post("/", createUser);
routes.post("/login", loginUser);
routes.get("/:id", getUserById);
routes.put("/:id", updateUser);
routes.delete("/:id", deleteUser);

export default routes;
