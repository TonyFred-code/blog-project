import { COOKIE_KEYS } from "../constants/cookies.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../lib/tokenUtils.js";
import {
  deleteRefreshToken,
  getRefreshTokenByTokenHash,
  getRefreshTokenByReplacedHash,
  revokeTokenFamily,
  rotateRefreshToken,
  issueGraceToken,
} from "../db/refreshToken.js";
import { clearRefreshCookie, setRefreshCookie } from "../lib/cookieUtils.js";

function sendRefreshed(res, user, newRefreshToken) {
  setRefreshCookie(res, newRefreshToken);

  return res.status(200).json({
    message: "Refresh token successful.",
    token: generateAccessToken(user.id, user.email),
    user,
  });
}

async function refreshTokenPost(req, res) {
  const incomingToken = req.cookies?.[COOKIE_KEYS.REFRESH_TOKEN];

  if (!incomingToken) {
    return res
      .status(401)
      .json({ message: "Refresh token not found. Please log in again." });
  }

  try {
    const tokenHash = hashToken(incomingToken);
    const storedToken = await getRefreshTokenByTokenHash(tokenHash);

    if (!storedToken) {
      const successor = await getRefreshTokenByReplacedHash(tokenHash);
      if (successor) {
        await revokeTokenFamily(successor.familyId);
        console.warn(
          `[SECURITY] Token reuse detected — family ${successor.familyId} revoked`
        );
      }
      clearRefreshCookie(res);
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    // Expired token
    if (storedToken.expiresAt <= new Date()) {
      await deleteRefreshToken(storedToken.tokenHash);
      clearRefreshCookie(res);
      return res.status(401).json({ message: "Refresh token has expired." });
    }

    const newTokenDetails = generateRefreshToken();
    let current = storedToken;

    if (!current.isRevoked) {
      const rotated = await rotateRefreshToken(current, newTokenDetails);

      if (rotated) {
        return sendRefreshed(res, current.user, newTokenDetails.refreshToken);
      }

      current = await getRefreshTokenByTokenHash(tokenHash);

      if (!current) {
        clearRefreshCookie(res);
        return res.status(401).json({ message: "Invalid refresh token." });
      }
    }

    if (current.graceExpiresAt && current.graceExpiresAt > new Date()) {
      await issueGraceToken(current, newTokenDetails);

      return sendRefreshed(res, current.user, newTokenDetails.refreshToken);
    }

    await revokeTokenFamily(current.familyId);
    console.warn(`
      [SECURITY] Revoked token replayed past grace window - family ${current.familyId} revoked.`);
    clearRefreshCookie(res);
    return res.status(401).json({ message: "Refresh token has been revoked" });
  } catch (error) {
    console.error("RefreshToken Error:", error);
    clearRefreshCookie(res);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}

export { refreshTokenPost };
