/*
  Warnings:

  - You are about to drop the column `averageRating` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `genres` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `streamUrl` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `totalRatings` on the `media` table. All the data in the column will be lost.
  - You are about to alter the column `buyPrice` on the `media` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `rentalPrice` on the `media` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[title,releaseYear]` on the table `media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `director` to the `media` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `media` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_createdById_fkey";

-- DropIndex
DROP INDEX "media_title_type_idx";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "averageRating",
DROP COLUMN "coverImage",
DROP COLUMN "createdById",
DROP COLUMN "genres",
DROP COLUMN "streamUrl",
DROP COLUMN "totalRatings",
ADD COLUMN     "avgRating" DOUBLE PRECISION,
ADD COLUMN     "backdropUrl" TEXT,
ADD COLUMN     "director" TEXT NOT NULL,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "posterUrl" TEXT,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "runtimeMinutes" INTEGER,
ADD COLUMN     "seasons" INTEGER,
ADD COLUMN     "streamingUrl" TEXT,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "buyPrice" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "rentalPrice" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "cast_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "image" TEXT,
    "mediaId" TEXT NOT NULL,

    CONSTRAINT "cast_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MediaAddedBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MediaAddedBy_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MediaAddedBy_B_index" ON "_MediaAddedBy"("B");

-- CreateIndex
CREATE INDEX "media_title_idx" ON "media"("title");

-- CreateIndex
CREATE INDEX "media_type_idx" ON "media"("type");

-- CreateIndex
CREATE INDEX "media_releaseYear_idx" ON "media"("releaseYear");

-- CreateIndex
CREATE INDEX "media_director_idx" ON "media"("director");

-- CreateIndex
CREATE INDEX "media_pricing_idx" ON "media"("pricing");

-- CreateIndex
CREATE INDEX "media_isFeatured_idx" ON "media"("isFeatured");

-- CreateIndex
CREATE INDEX "media_createdAt_idx" ON "media"("createdAt");

-- CreateIndex
CREATE INDEX "media_viewCount_idx" ON "media"("viewCount");

-- CreateIndex
CREATE UNIQUE INDEX "media_title_releaseYear_key" ON "media"("title", "releaseYear");

-- AddForeignKey
ALTER TABLE "cast_members" ADD CONSTRAINT "cast_members_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaAddedBy" ADD CONSTRAINT "_MediaAddedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaAddedBy" ADD CONSTRAINT "_MediaAddedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
