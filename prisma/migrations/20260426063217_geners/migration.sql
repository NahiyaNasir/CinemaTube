/*
  Warnings:

  - Added the required column `updatedAt` to the `Genre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Genre" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
