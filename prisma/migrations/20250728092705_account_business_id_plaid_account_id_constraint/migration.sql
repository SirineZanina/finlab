/*
  Warnings:

  - A unique constraint covering the columns `[plaidAccountId,businessId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "accounts_name_businessId_key";

-- CreateIndex
CREATE UNIQUE INDEX "accounts_plaidAccountId_businessId_key" ON "accounts"("plaidAccountId", "businessId");
