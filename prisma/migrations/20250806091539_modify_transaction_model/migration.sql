/*
  Warnings:

  - You are about to drop the column `type` on the `transactions` table. All the data in the column will be lost.
  - Made the column `date` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."transactions" DROP COLUMN "type",
ALTER COLUMN "date" SET NOT NULL;
