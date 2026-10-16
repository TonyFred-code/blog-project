import { COOKIE_KEYS } from "../constants/cookies.js";
import { REFRESH_TOKEN_EXPIRATION_TIME } from "../constants/token.js";

function baseOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };
}

function setRefreshCookie(res, token) {
  res.cookie(COOKIE_KEYS.REFRESH_TOKEN, token, {
    ...baseOptions(),
    maxAge: REFRESH_TOKEN_EXPIRATION_TIME,
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(COOKIE_KEYS.REFRESH_TOKEN, baseOptions());
}

export { setRefreshCookie, clearRefreshCookie };
