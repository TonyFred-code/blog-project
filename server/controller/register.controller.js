import { hashPassword } from "../lib/passwordUtils.js";
import { createUser } from "../db/user.js";
import { PRISMA_ERROR_CODES } from "../constants/errorCodes.js";
import { handleUniqueConstraintError } from "../lib/prismaUtils.js";
import {
  generateAccessToken,
  generateFamilyId,
  generateRefreshToken,
} from "../lib/tokenUtils.js";
import { createRefreshToken } from "../db/refreshToken.js";
import { setRefreshCookie } from "../lib/cookieUtils.js";

async function registerPost(req, res) {
  try {
    const { email, password } = req.body;

    const hashedPassword = await hashPassword(password);
    const user = await createUser(email, hashedPassword);

    const refreshTokenDetails = generateRefreshToken();
    try {
      await createRefreshToken(
        user.id,
        refreshTokenDetails.expiresAt,
        refreshTokenDetails.tokenHash,
        generateFamilyId()
      );
    } catch (tokenError) {
      console.error(tokenError);
      return res.status(201).json({
        message:
          "Account created, but automatic sign-in failed. Please log in.",
        user,
      });
    }

    setRefreshCookie(res, refreshTokenDetails.refreshToken);

    return res.status(201).json({
      message: "User created successfully",
      token: generateAccessToken(user.id, user.email),
      user,
    });
  } catch (error) {
    console.error(error);

    if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
      const fields = handleUniqueConstraintError(error);

      if (fields.length > 0) {
        return res.status(409).json({
          message: `User with this email already exists`,
        });
      }

      return res.status(400).json({
        message:
          "One or more fields caused a constraint violation. Please check your inputs and try again.",
      });
    }

    return res.status(503).json({
      message: "Internal server error. Please try again later.",
    });
  }
}

export { registerPost };
