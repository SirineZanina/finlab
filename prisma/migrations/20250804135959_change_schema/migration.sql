/*
  Warnings:

  - You are about to drop the column `userId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `plaidAccountId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `plaid_accounts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `businessId` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_userId_fkey";

-- DropForeignKey
ALTER TABLE "plaid_accounts" DROP CONSTRAINT "plaid_accounts_bankId_fkey";

-- DropForeignKey
ALTER TABLE "plaid_accounts" DROP CONSTRAINT "plaid_accounts_businessId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_plaidAccountId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "userId",
ADD COLUMN     "businessId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "plaidAccountId";

-- DropTable
DROP TABLE "plaid_accounts";

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
