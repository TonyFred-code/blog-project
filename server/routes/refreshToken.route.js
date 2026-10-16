import { Router } from "express";
import { refreshTokenPost } from "../controller/tokenRefresh.controller.js";

const refreshTokenRouter = Router();

refreshTokenRouter.post("/", refreshTokenPost);

export { refreshTokenRouter };
