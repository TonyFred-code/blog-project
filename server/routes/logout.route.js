import { Router } from "express";
import { logoutPost } from "../controller/logout.controller.js";

const logoutRouter = Router();

logoutRouter.post("/", logoutPost);

export { logoutRouter };
