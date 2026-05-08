ALTER TABLE "Subscription" ADD COLUMN "soldPrice" INTEGER;

ALTER TABLE "Subscription" ADD COLUMN "cancellationRequestedAt" TIMESTAMP(3);

ALTER TABLE "Subscription" ADD COLUMN "gracePeriodEndAt" TIMESTAMP(3);

ALTER TYPE "SubscriptionStatus" ADD VALUE 'CANCELLATION_PENDING';
