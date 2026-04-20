/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "media_slug_key" ON "media"("slug");
