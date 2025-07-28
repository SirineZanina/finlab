/*
  Warnings:

  - A unique constraint covering the columns `[shareableId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "accounts_shareableId_key" ON "accounts"("shareableId");
