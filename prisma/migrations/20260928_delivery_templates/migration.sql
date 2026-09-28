CREATE TABLE "DeliveryTemplate" (
  "id" SERIAL PRIMARY KEY,
  "productType" TEXT NOT NULL UNIQUE,
  "emailSubject" TEXT NOT NULL,
  "emailBody" TEXT NOT NULL,
  "pdfPath" TEXT,
  "requiresPdf" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE "EmailDelivery" ALTER COLUMN "pdfPath" DROP NOT NULL;
ALTER TABLE "EmailDelivery" ADD COLUMN "deliveryData" JSONB;
