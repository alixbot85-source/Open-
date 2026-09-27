CREATE TABLE "PaymentSettings" ("id" SERIAL PRIMARY KEY,"tronAddress" TEXT,"usdtTrc20Address" TEXT,"updatedAt" TIMESTAMP(3) NOT NULL);
ALTER TABLE "Order" ADD COLUMN "paymentCurrency" TEXT, ADD COLUMN "paymentWallet" TEXT, ADD COLUMN "txHash" TEXT, ADD COLUMN "paymentSubmittedAt" TIMESTAMP(3), ADD COLUMN "paymentReviewedAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "Order_txHash_key" ON "Order"("txHash");
