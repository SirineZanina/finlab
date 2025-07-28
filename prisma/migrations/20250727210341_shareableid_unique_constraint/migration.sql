/*
  Warnings:

  - A unique constraint covering the columns `[shareableId]` on the table `banks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "banks_shareableId_key" ON "banks"("shareableId");
