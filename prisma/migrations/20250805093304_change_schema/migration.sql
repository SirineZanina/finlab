/*
  Warnings:

  - You are about to drop the column `category` on the `transactions` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `payee` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Made the column `pending` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_accountId_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "payee" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ALTER COLUMN "pending" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
