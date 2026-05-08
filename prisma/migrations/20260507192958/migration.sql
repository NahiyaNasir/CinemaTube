/*
  Warnings:

  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MediaGenres" DROP CONSTRAINT "_MediaGenres_A_fkey";

-- DropTable
DROP TABLE "Genre";

-- CreateTable
CREATE TABLE "genres" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genres_slug_key" ON "genres"("slug");

-- CreateIndex
CREATE INDEX "genres_name_idx" ON "genres"("name");

-- CreateIndex
CREATE INDEX "genres_isPublished_idx" ON "genres"("isPublished");

-- CreateIndex
CREATE INDEX "genres_isFeatured_idx" ON "genres"("isFeatured");

-- AddForeignKey
ALTER TABLE "_MediaGenres" ADD CONSTRAINT "_MediaGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
