/*
  Warnings:

  - You are about to drop the column `availableBalance` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `currentBalance` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `institutionId` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `mask` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `officialName` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `plaidId` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `shareableId` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `subtype` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the `manual_accounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_bankId_fkey";

-- DropForeignKey
ALTER TABLE "manual_accounts" DROP CONSTRAINT "manual_accounts_businessId_fkey";

-- DropIndex
DROP INDEX "accounts_plaidId_businessId_key";

-- DropIndex
DROP INDEX "accounts_plaidId_key";

-- DropIndex
DROP INDEX "accounts_shareableId_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "availableBalance",
DROP COLUMN "currentBalance",
DROP COLUMN "institutionId",
DROP COLUMN "mask",
DROP COLUMN "officialName",
DROP COLUMN "plaidId",
DROP COLUMN "shareableId",
DROP COLUMN "subtype",
DROP COLUMN "type",
ALTER COLUMN "bankId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "plaidAccountId" TEXT;

-- DropTable
DROP TABLE "manual_accounts";

-- CreateTable
CREATE TABLE "plaid_accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "availableBalance" DOUBLE PRECISION NOT NULL,
    "currentBalance" DOUBLE PRECISION NOT NULL,
    "officialName" TEXT NOT NULL,
    "mask" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subtype" TEXT NOT NULL,
    "shareableId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bankId" TEXT NOT NULL,
    "plaidId" TEXT NOT NULL,

    CONSTRAINT "plaid_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plaid_accounts_shareableId_key" ON "plaid_accounts"("shareableId");

-- CreateIndex
CREATE UNIQUE INDEX "plaid_accounts_plaidId_key" ON "plaid_accounts"("plaidId");

-- CreateIndex
CREATE UNIQUE INDEX "plaid_accounts_plaidId_businessId_key" ON "plaid_accounts"("plaidId", "businessId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plaid_accounts" ADD CONSTRAINT "plaid_accounts_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plaid_accounts" ADD CONSTRAINT "plaid_accounts_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_plaidAccountId_fkey" FOREIGN KEY ("plaidAccountId") REFERENCES "plaid_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
