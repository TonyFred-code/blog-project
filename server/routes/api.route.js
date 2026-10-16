import { Router } from "express";
import { loginRouter } from "./login.route.js";
import { registerRouter } from "./register.route.js";
import { logoutRouter } from "./logout.route.js";
import { refreshTokenRouter } from "./refreshToken.route.js";
import { jwtStrategyAuth } from "../middleware/authGuards.js";
import { requireCsrfHeader } from "../middleware/csrfGuard.js";

const apiRouter = Router();

apiRouter.use(requireCsrfHeader);

apiRouter.use("/logout", logoutRouter);
apiRouter.use("/login", loginRouter);
apiRouter.use("/register", registerRouter);
apiRouter.use("/token-refresh", refreshTokenRouter);
apiRouter.post("/posts", jwtStrategyAuth, (req, res) => {
  res.json({
    message: "Post route received a request",
    user: req.user,
  });
});

export { apiRouter };
