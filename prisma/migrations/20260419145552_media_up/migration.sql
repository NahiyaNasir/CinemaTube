/*
  Warnings:

  - You are about to drop the column `genre` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `releaseYear` on the `media` table. All the data in the column will be lost.
  - Added the required column `releaseDate` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media" DROP COLUMN "genre",
DROP COLUMN "releaseYear",
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "releaseDate" INTEGER NOT NULL;
