/*
  Warnings:

  - Made the column `name` on table `transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `paymentChannel` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."transactions" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "paymentChannel" SET NOT NULL;
