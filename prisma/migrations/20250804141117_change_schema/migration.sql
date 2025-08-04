/*
  Warnings:

  - A unique constraint covering the columns `[plaidId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "plaidId" TEXT;

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "plaidId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_plaidId_key" ON "accounts"("plaidId");
