/*
  Warnings:

  - A unique constraint covering the columns `[userId,offerId,status]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'PAUSED';

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_offerId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "cardLastFour" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_subscriptionId_key" ON "Payment"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_offerId_status_key" ON "Subscription"("userId", "offerId", "status");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
