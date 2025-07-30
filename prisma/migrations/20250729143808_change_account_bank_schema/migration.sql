/*
  Warnings:

  - You are about to drop the column `plaidAccountId` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `plaidAccountId` on the `banks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[plaidId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plaidId,businessId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plaidId` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plaidId` to the `banks` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "accounts_plaidAccountId_businessId_key";

-- DropIndex
DROP INDEX "accounts_plaidAccountId_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "plaidAccountId",
ADD COLUMN     "plaidId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "banks" DROP COLUMN "plaidAccountId",
ADD COLUMN     "plaidId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_plaidId_key" ON "accounts"("plaidId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_plaidId_businessId_key" ON "accounts"("plaidId", "businessId");
