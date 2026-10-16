import passport from "passport";

function restrictIfAuthenticated(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return res.status(500).json({
        message: "Internal server error. Please try again later.",
      });
    }

    if (user) {
      return res.status(403).json({
        message: "You are already authenticated",
      });
    }

    return next();
  })(req, res, next);
}

function jwtStrategyAuth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        message: "Internal server error. Please try again later.",
      });
    }

    if (!user) {
      return res.status(401).json({
        message: info?.message || "Invalid token",
      });
    }

    req.user = user;
    return next();
  })(req, res, next);
}

function localStrategyAuth(req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(503).json({
        message: "Internal server error. Please try again later.",
      });
    }

    if (!user) {
      return res.status(401).json({
        message: info?.message || "Invalid email or password",
      });
    }

    req.user = user;
    return next();
  })(req, res, next);
}

export { restrictIfAuthenticated, jwtStrategyAuth, localStrategyAuth };
