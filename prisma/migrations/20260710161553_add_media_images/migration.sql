-- AlterTable
ALTER TABLE "media" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
