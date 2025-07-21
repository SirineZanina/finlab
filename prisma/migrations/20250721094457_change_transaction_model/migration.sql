/*
  Warnings:

  - You are about to drop the column `businessId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,createdAt,accountId]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessId` to the `banks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_businessId_fkey";

-- DropIndex
DROP INDEX "transactions_name_createdAt_accountId_businessId_key";

-- AlterTable
ALTER TABLE "banks" ADD COLUMN     "businessId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "businessId",
DROP COLUMN "type",
ADD COLUMN     "receiverId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_name_createdAt_accountId_key" ON "transactions"("name", "createdAt", "accountId");

-- AddForeignKey
ALTER TABLE "banks" ADD CONSTRAINT "banks_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
