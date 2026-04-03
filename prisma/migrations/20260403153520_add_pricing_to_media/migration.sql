-- AlterTable
ALTER TABLE "media" ADD COLUMN     "buyPrice" DOUBLE PRECISION,
ADD COLUMN     "pricing" "Pricing" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "rentalPrice" DOUBLE PRECISION;
