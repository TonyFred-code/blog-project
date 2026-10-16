import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
} from "../constants/token.js";

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateAccessToken(userId, email) {
  return jwt.sign({ sub: userId, email }, process.env.JWT_SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });
}

function generateFamilyId() {
  return crypto.randomUUID();
}

function generateRefreshToken() {
  const refreshToken = crypto.randomBytes(32).toString("hex");

  return {
    refreshToken,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_TIME),
  };
}

export {
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  generateFamilyId,
};
