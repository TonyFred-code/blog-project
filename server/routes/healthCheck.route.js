import { Router } from "express";
import { getHealthCheck } from "../controller/healthCheck.controller.js";

const healthCheckRouter = Router();

healthCheckRouter.get("/", getHealthCheck);

export { healthCheckRouter };
