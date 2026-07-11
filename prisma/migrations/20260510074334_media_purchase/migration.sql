-- DropForeignKey
ALTER TABLE "media_purchases" DROP CONSTRAINT "media_purchases_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "media_purchases" DROP CONSTRAINT "media_purchases_userId_fkey";

-- AlterTable
ALTER TABLE "media_purchases" ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "stripePaymentId" TEXT,
ALTER COLUMN "type" SET DEFAULT 'RENTAL';

-- AddForeignKey
ALTER TABLE "media_purchases" ADD CONSTRAINT "media_purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_purchases" ADD CONSTRAINT "media_purchases_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
