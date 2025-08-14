/*
  Warnings:

  - A unique constraint covering the columns `[trackingNumber]` on the table `CourierTracking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CourierTracking_trackingNumber_key" ON "CourierTracking"("trackingNumber");
