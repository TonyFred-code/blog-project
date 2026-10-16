import {
  PRISMA_ERROR_CODES,
  REFRESH_TOKEN_ERROR_CODES,
} from "../constants/errorCodes.js";
import { REFRESH_TOKEN_GRACE_PERIOD } from "../constants/token.js";
import prisma from "../db/prisma.js";
import { AppError } from "../lib/errorUtils.js";

async function createRefreshToken(
  userId,
  expiresAt,
  tokenHash,
  familyId,
  replacedByTokenHash = null
) {
  try {
    return await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
        replacedByTokenHash,
        familyId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new AppError(
      "Failed to create refresh token",
      500,
      REFRESH_TOKEN_ERROR_CODES.TOKEN_CREATION_ERROR
    );
  }
}

async function deleteRefreshToken(tokenHash) {
  try {
    return await prisma.refreshToken.delete({
      where: { tokenHash },
    });
  } catch (error) {
    if (error.code !== PRISMA_ERROR_CODES.RECORD_NOT_FOUND) {
      console.error(error);
      throw new AppError(
        "Failed to delete refresh token",
        500,
        REFRESH_TOKEN_ERROR_CODES.TOKEN_DELETION_ERROR
      );
    }
  }
}

async function revokeTokenFamily(familyId) {
  return prisma.refreshToken.deleteMany({
    where: { familyId },
  });
}

async function getRefreshTokenByTokenHash(tokenHash) {
  try {
    return await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: { id: true, email: true, createdAt: true, updatedAt: true },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new AppError(
      "Failed to get refresh token",
      500,
      REFRESH_TOKEN_ERROR_CODES.TOKEN_NOT_FOUND
    );
  }
}

async function getRefreshTokenByReplacedHash(tokenHash) {
  return prisma.refreshToken.findFirst({
    where: { replacedByTokenHash: tokenHash },
    select: { familyId: true },
  });
}

async function rotateRefreshToken(storedToken, newTokenDetails) {
  return prisma.$transaction(async (tx) => {
    // Mark old token as revoked and record what replaced it
    const { count } = await tx.refreshToken.updateMany({
      where: { tokenHash: storedToken.tokenHash, isRevoked: false },
      data: {
        isRevoked: true,
        replacedByTokenHash: newTokenDetails.tokenHash,
        graceExpiresAt: new Date(Date.now() + REFRESH_TOKEN_GRACE_PERIOD),
      },
    });

    if (!count || count === 0) return null;

    // Create new token in the same family
    return tx.refreshToken.create({
      data: {
        tokenHash: newTokenDetails.tokenHash,
        userId: storedToken.userId,
        expiresAt: newTokenDetails.expiresAt,
        familyId: storedToken.familyId,
      },
    });
  });
}

async function issueGraceToken(storedToken, newTokenDetails) {
  return prisma.refreshToken.create({
    data: {
      tokenHash: newTokenDetails.tokenHash,
      userId: storedToken.userId,
      expiresAt: newTokenDetails.expiresAt,
      familyId: storedToken.familyId,
    },
  });
}

export {
  createRefreshToken,
  deleteRefreshToken,
  revokeTokenFamily,
  getRefreshTokenByTokenHash,
  getRefreshTokenByReplacedHash,
  rotateRefreshToken,
  issueGraceToken,
};
