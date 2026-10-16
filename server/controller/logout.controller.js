import { COOKIE_KEYS } from "../constants/cookies.js";
import {
  deleteRefreshToken,
  getRefreshTokenByTokenHash,
  revokeTokenFamily,
} from "../db/refreshToken.js";
import { clearRefreshCookie } from "../lib/cookieUtils.js";
import { hashToken } from "../lib/tokenUtils.js";

async function logoutPost(req, res) {
  const incomingToken = req.cookies?.[COOKIE_KEYS.REFRESH_TOKEN];

  if (incomingToken) {
    try {
      const storedToken = await getRefreshTokenByTokenHash(
        hashToken(incomingToken)
      );

      if (storedToken) {
        await revokeTokenFamily(storedToken.familyId);
      }
    } catch (error) {
      console.error(error);
    }
  }

  clearRefreshCookie(res);
  return res.status(200).json({ message: "Logged out successfully" });
}

export { logoutPost };
