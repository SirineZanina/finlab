/*
  Warnings:

  - You are about to drop the column `channel` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,createdAt,accountId,businessId]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `type` on the `accounts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `senderId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "transactions_name_date_accountId_businessId_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "channel",
ADD COLUMN     "senderId" TEXT NOT NULL,
ALTER COLUMN "pending" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;

-- DropTable
DROP TABLE "categories";

-- CreateIndex
CREATE UNIQUE INDEX "transactions_name_createdAt_accountId_businessId_key" ON "transactions"("name", "createdAt", "accountId", "businessId");
