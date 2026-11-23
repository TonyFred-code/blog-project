import passport from "passport";
import { hashToken } from "../lib/tokenUtils.js";
import {
  getRefreshTokenByTokenHash,
  revokeTokenFamily,
} from "../db/refreshToken.js";
import { COOKIE_KEYS } from "../constants/cookies.js";

async function handleTokenRevocation(req, res, next) {
  const oldRefreshToken = req.cookies?.[COOKIE_KEYS.REFRESH_TOKEN];

  if (oldRefreshToken) {
    try {
      const oldToken = await getRefreshTokenByTokenHash(
        hashToken(oldRefreshToken)
      );

      if (oldToken) {
        await revokeTokenFamily(oldToken.familyId);
      }
    } catch (_) {
      // Ignore error and continue.
    }
  }

  next();
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

export { jwtStrategyAuth, localStrategyAuth, handleTokenRevocation };
