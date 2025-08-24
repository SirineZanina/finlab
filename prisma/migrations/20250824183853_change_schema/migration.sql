/*
  Warnings:

  - You are about to drop the column `countryId` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `businessId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `plaidId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,date,accountId,amount]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `availableBalance` on table `accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currentBalance` on table `accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bankId` on table `accounts` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `addressId` to the `businesses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ssn` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."BusinessIndustry" ADD VALUE 'INDIVIDUAL';

-- DropForeignKey
ALTER TABLE "public"."accounts" DROP CONSTRAINT "accounts_bankId_fkey";

-- DropForeignKey
ALTER TABLE "public"."businesses" DROP CONSTRAINT "businesses_countryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."categories" DROP CONSTRAINT "categories_businessId_fkey";

-- DropIndex
DROP INDEX "public"."transactions_name_createdAt_accountId_key";

-- AlterTable
ALTER TABLE "public"."accounts" ALTER COLUMN "availableBalance" SET NOT NULL,
ALTER COLUMN "currentBalance" SET NOT NULL,
ALTER COLUMN "bankId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."businesses" DROP COLUMN "countryId",
ADD COLUMN     "addressId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."categories" DROP COLUMN "businessId",
DROP COLUMN "plaidId";

-- AlterTable
ALTER TABLE "public"."countries" ADD COLUMN     "flagUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "country",
ADD COLUMN     "addressId" TEXT NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ssn" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."addresses" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "accounts_businessId_idx" ON "public"."accounts"("businessId");

-- CreateIndex
CREATE INDEX "accounts_source_idx" ON "public"."accounts"("source");

-- CreateIndex
CREATE INDEX "transactions_accountId_date_idx" ON "public"."transactions"("accountId", "date");

-- CreateIndex
CREATE INDEX "transactions_date_idx" ON "public"."transactions"("date");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_name_date_accountId_amount_key" ON "public"."transactions"("name", "date", "accountId", "amount");

-- CreateIndex
CREATE INDEX "users_businessId_idx" ON "public"."users"("businessId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."businesses" ADD CONSTRAINT "businesses_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "public"."banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
