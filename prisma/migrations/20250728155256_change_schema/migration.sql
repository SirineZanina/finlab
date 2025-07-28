/*
  Warnings:

  - You are about to drop the column `date` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `receiverBankId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `senderBankId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "date",
DROP COLUMN "receiverBankId",
DROP COLUMN "receiverId",
DROP COLUMN "senderBankId",
DROP COLUMN "senderId";
