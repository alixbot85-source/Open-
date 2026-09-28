ALTER TABLE "EmailDelivery"
  ADD COLUMN "telegramChatId" TEXT,
  ADD COLUMN "deliveredVia" TEXT,
  ADD COLUMN "telegramDeliveredAt" TIMESTAMP(3);
CREATE INDEX "EmailDelivery_status_scheduledFor_idx" ON "EmailDelivery"("status", "scheduledFor");
