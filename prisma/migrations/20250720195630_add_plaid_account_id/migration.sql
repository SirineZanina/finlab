/*
  Warnings:

  - A unique constraint covering the columns `[plaidAccountId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plaidAccountId` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "plaidAccountId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_plaidAccountId_key" ON "accounts"("plaidAccountId");
