import {
  generateAccessToken,
  generateFamilyId,
  generateRefreshToken,
} from "../lib/tokenUtils.js";
import { createRefreshToken } from "../db/refreshToken.js";
import { AppError } from "../lib/errorUtils.js";
import { REFRESH_TOKEN_ERROR_CODES } from "../constants/errorCodes.js";
import { setRefreshCookie } from "../lib/cookieUtils.js";

async function loginPost(req, res) {
  const user = req.user;
  const accessToken = generateAccessToken(user.id, user.email);
  const refreshTokenDetails = generateRefreshToken();
  const familyId = generateFamilyId();

  try {
    await createRefreshToken(
      user.id,
      refreshTokenDetails.expiresAt,
      refreshTokenDetails.tokenHash,
      familyId
    );
  } catch (error) {
    if (error instanceof AppError) {
      if (error.errorCode === REFRESH_TOKEN_ERROR_CODES.TOKEN_CREATION_ERROR) {
        return res.status(503).json({
          message: "Failed to create session. Please try again.",
        });
      }
    }

    console.error(error);

    return res.status(500).json({
      message: "An unknown error occurred. Please try again.",
    });
  }

  setRefreshCookie(res, refreshTokenDetails.refreshToken);

  return res.status(200).json({
    message: "Login successful",
    token: accessToken,
    user,
  });
}

export { loginPost };
