-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('PUBLISHED', 'DRAFT', 'UNPUBLISHED');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "status" "PostStatus" NOT NULL DEFAULT 'DRAFT';

-- Backfill PostStatus from published column
UPDATE "Post" SET "status" = 'PUBLISHED' WHERE "published" = true;